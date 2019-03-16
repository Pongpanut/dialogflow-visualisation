import HtmlBuilder from '../../builder/HtmlBuilder';
import { IOutputContext } from '../../interface/IOutputContext';
import MessageBuilder from '../../builder/MessageBuilder';
import StringUtils from '../../utils/StringUtils';
import DialogflowService from '../../service/DialogflowService';

describe('HtmlBuilder', () => {
  describe('buildHtmlText', () => {
    let htmlBuilder: any;
    let messageBuilder: any;

    beforeEach(() => {
      const verticesMock = {
        intentStr: 'intentStr',
        idvIntentStr: 'idvIntentStr'
      };

      const stringUtils: StringUtils = new StringUtils();

      messageBuilder = new MessageBuilder(stringUtils);
      messageBuilder.getEdgeContent = jest.fn(() => 'edgeContent');
      messageBuilder.getVerticesContent = jest.fn(() => verticesMock);

      const intentsClient: any = {};
      const dialogflowService: DialogflowService = new DialogflowService({
        messageBuilder,
        intentsClient,
        stringUtils,
        projectId: 'projID'
      });

      htmlBuilder = new HtmlBuilder({ messageBuilder, dialogflowService });
    });

    test('should prepare properties for html building', async () => {
      const intentJson = require('../mockData/builder/htmlBuilder/buildHtmlText/intent1.json');
      const contentIndex = getContentIndex();
      htmlBuilder.setContentIndex = jest.fn().mockReturnValue(contentIndex);

      const intents = intentJson;
      const htmlContext = htmlBuilder.buildHtmlContext(intents);

      const expected = {
        edgeStr: 'edgeContent',
        intentStr: 'intentStr',
        idvIntentStr: 'idvIntentStr'
      };

      expect(htmlContext).toEqual(expected);
      expect(messageBuilder.getEdgeContent).toBeCalledWith({
        intents,
        intentIndex: contentIndex.intentIndex,
        intentOutputContexts: contentIndex.intentOutputContexts
      });

      expect(messageBuilder.getVerticesContent).toBeCalledWith({
        intents,
        intentIndex: contentIndex.intentIndex,
        noOfVertices: intents.length
      });
    });

    describe('setContentIndex', () => {
      test('should set content index properly', () => {
        const intentJson = require('../mockData/builder/htmlBuilder/buildHtmlText/intent1.json');
        const result = htmlBuilder.setContentIndex(intentJson);
        const contentIndex = getContentIndex();
        expect(result).toEqual(contentIndex);
      });
    });
  });

  function getContentIndex() {
    const intentIndex = new Map<string, number>();
    const intentOutputContexts: IOutputContext[] = [];

    intentIndex.set('intent1', 0);
    intentIndex.set('intent2', 1);
    intentOutputContexts.push({
      outputContexts: ['intentName'],
      index: 0
    });
    intentOutputContexts.push({
      outputContexts: ['intentName2'],
      index: 1
    });

    return {
      intentIndex,
      intentOutputContexts
    };
  }
});
