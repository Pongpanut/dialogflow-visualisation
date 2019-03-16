import DialogflowService from '../../service/DialogflowService';
import MessageBuilder from '../../builder/MessageBuilder';
import StringUtils from '../../utils/StringUtils';
import { IIntent } from '../../interface/IIntent';

describe('dialogflowService', () => {
  let intentsClient: any;
  let messageBuilder: MessageBuilder;
  let service: DialogflowService;
  let stringUtils: StringUtils;
  let intents: any;

  beforeEach(() => {
    intents = require('../mockData/service/dialogflowService/intent1.json');

    stringUtils = new StringUtils();
    stringUtils.extractInputIntentName = jest.fn(() => 'inputName');
    stringUtils.extractOutputContexts = jest.fn(() => 'inputName');

    messageBuilder = new MessageBuilder(stringUtils);
    messageBuilder.getMessageText = jest.fn(() => ({
      payloadResponse: 1,
      responseTxt: 'response'
    }));
    messageBuilder.getTrainingPhrases = jest.fn(() => 'TrainingPhrase');

  });

  describe('getIntents', () => {
    test('should return intent properly', async () => {
      intentsClient = {
        projectAgentPath: jest.fn(() => 'projectAgentPath'),
        listIntents: jest.fn(() => Promise.resolve(intents))
      };

      service = new DialogflowService({
        intentsClient,
        messageBuilder,
        stringUtils,
        projectId: 'test'
      });

      const result = await service.getIntents();
      const expected: IIntent[] = [];
      expected.push({
        id: 0,
        inputContextNames: 'inputName',
        intentName: 'intent1',
        isFallback: false,
        outputContexts: 'inputName',
        payloadCount: 1,
        responseMsg: 'response',
        trainingPhrase: 'TrainingPhrase',
        webhookState: 'WEBHOOK_STATE_UNSPECIFIED',
      });

      expected.push({
        id: 1,
        inputContextNames: 'inputName',
        intentName: 'intent2',
        isFallback: false,
        outputContexts: 'inputName',
        payloadCount: 1,
        responseMsg: 'response',
        trainingPhrase: 'TrainingPhrase',
        webhookState: 'WEBHOOK_STATE_UNSPECIFIED',
      });

      expect(result).toEqual(expected);
    });

    test('result should be undefined if listIntents is rejected', async () => {
      intentsClient = {
        projectAgentPath: jest.fn(() => 'projectAgentPath'),
        listIntents: jest.fn(() => Promise.reject('Error'))
      };

      service = new DialogflowService({
        intentsClient,
        messageBuilder,
        stringUtils,
        projectId: 'test',
      });
      console.log = jest.fn();
      const result = await service.getIntents();
      expect(result).toEqual(undefined);
    });
  });
});
