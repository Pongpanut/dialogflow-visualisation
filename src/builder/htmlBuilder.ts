// import { IIntent } from '../interface/IIntent';
import { IOutputContext } from '../interface/IOutputContext';
import dialogflowService from '../service/dialogflowService';
import { Config } from '../config/config';
import MessageBuilder from './messageBuilder'
const config: Config = require('../config/config.json');

export default class HtmlBuilder {
  constructor() {
  }

  async  composeHtml(intentsClient, projectId = 'your-project-id', res) {
    var service = new dialogflowService();
    let intents = await service.getIntents(intentsClient, config.projectId);
    const response = await this.buildHtmlText(intents);
    res.render('index', {
      projectId: config.projectId,
      nodes: JSON.stringify(response.intentStr),
      nodes2: JSON.stringify(response.idvIntentStr),
      edge: JSON.stringify(response.edgeStr)
    });
  }

  private setIntentIndex = (intents) => {
    const intentIndex = new Map<string, number>();
    intents.forEach((intent, index) => { intentIndex.set(intent.intentName, index));
    return intentIndex;
  }

  async  buildHtmlText(intents): Promise<any> {
    let verticesStr: any;
    let edgeStr: string = '';
    let message = new MessageBuilder();

    if (intents) {
      const intentOutputContexts: IOutputContext[] = [];

      const intentIndex = this.setIntentIndex(intents)
      intents.forEach((data, index) => {
        if (data.outputContexts && data.outputContexts.length) {
          intentOutputContexts.push({
            index,
            outputContexts: data.outputContexts
          });
        }
      });

      edgeStr = await message.getEdgeContent(intentOutputContexts, intents, intentIndex);
      verticesStr = await message.getVerticesContent(intentIndex, intents, intents.length);
    }
    return {
      edgeStr,
      intentStr: verticesStr.intentStr,
      idvIntentStr: verticesStr.idvIntentStr
    };
  }

}


