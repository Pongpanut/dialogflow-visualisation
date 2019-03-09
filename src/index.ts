import { IIntent } from './interface/IIntent';
import { IOutputContext } from './interface/IOutputContext';
import { Graph } from './graph';
import { Config } from './config/config';

const dialogflow = require('dialogflow');
const express = require('express')
const app = express()
const stringUtils = require('./utils/StringUtils');
let config: Config = require('./config/config.json');

app.set('view engine', 'ejs');
app.get('/', (req, res) =>  runSample(config.projectId,res));
app.listen(3000, () => console.log('Example app listening on port 3000!'));

async function runSample(projectId = 'your-project-id', res) {  
    let intentsResult = await getIntents(projectId);
    let response = await buildHtmlText(intentsResult);
    res.render("index", {projectId: config.projectId, nodes: JSON.stringify(response.intentStr), nodes2: JSON.stringify( response.idvIntentStr), edge: JSON.stringify(response.edgeStr) }); 
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


async function buildHtmlText(intentsResult): Promise<any> {
    var verticesStr : any; 
    var edgeStr : string = ''; 
    var intentIndex = new Map<string, number>();
    
    if(intentsResult){
        const intents =  intentsResult[0];        
        let graph = new Graph(intents.length);
        let intentList: IIntent[] = [];
        let outputContexts : IOutputContext[] = [];
        
        intents.forEach(function (data, index) {
            let newIndex = ++index;
            intentIndex.set(data.displayName, newIndex)
            graph.addVertex(newIndex);
            
        });
        
        intents.forEach(function (data, index) {
            index++;
          
            if(data.outputContexts && data.outputContexts.length){
                outputContexts.push({
                  outputContext: data.outputContexts,
                  index: index
                })
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
        edgeStr = await graph.createEdgeString(outputContexts, intents, intentIndex);
        verticesStr = await graph.createVerticesString(intentIndex, intentList);
    }
    return {
      edgeStr: edgeStr,
      intentStr: verticesStr.intentStr,
      idvIntentStr: verticesStr.idvIntentStr
    }
}