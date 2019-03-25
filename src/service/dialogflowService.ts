import { IIntent } from '../interface/IIntent';
import MessageBuilder from '../builder/messageBuilder';
import dialogflow from 'dialogflow';
import { extractInputIntentName, extractOutputContexts } from '../utils/StringUtils';

export default class DialogflowService {
  private messageBuilder: MessageBuilder;
  private intentsClient: dialogflow;
  private projectId: string;
  private languageCode: string;

  constructor({ messageBuilder, intentsClient, projectId, languageCode }) {
    this.messageBuilder = messageBuilder;
    this.intentsClient = intentsClient;
    this.projectId = projectId;
    this.languageCode = languageCode;
  }

  async getIntents(): Promise<any> {
    const request = {
      parent: this.intentsClient.projectAgentPath(this.projectId),
      intentView: 'INTENT_VIEW_FULL',
      languageCode: this.languageCode,
    };

    let intents: any;
    try {
      const res = await this.intentsClient.listIntents(request);
      intents = this.intentsMapper(res[0]);
    } catch (err) {
      console.error('ERROR:', err);
    }
    return intents;
  }

  private intentsMapper(intents): any {
    const intentList: IIntent[] = [];
    intents.forEach((intent, index) => {
      const resText = this.messageBuilder.getMessageText(intent.messages);
      intentList.push({
        inputContextNames: intent.inputContextNames ?
          extractInputIntentName(intent.inputContextNames) : [],
        outputContexts: intent.outputContexts ?
          extractOutputContexts(intent.outputContexts) : [],
        trainingPhrase: this.messageBuilder.getTrainingPhrases(intent.trainingPhrases),
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
