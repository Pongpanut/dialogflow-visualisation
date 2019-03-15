import HtmlBuilder from '../../builder/htmlBuilder';
import { IOutputContext } from '../../interface/IOutputContext';
import MessageBuilder from '../../builder/messageBuilder';

describe('HtmlBuilder', () => {
  describe('buildHtmlText', () => {
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
      }
    }

    it('should prepare properties for html building', async () => {
      const intentJson = require('../mockData/builder/htmlBuilder/buildHtmlText/intent1.json');
      let client: any;
      const messageBuilder = new MessageBuilder();
      let verticesMock = {
        intentStr: 'intentStr',
        idvIntentStr: 'idvIntentStr'
      };

      messageBuilder.getEdgeContent = jest.fn(() => 'edgeContent')
      messageBuilder.getVerticesContent = jest.fn(() => verticesMock);

      const htmlBuilder = new HtmlBuilder(client, messageBuilder);
      let contentIndex = getContentIndex();
      htmlBuilder.setContentIndex = jest.fn().mockReturnValue(contentIndex)

      const intents = intentJson;
      let htmlContext = htmlBuilder.buildHtmlContext(intents);

      const expected = {
        edgeStr: 'edgeContent',
        intentStr: 'intentStr',
        idvIntentStr: 'idvIntentStr'
      };

      expect(htmlContext).toEqual(expected);
      expect(messageBuilder.getEdgeContent).toBeCalledWith({
        intents: intents,
        intentIndex: contentIndex.intentIndex,
        intentOutputContexts: contentIndex.intentOutputContexts
      });

      expect(messageBuilder.getVerticesContent).toBeCalledWith({
        intents: intents,
        intentIndex: contentIndex.intentIndex,
        noOfVertices: intents.length
      });
    });

    describe('setContentIndex', () => {
      let client: any;
      let messageBuilder: any;

      const intentJson = require('../mockData/builder/htmlBuilder/buildHtmlText/intent1.json');
      const htmlBuilder = new HtmlBuilder(client, messageBuilder);
      let result = htmlBuilder.setContentIndex(intentJson)
      let contentIndex = getContentIndex();
      expect(result).toEqual(contentIndex);
    });
  });
});
