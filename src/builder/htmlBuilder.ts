import { IIntent } from '../interface/IIntent';
import { IOutputContext } from '../interface/IOutputContext';
import { Config } from '../config/config';
const dialogflowService = require('../service/dialogflowService');
const config: Config = require('../config/config.json');

const exportFunctions = {
  buildHtmlText,
  composeHtml
};

async function composeHtml(projectId = 'your-project-id', res) {
  const intentsResult = await dialogflowService.getIntents(projectId);
  const response = await exportFunctions.buildHtmlText(intentsResult);
  res.render('index', {projectId: config.projectId,
    nodes: JSON.stringify(response.intentStr),
    nodes2: JSON.stringify(response.idvIntentStr),
    edge: JSON.stringify(response.edgeStr)
  });
}

async function buildHtmlText(intentsResult): Promise<any> {
  const stringUtils = require('../utils/StringUtils');
  const message = require('./messageBuilder');
  const intentIndex = new Map<string, number>();
  let verticesStr : any;
  let edgeStr : string = '';

  if (intentsResult) {
    const intents =  intentsResult[0];
    const intentList: IIntent[] = [];
    const outputContexts : IOutputContext[] = [];

    intents.forEach((data, index) => {
      const newIndex = index + 1;
      intentIndex.set(data.displayName, newIndex);
    });

    intents.forEach((data, index) => {
      const newIndex = index + 1;

      if (data.outputContexts && data.outputContexts.length) {
        outputContexts.push({
          outputContext: data.outputContexts,
          index: newIndex
        });
      }

      const resText = message.getMessageText(data.messages);
      intentList.push({
        inputContextNames: data.inputContextNames[0] ?
          stringUtils.extractIntentName(data.inputContextNames[0]) : '',
        outputContexts: data.outputContexts[0] ?
          stringUtils.extractIntentName(data.outputContexts[0].name) : '',
        trainingPhrase: message.getTrainingPhrases(data.trainingPhrases),
        intentName: data.displayName,
        id:newIndex,
        payloadCount: resText.payloadResponse,
        responseMsg: resText.responseTxt,
        webhookState: data.webhookState,
        isFallback: data.isFallback
      });
    });

    edgeStr = await message.getEdgeString(outputContexts, intents, intentIndex);
    verticesStr = await message.getVerticesString(intentIndex, intentList, intents.length);
  }
  return {
    edgeStr,
    intentStr: verticesStr.intentStr,
    idvIntentStr: verticesStr.idvIntentStr
  };
}

export default exportFunctions;
