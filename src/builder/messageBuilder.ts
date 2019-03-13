const stringUtils = require('../utils/StringUtils');
import { Color } from '../enum/color';
import { EdgeColor } from '../enum/edgeColor';

async function getEdgeString(data, intents, intentIndex): Promise<string> {
  let edgeString = '';
  data.forEach((dataObj) => {
    dataObj.outputContext.forEach((outputContext) => {
      const outputIntent = intents.filter(x => x.inputContextNames[0] === outputContext.name);
      if (outputIntent) {
        outputIntent.forEach((output, index) => {
          edgeString += `{from:'${dataObj.index}'
          ,color:{color:\' ${Color[EdgeColor[index]]}\'},
          to: ${intentIndex.get(output.displayName)},
          title: '${stringUtils.extractIntentName(outputContext.name)} </br> <p style =\"color:red\">lifespanCount: <b> ${outputContext.lifespanCount} </b></p>'},`;
        });
      }
    });
  });

  return edgeString;
}

async function getVerticesString(intentIndex, intentDict, noOfVertices): Promise<any> {
  let i: number = 0;
  let intentStr: string = '';
  let idvIntentStr: string = '';
  let color: string = '';

  for (i = 1 ; i <= noOfVertices ; i += 1) {
    const intent = intentDict.find(x => x.id === i);
    if( intent ){
      color = getVerticeColor(intent.webhookState, intent.isFallback);
      if (intent.inputContextNames !== '' || intent.outputContexts !== '') {
        intentStr += `{id: ${i} , label: "${intent.intentName}",
        font: {color: '${color}'},
        title: "${buildVerticesTooltip(intent)}"},`;
      } else {
        idvIntentStr += `{id: ${i} , label:" ${intent.intentName}",
        font: {color: '${color}'},
        title: "${buildVerticesTooltip(intent)}"},`;
      }
    }
  }
  return {
    intentStr,
    idvIntentStr
  };
}


function getTrainingPhrases(trainingPhrases) : string {
    let trainingPhrasesTxt = '';

    if (trainingPhrases && trainingPhrases.length) {
      for (const { phrase, index } of trainingPhrases
        .map((phrase, index) => ({ phrase, index }))) {
        if (index === 3) break;
        trainingPhrasesTxt += phrase.parts[0].text;
        if ((index < trainingPhrases.length - 1) && index < 2) {
          trainingPhrasesTxt += ',';
        }
      }
    }

    return trainingPhrasesTxt;
  }

  function getMessageText(messages) : any {
    let responseTxt : string = '';
    let payloadResponse : number = 0;
    
    messages.forEach((messageObj) => {
      if (messageObj.message === 'text' && messageObj.text) {
        
        const response = messageObj.text.text;
        if (response.length > 1) {
          responseTxt = response[Math.floor(Math.random() * response.length)];
        } else {
          responseTxt = messageObj.text.text[0];
        }
      } else {
        payloadResponse += 1;
      }
    });

    return {
      responseTxt,
      payloadResponse
    };
  }

  function getVerticeColor(webhookState, isFallback) : Color {
    const state = stringUtils.extractWebhookState(webhookState);
    let color;
    if (state === 'ENABLED' && isFallback) {
      color = Color.RED;
    } else if (state === 'ENABLED') {
      color =  Color.GREEN;
    } else if (isFallback) {
      color =  Color.BLUE;
    } else {
      color =  Color.BLACK;
    }
    return color;
  }

  function addEscapeString(originalText) : string {
    if (originalText) {
      return originalText.replace(/\n/g, '\\n').replace(/"/g, '\\"');
    }
    return '';
  }

  function buildVerticesTooltip(intent) {
    return (intent.trainingPhrase !== ''
          ? `Training phrases is ${addEscapeString(intent.trainingPhrase)} </br>`
          : '')
        + (intent.payloadCount > 0
          ? `Number of Payload is ${intent.payloadCount}`
          : '');
  }

  module.exports = {
    getEdgeString,
    getVerticesString,
    getTrainingPhrases,
    getMessageText
  }
  

