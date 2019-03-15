import { IOutputContext } from '../interface/IOutputContext';
import DialogflowService from '../service/dialogflowService';
import MessageBuilder from '../builder/messageBuilder'


export default class HtmlBuilder {
  private client: any;
  private messageBuilder: MessageBuilder;

  constructor(client, messageBuilder) {
    this.client = client;
    this.messageBuilder = messageBuilder;
  }

  async composeHtml(projectId, res) {
    var service = new DialogflowService();
    let intents = await service.getIntents(this.client, projectId);
    const response = this.buildHtmlContext(intents);
    res.render('index', {
      projectId: projectId,
      nodes: JSON.stringify(response.intentStr),
      nodes2: JSON.stringify(response.idvIntentStr),
      edge: JSON.stringify(response.edgeStr)
    });
  }

  setContentIndex = (intents: any): any => {
    const intentIndex = new Map<string, number>();
    const intentOutputContexts: IOutputContext[] = [];

    intents.forEach((intent, index) => {
      intentIndex.set(intent.intentName, index)

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
    }
  }

  buildHtmlContext = (intents): any => {
    let verticesStr: any;
    let edgeStr: string = '';

    if (intents) {
      const content = this.setContentIndex(intents)

      edgeStr = this.messageBuilder.getEdgeContent({
        intents: intents,
        intentIndex: content.intentIndex,
        intentOutputContexts: content.intentOutputContexts
      });

      verticesStr = this.messageBuilder.getVerticesContent({
        intents: intents,
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


