import { IIntent } from './interface/IIntent';

const dialogflow = require('dialogflow');
const express = require('express')
const app = express()
const stringUtils = require('./Utils/StringUtils');

app.get('/', (req, res) =>  renderHtml(res));
app.get('/matchintent', (req, res) => runSample('x-petch').then(() => console.log('Success')).catch(() => console.log('obligatory catch')));
app.listen(3000, () => console.log('Example app listening on port 3000!'));

function renderHtml(res){
    res.set('Content-Type', 'text/html');
    var htmlText = buildHtml();
    res.send(new Buffer(htmlText));
}

function buildHtml(){
    var text = '';
    text += '<!DOCTYPE HTML>'
    text += '<html>'
    text += '<head>'
    text += '<title>Timeline basic demo</title>'
    text +='<script src="https://cdnjs.cloudflare.com/ajax/libs/vis/4.21.0/vis.min.js"></script>'
    text +='<link href="https://cdnjs.cloudflare.com/ajax/libs/vis/4.21.0/vis.min.css" rel="stylesheet" type="text/css" />'
    text +='<style type="text/css">'
    text +='  body, html {'
    text +='   font-family: sans-serif;'
    text +='}'
    text +='</style>'
    text += '</head>'
    text += '<body>'
    text += '<div id="mynetwork"></div>'
    text += '<div>Testtt</div>'
    text += '<script type="text/javascript">'
    text += 'var container = document.getElementById("mynetwork");'
    text += 'var nodes = new vis.DataSet(['
    text += '  {id: 11, label: "Node 11", level:1 ,title: "Tooltip for Node 11"},'
    text +=   '{id: 12, label: "Node 12", level:2 , title: "Tooltip for Node 12"},'
    text +=   '{id: 13, label: "Node 13", level:2 ,title: "Tooltip for Node 13"},'
    text +=   '{id: 14, label: "Node 14", level:3 ,title: "Tooltip for Node 14"},'
    text +=   '{id: 15, label: "Node 15", level:3 , title: "Tooltip for Node 15"}'
    text += ']);'
    text += 'var edges = new vis.DataSet(['
    text += '{from: 11, to: 12,  title:"edge1"},'
    text += '{from: 11, to: 13},'
    text += '{from: 12, to: 14},'
    text += '{from: 12, to: 15},'
    text += ']);'
    text += 'var data = {'
    text +=   'nodes: nodes,'
    text +=   'edges: edges'
    text += '};'
    text += buildOptionText()
    text += 'var timeline = new vis.Network(container, data, options);'
    text += '</script>'
    text += '</body>'
    text += '</html>'
    return text;
}

function buildOptionText(){
    return  'var options = {'
        + 'nodes:{'
     + 'shape: "box",'
     + '},'
     + 'interaction:{'
     + 'dragNodes:true,'
     + 'dragView: true,'
     + 'hideEdgesOnDrag: false,'
     + 'hideNodesOnDrag: false,'
     + 'hover: true,'
     + 'hoverConnectedEdges: false,'
     + 'keyboard: {'
     + 'enabled: false,'
     + 'speed: {x: 10, y: 10, zoom: 0.02},'
     + 'bindToWindow: true'
     + '},'
     + 'multiselect: false,'
     + 'navigationButtons: false,'
     + 'selectable: true,'
     + 'selectConnectedEdges: false,'
     + 'tooltipDelay: 300,'
     + 'zoomView: true'
     + '},'
     + 'edges:{'
     + 'color: "red",'
     + 'arrows: {'
     + 'to:     {enabled: true, scaleFactor:1, type:"arrow"},'
     + 'middle: {enabled: false, scaleFactor:1, type:"arrow"},'
     + 'from:   {enabled: false, scaleFactor:1, type:"arrow"}'
     + '},'
     + '},'
     + 'layout: {'
     + 'randomSeed: undefined,'
     + 'improvedLayout:true,'
     + 'hierarchical: {'
     + 'enabled:true,'
     + 'levelSeparation: 150,'
     + 'nodeSpacing: 100,'
     + 'treeSpacing: 200,'
     + 'blockShifting: true,'
     + 'edgeMinimization: true,'
     + 'parentCentralization: true,'
     + 'direction: "UD",'
     + 'sortMethod: "hubsize"'
     + '}'
     + '}'
     + '};'
}

async function runSample(projectId = 'your-project-id') {  
    listIntents('x-petch').then(() => console.log('listIntents Success')).catch(() => console.log('obligatory catch'))
}

async function listIntents(projectId){
  const intentsClient = new dialogflow.IntentsClient();  
  const projectAgentPath = intentsClient.projectAgentPath(projectId);

  const request = {
    parent: projectAgentPath,
  };
   
  let responses 
  try {
    responses = await intentsClient.listIntents(request);
    if(responses){
        const responseData =  responses[0];
        var intentList: IIntent[] = [];

        responseData.forEach(function (data) {
            intentList.push({
                inputContextNames: data.inputContextNames[0] ? 
                  stringUtils.extractIntentName(data.inputContextNames[0]) : '',
                outputContexts: data.outputContexts[0] ?
                  stringUtils.extractIntentName(data.outputContexts[0].name) : '',
                intentName: data.displayName
            });          
        }); 
        console.log(intentList);
        // console.log('################### Full version response #######');
        // console.log(responseData);
        // console.error('Data count'+ responses[0].length);   
    }
  } catch (err) {
    console.error('ERROR:', err);
  }  
}
