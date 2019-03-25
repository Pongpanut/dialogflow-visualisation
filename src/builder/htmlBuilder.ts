import { IOutputContext } from '../interface/IOutputContext';
import MessageBuilder from '../builder/messageBuilder';
import DialogflowService from '../service/dialogflowService';

export default class HtmlBuilder {
  private messageBuilder: MessageBuilder;
  private dialogflowService: DialogflowService;

  constructor({ messageBuilder, dialogflowService }) {
    this.messageBuilder = messageBuilder;
    this.dialogflowService = dialogflowService;
  }

  async composeHtml(projectId, res) {
    const intents = await this.dialogflowService.getIntents();
    const response = this.buildHtmlContext(intents);
    res.render('index2', {
      projectId,
      nodes: JSON.stringify(response.intentStr),
      nodes2: JSON.stringify(response.idvIntentStr),
      edge: JSON.stringify(response.edgeStr)
    });
  }

  setContentIndex = (intents: any): any => {
    const intentIndex = new Map<string, number>();
    const intentOutputContexts: IOutputContext[] = [];

    intents.forEach((intent, index) => {
      intentIndex.set(intent.intentName, index);
      if (intent.outputContexts && intent.outputContexts.length) {
        intentOutputContexts.push({
          index,
          outputContexts: intent.outputContexts
        });
      }
    });
    return {
      intentIndex,
      intentOutputContexts
    };
  }

  buildHtmlContext = (intents): any => {
    let verticesStr: any;
    let edgeStr: string = '';

    if (intents) {
      const content = this.setContentIndex(intents);

      edgeStr = this.messageBuilder.getEdgeContent({
        intents,
        intentIndex: content.intentIndex,
        intentOutputContexts: content.intentOutputContexts
      });

      verticesStr = this.messageBuilder.getVerticesContent({
        intents,
        intentIndex: content.intentIndex,
        noOfVertices: intents.length
      });
    }

    return {
      edgeStr,
      intentStr: verticesStr.intentStr,
      idvIntentStr: verticesStr.idvIntentStr
    };
  }
}
