import { IIntent } from './interface/IIntent';
import { IOutputContext } from './interface/IOutputContext';
import { Config } from './config/config';
import { MessageBuilder } from './messageBuilder';

const dialogflow = require('dialogflow');
const express = require('express');
const app = express();
const stringUtils = require('./utils/StringUtils');
const config: Config = require('./config/config.json');
const message = new MessageBuilder();

app.set('view engine', 'ejs');
app.get('/', (req, res) => runSample(config.projectId, res));
app.listen(3000, () => console.log('Example app listening on port 3000!'));

async function runSample(projectId = 'your-project-id', res) {
  const intentsResult = await getIntents(projectId);
  const response = await buildHtmlText(intentsResult);
  res.render('index', {projectId: config.projectId,
    nodes: JSON.stringify(response.intentStr),
    nodes2: JSON.stringify(response.idvIntentStr),
    edge: JSON.stringify(response.edgeStr)
  });
}

async function getIntents(projectId): Promise<any> {
  const intentsClient = new dialogflow.IntentsClient();
  const projectAgentPath = intentsClient.projectAgentPath(projectId);
  let responses;
  const request = {
    parent: projectAgentPath,
    intentView: 'INTENT_VIEW_FULL',
  };

  try {
    responses = await intentsClient.listIntents(request);
  } catch (err) {
    console.error('ERROR:', err);
  }
  return responses;
}

async function buildHtmlText(intentsResult): Promise<any> {
  const intentIndex = new Map<string, number>();
  let verticesStr : any;
  let edgeStr : string = '';

  if (intentsResult) {
    const intents =  intentsResult[0];
    const intentList: IIntent[] = [];
    const outputContexts : IOutputContext[] = [];

    intents.forEach((data, index) => {
      const newIndex = index++;
      intentIndex.set(data.displayName, newIndex);
    });

    intents.forEach((data, index) => {
      index++;
      if (data.outputContexts && data.outputContexts.length){
        outputContexts.push({
          outputContext: data.outputContexts,
          index: index
        })
      } 
  
      let resText = message.getMessageText(data.messages);
      intentList.push({
        inputContextNames: data.inputContextNames[0] ? 
          stringUtils.extractIntentName(data.inputContextNames[0]) : '',
        outputContexts: data.outputContexts[0] ?
          stringUtils.extractIntentName(data.outputContexts[0].name) : '',
        trainingPhrase: message.getTrainingPhrases(data.trainingPhrases),                  
        intentName: data.displayName,
        id:index,
        payloadCount: resText.payloadResponse,
        responseMsg: resText.responseTxt,
        webhookState: data.webhookState,
        isFallback: data.isFallback
      });  
    });
    
    edgeStr = await message.getEdgeString(outputContexts, intents, intentIndex);
    verticesStr = await message.getVerticesString(intentIndex, intentList,intents.length);
  }
  return {
    edgeStr: edgeStr,
    intentStr: verticesStr.intentStr,
    idvIntentStr: verticesStr.idvIntentStr
  }
}

