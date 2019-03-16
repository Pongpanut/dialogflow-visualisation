import { IIntent } from '../interface/IIntent';
import MessageBuilder from '../builder/MessageBuilder';
import dialogflow from 'dialogflow';
import StringUtils from '../utils/StringUtils';

export default class DialogflowService {
  private messageBuilder: MessageBuilder;
  private intentsClient: dialogflow;
  private projectId: string;
  private stringUtils: StringUtils;

  constructor({ messageBuilder, intentsClient, projectId, stringUtils }) {
    this.messageBuilder = messageBuilder;
    this.intentsClient = intentsClient;
    this.projectId = projectId;
    this.stringUtils = stringUtils;
  }

  async getIntents(): Promise<any> {
    const request = {
      parent: this.intentsClient.projectAgentPath(this.projectId),
      intentView: 'INTENT_VIEW_FULL',
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
          this.stringUtils.extractInputIntentName(intent.inputContextNames) : [],
        outputContexts: intent.outputContexts ?
          this.stringUtils.extractOutputContexts(intent.outputContexts) : [],
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
