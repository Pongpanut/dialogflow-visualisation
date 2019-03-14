// const htmlBuilder = require('../../builder/htmlBuilder');
import htmlBuilder from '../../builder/htmlBuilder';

const message = require('../../builder/messageBuilder'); 
const stringUtils = require('../../utils/StringUtils'); 
// const dialogflowService = require('../../service/dialogflowService');

import { IOutputContext } from '../../interface/IOutputContext';
import { IIntent } from '../../interface/IIntent';


// jest.mock("../../builder/htmlBuilder", () =>  {
//   return {
//     buildHtmlText: jest.fn(() => "projectAgentPath")
//   };
//   // const { default: mockRealPerson } = jest.requireActual('../../builder/htmlBuilder');
//   // mockRealPerson.buildHtmlText = function () {
//   //     return "Hello";
//   // }    

//   // return mockRealPerson
// });

describe('HtmlBuilder', function() {

  // describe('composeHtml', () => {

  //   afterEach(() => {
  //     jest.resetAllMocks()
  //   })

  //   // it('should render html properly', async () => {
  //   //   htmlBuilder.buildHtmlText = jest.fn().mockReturnValue('mock full name');
  //   //   const getIntentsFake = jest.fn(() => "intents");
  //   //   // const buildHtmlTextFake = jest.fn(() => "html");
  //   //   dialogflowService.getIntents = getIntentsFake;
  //   //   // htmlBuilder.buildHtmlText = jest.fn(() => "intents")
  //   //   // htmlBuilder.buildHtmlText = buildHtmlTextFake;

  //   //   let res = {
  //   //     render : jest.fn() 
  //   //   };

  //   //   htmlBuilder.composeHtml('id', res);
  //   //   expect(res.render).toBeCalledWith( null);
      
  //   // })
  // });

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
      expect(message.getEdgeString).toBeCalledWith(outputContexts, intents[0],intentIndex);      
      expect(message.getVerticesString).toBeCalledWith(intentIndex, intentList, 2);
      expect(result).toEqual(expected);
    })
  });
});