import { IIntent } from './interface/IIntent';
import { IIntent2 } from './interface/IIntent2';
import { Graph } from './graph';
import { Config } from './config/config';

const dialogflow = require('dialogflow');
const express = require('express')
const app = express()
const stringUtils = require('./utils/StringUtils');
let config: Config = require('./config/config.json');

var intentIndex = new Map<string, number>();
// var newMap = new Map<string, [number, string]>();
var intentStr : string = ''; 
var edgeStr : string = ''; 



app.get('/', (req, res) =>  runSample(config.projectId,res));
// app.get('/', (req, res) =>  runSample('x-petch', res).then(() => console.log('Successs')));
app.get('/matchintent', (req, res) => runSample(config.projectId, res).then(() => console.log('Successssss')).catch(() => console.log('obligatory catch')));
app.listen(3000, () => console.log('Example app listening on port 3000!'));



async function runSample(projectId = 'your-project-id', res) {  
    res.set('Content-Type', 'text/html');    
    listIntents(projectId).then((response) => {
        console.log('########');
        var htmlText = buildHtml();  
        // console.log(htmlText)      
        res.send(new Buffer(htmlText));   
    }
    ).catch(() => console.log('obligatory catch'))
}


async function listIntents(projectId): Promise<any>{

//   const intentsClient = new dialogflow.IntentsClient();  
  const intentsClient = new dialogflow.IntentsClient({
    // keyFilename: key_file_path
  });  

  console.log(intentsClient)

  const projectAgentPath = intentsClient.projectAgentPath(projectId);

  const request = {
    parent: projectAgentPath,
    intentView: 'INTENT_VIEW_FULL',
    // languageCode: 'en'
  };
    
  try {
    let responses = await intentsClient.listIntents(request);
    
    console.log("response : "responses);
    if(responses){
        const intents =  responses[0];
        let graph = new Graph(intents.length);
        var index:number = 1; 
        var index2:number = 1; 
        let intentList: IIntent[] = [];
        let intentList2: IIntent2[] = [];

        intents.forEach(function (data) {
            intentIndex.set(data.displayName, index2)
            // newMap.set(data.displayName, [index2, data.name, data.outputContexts])
            index2++;
        });

        console.log('tesIndex');
        console.log(intentIndex);

        intents.forEach(function (data) {
       
            // intentIndex.set(data.displayName, index)
            graph.addVertex(index);
            
            if(data.outputContexts && data.outputContexts.length){
                data.outputContexts.forEach(function(temp){
                    var outputIntent = intents.filter(x => x.inputContextNames[0] == temp.name)
                    var i:number = 0; 
                    if(outputIntent){
                        for(i = 0; i < outputIntent.length;i++) {
                            graph.addEdge(index, intentIndex.get(outputIntent[i].displayName))
                        }
                    }
                });
            }

            intentList.push({
                inputContextNames: data.inputContextNames[0] ? 
                  stringUtils.extractIntentName(data.inputContextNames[0]) : '',
                outputContexts: data.outputContexts[0] ?
                  stringUtils.extractIntentName(data.outputContexts[0].name) : '',
                intentName: data.displayName
            });    
            
            intentList2.push({
                inputContextNames: data.inputContextNames[0] ? 
                  stringUtils.extractIntentName(data.inputContextNames[0]) : '',
                outputContexts: data.outputContexts[0] ?
                  stringUtils.extractIntentName(data.outputContexts[0].name) : '',
                intentName: data.displayName,
                id:index
            });  

            index++;
        
        });
  

        graph.printGraph();
        edgeStr = graph.getEdge(intentList2 );
        intentStr = graph.getVertices(intentIndex, intentList2);  


        return [intentStr, edgeStr] 
    }
  } catch (err) {
    console.error('ERROR:', err);
  }  
}


function buildHtml(){
    return  ''
      + '<!DOCTYPE HTML>'
     + '<html>'
     + '<head>'
     + '<title>Timeline basic demo</title>'
     + buildExternalResource()
     + buildStylesheet()
     + '</head>'
     + '<body>'
     + '<div id="mynetwork" class="container"></div>'
     + '<script type="text/javascript">'
     + 'var container = document.getElementById("mynetwork");'
     + 'var nodes = new vis.DataSet(['
     + intentStr
     + ']);'
     + 'var edges = new vis.DataSet(['
      + edgeStr
     + ']);'
     + 'var data = {'
     +   'nodes: nodes,'
     +   'edges: edges'
     + '};'
     + buildVisOption()
     + 'var timeline = new vis.Network(container, data, options);'
     + '</script>'
     + '</body>'
     + '</html>'
}

function buildExternalResource(){
    return '<script src="https://cdnjs.cloudflare.com/ajax/libs/vis/4.21.0/vis.min.js"></script>'
    + '<link href="https://cdnjs.cloudflare.com/ajax/libs/vis/4.21.0/vis.min.css" rel="stylesheet" type="text/css" />'
    
}

function buildStylesheet(){
    return '<style type="text/css">'
    + '  body, html {'
    + '   font-family: sans-serif;'
    + '  }'
    + '  .container {'
    + '   height: 800px;'
    + '   width: 900px;'
    + '   border: solid 1px #000'
    + '  }'
    + '</style>'
}

function buildVisOption(){
    return 'var options = {'
     + ' physics:{'
     +   'barnesHut: {'
     +   'avoidOverlap: 1'
     +   '},'
     +   'hierarchicalRepulsion: {'
    +   '   centralGravity: 0.0,'
    +   '    springLength: 300,'
    +   '    springConstant: 0.01,'
    +   '    nodeDistance: 120,'
    +   '   damping: 0.09'
    +   ' },'
     +   'maxVelocity: 50,'
     +   'minVelocity: 0.1,'
     +   'solver: "hierarchicalRepulsion",'
     +   'stabilization: {'
     +   '  enabled: true,'
     +   '  iterations: 1000,'
     +   '  updateInterval: 100,'
     +   '  onlyDynamicEdges: false,'
     +   '  fit: true'
     +   '},'
     +   'timestep: 0.5,'
     +   'enabled: true'
     + '},'
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
     + 'speed: {x: 0.1, y: 0.1, zoom: 0.02},'
     + 'bindToWindow: true'
     + '},'
     + 'multiselect: false,'
     + 'navigationButtons: false,'
     + 'selectable: true,'
     + 'selectConnectedEdges: true,'
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
     + 'improvedLayout:false,'
     + 'hierarchical: {'
     + 'enabled:true,'
     + 'levelSeparation: 150,'
     + 'nodeSpacing: 300,'
     + 'treeSpacing: 300,'
     + 'blockShifting: true,'
     + 'edgeMinimization: true,'
     + 'parentCentralization: true,'
     + 'direction: "UD",'
     + 'sortMethod: "hubsize"'
     + '}'
     + '}'
     + '};'
}