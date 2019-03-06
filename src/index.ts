import { IIntent } from './interface/IIntent';
import { Graph } from './graph';

const dialogflow = require('dialogflow');
const express = require('express')
const app = express()
const stringUtils = require('./Utils/StringUtils');
var intentIndex = new Map<string, number>();
var intentStr : string = ''; 
var edgeStr : string = ''; 

app.get('/', (req, res) =>  renderHtml(res));
app.get('/matchintent', (req, res) => runSample('x-petch', res).then(() => console.log('Successssss')).catch(() => console.log('obligatory catch')));
app.listen(3000, () => console.log('Example app listening on port 3000!'));

function renderHtml(res){
    res.set('Content-Type', 'text/html');
    runSample('x-petch', res)
    .then(() => {     
        console.log('print Success')
    })
    .catch(() => console.log('obligatory catch'));
}

async function runSample(projectId = 'your-project-id', res) {  
    listIntents('x-petch').then(() => {
        console.log('listIntents Success')
        console.log(intentStr)
        var htmlText = buildHtml();        
        res.send(new Buffer(htmlText));   
    }
    ).catch(() => console.log('obligatory catch'))
}

async function listIntents(projectId){
  const intentsClient = new dialogflow.IntentsClient();  
  const projectAgentPath = intentsClient.projectAgentPath(projectId);

  const request = {
    parent: projectAgentPath,
  };
   
//   let responses 
  try {
    let responses = await intentsClient.listIntents(request);   
    
    if(responses){
        const responseData =  responses[0];
        // let intentList: IIntent[] = [];
        let graph = new Graph(responseData.length);
        var index:number = 1; 

        responseData.forEach(function (data) {
            intentIndex.set(data.displayName, index)
            graph.addVertex(index);
            if(data.displayName,data.outputContexts[0]){
                let outputName = data.outputContexts[0].name
                var outputIntent = responseData.filter(x => x.inputContextNames[0] == outputName)
                var i:number = 0; 
                if(outputIntent){
                    for(i = 0; i < outputIntent.length;i++) {
                        graph.addEdge(index, intentIndex.get(outputIntent[i].displayName))
                    }
                }
            }
            index++;
            
            // intentList.push({
            //     inputContextNames: data.inputContextNames[0] ? 
            //       stringUtils.extractIntentName(data.inputContextNames[0]) : '',
            //     outputContexts: data.outputContexts[0] ?
            //       stringUtils.extractIntentName(data.outputContexts[0].name) : '',
            //     intentName: data.displayName
            // });          
        }); 

        // const getKeyByValue = (obj, value) => Object.keys(obj).find(key => obj[key] === value);
        // console.log(getIntentNameFromIndex(intentIndex, '1'))
        

        // var rootNode =  intentList.filter(x => x.inputContextNames == '');
    
        // console.log(intentList);
        // console.log('responses' + JSON.stringify(intentList));
        // console.log(intentList);
        
        // generateVertical(graph);
        graph.printGraph();
        edgeStr = graph.getEdge();
        intentStr = graph.getNode(intentIndex);

        

        // console.log('################### Full version response #######');
        // console.log(responseData);
        // console.error('Data count'+ responses[0].length);   
    }
  } catch (err) {
    console.error('ERROR:', err);
  }  
}

// function getByValue(map, searchValue) {
//     for (let [key, value] of map.entries()) {
//       if (value === searchValue)
//         return key;
//     }
// }

// function generateVertical(graph){
//     var numOfNode = graph.noOfVertices;
//     var i:number = 0;     
//     // var graphObj = graph.AdjList;
//     for(i = 1 ;i <= numOfNode ;i++) {
//         let name = getByValue(intentIndex, i);
//         intentStr += '{id:' + i + ', label:"'+ name + '", title: "Tooltip for' + name +'"}';
//         if( i < numOfNode){
//             intentStr += ',' 
//         }
//     }   

//     return intentStr;
// }

// function generateEdge(graph){

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
    + '   height: 300px;'
    + '   width: 400px;'
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