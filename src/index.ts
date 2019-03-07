import { IIntent } from './interface/IIntent';
import { Graph } from './graph';
import { Config } from './config/config';

const dialogflow = require('dialogflow');
const express = require('express')
const app = express()
const stringUtils = require('./utils/StringUtils');
let config: Config = require('./config/config.json');

var intentIndex = new Map<string, number>();
var newMap = new Map<string, [number, string]>();
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

//   var key_file_path = "/Users/pongpanut/Documents/10x/scb10x1-chatbot-uat-7d622363e531.json";
  const intentsClient = new dialogflow.IntentsClient({
    // keyFilename: key_file_path
  });  
  const projectAgentPath = intentsClient.projectAgentPath(projectId);

  const request = {
    parent: projectAgentPath,
    // languageCode: 'en'
  };
    
  try {
      console.log('test');
    let responses = await intentsClient.listIntents(request);
    console.log('######');   
    // console.log(responses);
    console.log('######'); 
    if(responses){
        const intents =  responses[0];

        let graph = new Graph(intents.length);
        var index:number = 1; 
        let intentList: IIntent[] = [];


        intents.forEach(function (data) {
       
            intentIndex.set(data.displayName, index)
            newMap.set(data.displayName, [index, data.name])
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

            index++;
        
        });
        console.log(intentList.find(x => x.intentName == 'YourLoan.Income.NotANumber'));

        graph.printGraph();
        edgeStr = graph.getEdge();
        intentStr = graph.getVertices(intentIndex);  


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
    //  + '},'
    //  + 'layout: {'
    //  + 'randomSeed: undefined,'
    //  + 'improvedLayout:true,'
    //  + 'hierarchical: {'
    //  + 'enabled:true,'
    //  + 'levelSeparation: 150,'
    //  + 'nodeSpacing: 100,'
    //  + 'treeSpacing: 200,'
    //  + 'blockShifting: true,'
    //  + 'edgeMinimization: true,'
    //  + 'parentCentralization: true,'
    //  + 'direction: "UD",'
    //  + 'sortMethod: "hubsize"'
    //  + '}'
     + '}'
     + '};'
}