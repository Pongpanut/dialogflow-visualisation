// import { IIntent } from '../interface/IIntent';
import { IOutputContext } from '../interface/IOutputContext';
import dialogflowService from '../service/dialogflowService';
import MessageBuilder from './messageBuilder'

export default class HtmlBuilder {
  private client: any;

  constructor(client) {
    this.client = client;
  }

  async composeHtml(projectId, res) {
    var service = new dialogflowService();
    let intents = await service.getIntents(this.client, projectId);
    const response = this.buildHtmlText(intents);
    res.render('index', {
      projectId: projectId,
      nodes: JSON.stringify(response.intentStr),
      nodes2: JSON.stringify(response.idvIntentStr),
      edge: JSON.stringify(response.edgeStr)
    });
  }

  private setContentIndex = (intents) => {
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

  buildHtmlText(intents): any {
    let verticesStr: any;
    let edgeStr: string = '';
    let message = new MessageBuilder();

    if (intents) {
      const content = this.setContentIndex(intents)

      edgeStr = message.getEdgeContent({
        intents: intents,
        intentIndex: content.intentIndex,
        intentOutputContexts: content.intentOutputContexts
      });

      verticesStr = message.getVerticesContent({
        intentIndex: content.intentIndex,
        intents: intents,
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


