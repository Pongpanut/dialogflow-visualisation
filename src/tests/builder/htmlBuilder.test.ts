const htmlBuilder = require('../../builder/htmlBuilder');
const message = require('../../builder/messageBuilder');  
const stringUtils = require('../../utils/StringUtils'); 
import { IOutputContext } from '../../interface/IOutputContext';
import { IIntent } from '../../interface/IIntent';

describe('HtmlBuilder', function() {
  describe('buildHtmlText', () => {
    it('should prepare properties for html building', async () => {
      const intentJson = require('../mockData/builder/htmlBuilder/buildHtmlText/intent1.json');      
      const intents = intentJson;
      const getMessageTextFake = jest.fn(() => ({ 
        responseTxt : 'response',
        payloadResponse: 1}
      ));
      const getTrainingPhrasesFake = jest.fn(() => "trainingPhrases");
      const getEdgeStringFake = jest.fn(() => Promise.resolve("edgeString"));
      const getVerticesStringFake = jest.fn(() => Promise.resolve({
        intentStr:  "intentStr",
        idvIntentStr: "idvIntentStr"
      }));
      const extractIntentNameFake = jest.fn(() => "intentName");

      message.getMessageText = getMessageTextFake;
      message.getTrainingPhrases = getTrainingPhrasesFake;
      message.getEdgeString = getEdgeStringFake; 
      message.getVerticesString = getVerticesStringFake; 
      stringUtils.extractIntentName = extractIntentNameFake;

      let expected = {
        edgeStr: "edgeString",
        intentStr :  "intentStr",
        idvIntentStr:  "idvIntentStr"
      }
      
      // Prepare expected request for get edge string
      const intentIndex = new Map<string, number>();
      intentIndex.set('intent1', 1);
      intentIndex.set('intent2', 2);
      const outputContexts : IOutputContext[] = [];
      outputContexts.push({
        outputContext: ["output1"],
        index: 1
      })
      outputContexts.push({
        outputContext: ["output2"],
        index: 2
      })

      const intentList: IIntent[] = [];

      intentList.push({
        inputContextNames: 'intentName',
        outputContexts: 'intentName',
        intentName: 'intent1',
        trainingPhrase: 'trainingPhrases',
        id: 1,
        payloadCount: 1,
        responseMsg: 'response',
        webhookState: 'WEBHOOK_STATE_UNSPECIFIED',
        isFallback: false
      });
      intentList.push({
        inputContextNames: 'intentName',
        outputContexts: 'intentName',
        intentName: 'intent2',
        trainingPhrase: 'trainingPhrases',
        id: 2,
        payloadCount: 1,
        responseMsg: 'response',
        webhookState: 'WEBHOOK_STATE_UNSPECIFIED',
        isFallback: false
      });

      let result = await htmlBuilder.buildHtmlText(intents); 
      expect(getEdgeStringFake).toBeCalledWith(outputContexts, intents[0],intentIndex);      
      expect(getVerticesStringFake).toBeCalledWith(intentIndex, intentList, 2);
      expect(result).toEqual(expected);
    })
  });
});