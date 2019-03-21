import { extractWebhookState, addEscapeString } from '../utils/StringUtils';
import { Color } from '../enum/color';
import { EdgeColor } from '../enum/edgeColor';

export default class MessageBuilder {
  MAGIC_NUMBER = 3;

  getEdgeContent = ({ intentOutputContexts, intents, intentIndex }): string => {
    let edgeString: string = '';
    intentOutputContexts.forEach((context) => {
      edgeString += context.outputContexts.map((outputContext) => {
        outputContext.index = context.index;
        outputContext.intents = intents;
        outputContext.intentIndex = intentIndex;
        return outputContext;
      }).reduce(this.getEdgeString, '');
    });
    return edgeString;
  }

  private getEdgeString = (sum, input): string => {
    const edgeString = input.intents
      .filter(x => x.inputContextNames.includes(input.name))
      .reduce((acc, curr, index) => {
        acc += `{from:'${input.index}'
             ,color:{color:\' ${Color[EdgeColor[index]]}\'},
             to: ${input.intentIndex.get(curr.intentName)},title: '${input.name} </br><p style =\"color:red\">lifespanCount: <b> ${input.lifespanCount} </b></p>'},`;
        return acc;
      }, '');

    return edgeString;
  }

  getVerticesContent = ({ intentIndex, intents, noOfVertices }) => {
    let intentStr: string = '';
    let idvIntentStr: string = '';
    let detail;
    for (let i = 0; i < noOfVertices; i += 1) {
      const intent = intents.find(x => x.id === i);
      if (intent) {
        detail = this.getVerticeColorAndIcon(intent.webhookState, intent.isFallback);
        if ((intent.inputContextNames.length) || intent.outputContexts.length) {
          intentStr += `{id: ${i} , label: "${intent.intentName}",
          group: '${detail.icon}',
          font: {size: 21,color: '${detail.color}'},
          title: "${this.buildVerticesTooltip(intent)}"},`;
        } else {
          idvIntentStr += `{id: ${i} , label:" ${intent.intentName}",
          group: '${detail.icon}',
          font: {size: 21,color: '${detail.color}'},
          title: "${this.buildVerticesTooltip(intent)}"},`;
        }
      }
    }
    return {
      intentStr,
      idvIntentStr
    };
  }

  getTrainingPhrases = (trainingPhrases): string => {
    let trainingPhrasesTxt = '';
    if (trainingPhrases && trainingPhrases.length) {
      trainingPhrases.slice(0, this.MAGIC_NUMBER).forEach((phrase, index) => {
        trainingPhrasesTxt += phrase.parts[0].text;
        if ((index < trainingPhrases.length - 1) && index < 2) {
          trainingPhrasesTxt += ',';
        }
      });
    }
    return trainingPhrasesTxt;
  }

  getMessageText = (messages) => {
    const isText = message => message.message === 'text' && message.text.text.length > 0;
    const isPayload = message => message.message === 'payload';
    const sample = message => message.text.text[Math.floor(Math.random() * message.text.text.length)];
    const responseTxt: string = messages.filter(isText).map(sample)[0];
    const payloadResponse = messages.filter(isPayload).length;

    return {
      responseTxt,
      payloadResponse
    };
  }

  private getVerticeColorAndIcon(webhookState, isFallback) {
    const state = extractWebhookState(webhookState);
    let color;
    let icon;
    if (state === 'ENABLED' && isFallback) {
      color = Color.RED;
      icon = 'both'
    } else if (state === 'ENABLED') {
      color = Color.GREEN;
      icon = 'enable'
    } else if (isFallback) {
      color = Color.BLUE;
      icon = 'falback'
    } else {
      color = Color.BLACK;
      icon = 'normal'
    }
    return {
      color,
      icon
    };
  }

  buildVerticesTooltip(intent) {
    return (intent.trainingPhrase
      ? `Training phrases are ${addEscapeString(intent.trainingPhrase)} </br>`
      : '')
      + (intent.responseMsg
        ? `Response Message is ${addEscapeString(intent.responseMsg)} </br>`
        : '')
      + (intent.payloadCount > 0
        ? `Number of Payload is ${intent.payloadCount}`
        : '');
  }
}
