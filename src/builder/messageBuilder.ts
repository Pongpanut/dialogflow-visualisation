import StringUtils from '../utils/StringUtils';
import { Color } from '../enum/color';
import { EdgeColor } from '../enum/edgeColor';

export default class MessageBuilder {
  private stringUtils: StringUtils;
  constructor(stringUtils) {
    this.stringUtils = stringUtils;
  }

  getEdgeContent({ intentOutputContexts, intents, intentIndex }): string {
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

  private getEdgeString(sum, input): string {
    let edgeString = '';
    const outputIntent = input.intents.filter(x => x.inputContextNames.includes(input.name));

    if (outputIntent) {
      outputIntent.forEach((output, index) => {
        edgeString += `{from:'${input.index}'
        ,color:{color:\' ${Color[EdgeColor[index]]}\'},
        to: ${input.intentIndex.get(output.intentName)},title: '${input.name} </br><p style =\"color:red\">lifespanCount: <b> ${input.lifespanCount} </b></p>'},`;
      });
    }

    return edgeString;
  }

  getVerticesContent({ intentIndex, intents, noOfVertices }): any {
    let i: number = 0;
    let intentStr: string = '';
    let idvIntentStr: string = '';
    let color: string = '';
    for (i = 0; i < noOfVertices; i += 1) {
      const intent = intents.find(x => x.id === i);
      if (intent) {
        color = this.getVerticeColor(intent.webhookState, intent.isFallback);
        if ((intent.inputContextNames.length) || intent.outputContexts.length) {
          intentStr += `{id: ${i} , label: "${intent.intentName}",
          font: {color: '${color}'},
          title: "${this.buildVerticesTooltip(intent)}"},`;
        } else {
          idvIntentStr += `{id: ${i} , label:" ${intent.intentName}",
          font: {color: '${color}'},
          title: "${this.buildVerticesTooltip(intent)}"},`;
        }
      }
    }
    return {
      intentStr,
      idvIntentStr
    };
  }

  getTrainingPhrases(trainingPhrases): string {
    let trainingPhrasesTxt = '';

    if (trainingPhrases && trainingPhrases.length) {
      trainingPhrases.slice(0, 3).forEach((phrase, index) => {
        trainingPhrasesTxt += phrase.parts[0].text;
        if ((index < trainingPhrases.length - 1) && index < 2) {
          trainingPhrasesTxt += ',';
        }
      });
    }

    return trainingPhrasesTxt;
  }

  getMessageText(messages): any {
    let responseTxt: string = '';
    let payloadResponse: number = 0;

    if (messages) {
      messages.forEach((messageObj) => {
        if (messageObj.message === 'text' && messageObj.text) {
          const response = (messageObj.text.text) ? messageObj.text.text : [];
          if (response.length > 1) {
            responseTxt = response[Math.floor(Math.random() * response.length)];
          } else {
            responseTxt = response[0];
          }
        } else {
          payloadResponse += 1;
        }
      });
    }

    return {
      responseTxt,
      payloadResponse
    };
  }

  private getVerticeColor(webhookState, isFallback): Color {
    const state = this.stringUtils.extractWebhookState(webhookState);
    let color;
    if (state === 'ENABLED' && isFallback) {
      color = Color.RED;
    } else if (state === 'ENABLED') {
      color = Color.GREEN;
    } else if (isFallback) {
      color = Color.BLUE;
    } else {
      color = Color.BLACK;
    }
    return color;
  }

  buildVerticesTooltip(intent) {
    return (intent.trainingPhrase !== ''
      ? `Training phrases are ${this.stringUtils.addEscapeString(intent.trainingPhrase)} </br>`
      : '')
      + (intent.responseMsg !== ''
        ? `Response Message is ${this.stringUtils.addEscapeString(intent.responseMsg)} </br>`
        : '')
      + (intent.payloadCount > 0
        ? `Number of Payload is ${intent.payloadCount}`
        : '');
  }
}
