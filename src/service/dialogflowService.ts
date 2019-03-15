// const dialogflow = require('dialogflow'); // Consistency 
import { IIntent } from '../interface/IIntent';
import MessageBuilder from '../builder/messageBuilder'

// import { message } from '../builder/messageBuilder';
const stringUtils = require('../utils/StringUtils');

export default class dialogflowService {
  constructor() {
  }

  async getIntents(intentsClient, projectId): Promise<any> {
    const request = {
      parent: intentsClient.projectAgentPath(projectId),
      intentView: 'INTENT_VIEW_FULL',
    };

    let intents: any;
    try {
      const res = await intentsClient.listIntents(request);
      intents = this.intentsMapper(res[0]);
    } catch (err) {
      console.error('ERROR:', err);
    }
    return intents;
  }

  private intentsMapper(intents): any {
    const message = new MessageBuilder();
    const intentList: IIntent[] = [];
    intents.forEach((intent, index) => {
      const resText = message.getMessageText(intent.messages);
      intentList.push({
        inputContextNames: intent.inputContextNames ?
          stringUtils.extractInputIntentName(intent.inputContextNames) : [],
        outputContexts: intent.outputContexts ?
          stringUtils.extractOutputContexts(intent.outputContexts) : [],
        trainingPhrase: message.getTrainingPhrases(intent.trainingPhrases),
        intentName: intent.displayName,
        id: index,
        payloadCount: resText.payloadResponse,
        responseMsg: resText.responseTxt,
        webhookState: intent.webhookState,
        isFallback: intent.isFallback
      });
    });

    return intentList;
  }
}
