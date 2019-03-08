import { IIntent } from './interface/IIntent';
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


// app.set('view engine', 'ejs');
// app.get('/test2', (req, res) => {
//   var string = "var nodes2 = new vis.DataSet(["
//   + "{id: 11, label: 'Node 11', level:1 ,title: 'Tooltip for Node 11'},"
//   + "{id: 12, label: 'Node 12', level:2 , title: 'Tooltip for Node 12'},"
//   + '{id: 13, label: "Node 13", level:2 ,title: "Tooltip for Node 13"},'
//   + '{id: 14, label: "Node 14", level:3 ,title: "Tooltip for Node 14"},'
//   + '{id: 15, label: "Node 15", level:3 , title: "Tooltip for Node 15"}'
//   + ']);'
//   + 'var edges2 = new vis.DataSet(['
//    + '{from: 11, to: 12,  title:"edge1"},'
//    + '{from: 11, to: 13},'
//    + '{from: 12, to: 14},'
//    + '{from: 12, to: 15},'
//    + ']);'
//    +'var data = {'
//     +'nodes: nodes2,'
//     +' edges: edges2'
//     +' };'

//     +' var options ={};'
//     +' var timeline = new vis.Network(container, data, options);'

//   res.render("index", { myString: string }); 
// }); 


// app.get('/test',function  (req,res) {
//      // res.send(JSON.stringify(result) );
//      var string = '<script type="text/javascript">'
//      + 'var nodes2 = new vis.DataSet(['
//      + '{id: 11, label: "Node 11", level:1 ,title: "Tooltip for Node 11"},'
//      + '{id: 12, label: "Node 12", level:2 , title: "Tooltip for Node 12"},'
//      + '{id: 13, label: "Node 13", level:2 ,title: "Tooltip for Node 13"},'
//      + '{id: 14, label: "Node 14", level:3 ,title: "Tooltip for Node 14"},'
//      + '{id: 15, label: "Node 15", level:3 , title: "Tooltip for Node 15"}'
//      + ']);'
//      + 'var edges2 = new vis.DataSet(['
//       + '{from: 11, to: 12,  title:"edge1"},'
//       + '{from: 11, to: 13},'
//       + '{from: 12, to: 14},'
//       + '{from: 12, to: 15},'
//       + ']);'
//       + '</script>'

//      res.render( "index",{ myString: string }, function(err, html) {
//        console.log(html);
//       //  res.send(html);
//       });
    
// });

async function runSample(projectId = 'your-project-id', res) {  
    res.set('Content-Type', 'text/html'); 
    getIntents(projectId).then((response) =>{
      console.log(response);
    })



    // listIntents(projectId).then((response) => {
    //     var htmlText = buildHtml();  
    //     // console.log(htmlText)      
    //     res.send(new Buffer(htmlText));   
    // }
    // ).catch(() => console.log('obligatory catch'))
}


async function getIntents(projectId): Promise<any>{
  const intentsClient = new dialogflow.IntentsClient();  
  const projectAgentPath = intentsClient.projectAgentPath(projectId);

  const request = {
    parent: projectAgentPath,
    intentView: 'INTENT_VIEW_FULL',
  };
    
  try {
    var responses = await intentsClient.listIntents(request);
  }
  catch(err) {
    console.error('ERROR:', err);
  }
  return responses
}

async function listIntents(projectId): Promise<any>{

  const intentsClient = new dialogflow.IntentsClient();  
  const projectAgentPath = intentsClient.projectAgentPath(projectId);

  const request = {
    parent: projectAgentPath,
    intentView: 'INTENT_VIEW_FULL',
  };
    
  try {
    let responses = await intentsClient.listIntents(request);
    
    if(responses){
        const intents =  responses[0];
        let graph = new Graph(intents.length);
        let intentList: IIntent[] = [];

        intents.forEach(function (data, index) {
            intentIndex.set(data.displayName, ++index)
        });

        intents.forEach(function (data, index) {
            index++;
            graph.addVertex(index);
          
            if(data.outputContexts && data.outputContexts.length){
                data.outputContexts.forEach(function(outputContexts){
                    var outputIntent = intents.filter(x => x.inputContextNames[0] == outputContexts.name)
                    if(outputIntent){
                        outputIntent.forEach(function (data) {
                          graph.addEdge(index, intentIndex.get(data.displayName))
                        });
                    }
                });
            } 
            
            intentList.push({
                inputContextNames: data.inputContextNames[0] ? 
                  stringUtils.extractIntentName(data.inputContextNames[0]) : '',
                outputContexts: data.outputContexts[0] ?
                  stringUtils.extractIntentName(data.outputContexts[0].name) : '',
                intentName: data.displayName,
                id:index
            });  
        });

        // graph.printGraph();
        edgeStr = graph.getEdge(intentList );
        intentStr = graph.getVertices(intentIndex, intentList);  


        return [intentStr, edgeStr] 
    }
  } catch (err) {
    console.error('ERROR:', err);
  }  
}


// async function createIntentList(index, data){
//   let intentList: IIntent[] = [];

//   intentList.push({
//     inputContextNames: data.inputContextNames[0] ? 
//       stringUtils.extractIntentName(data.inputContextNames[0]) : '',
//     outputContexts: data.outputContexts[0] ?
//       stringUtils.extractIntentName(data.outputContexts[0].name) : '',
//     intentName: data.displayName,
//     id:index
//   });  

//   return intentList;
// }


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