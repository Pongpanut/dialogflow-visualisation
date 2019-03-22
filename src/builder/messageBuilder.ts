import { extractWebhookState, addEscapeString } from '../utils/StringUtils';
import { Color } from '../enum/color';
import { EdgeColor } from '../enum/edgeColor';

export default class MessageBuilder {
  MAGIC_NUMBER = 3;

  getEdgeContent = ({ intentOutputContexts, intents, intentIndex }): string => {
    console.log(intentOutputContexts)
    let edgeString: string = '';
    intentOutputContexts.forEach((context) => {
      context.outputContexts.forEach((outputContext, index) => {
        const outputIndex = index;
        const outputIntent = intents.filter(x => x.inputContextNames.includes(outputContext.name));
        console.log(outputIntent.length)
        if (outputIntent) {
          outputIntent.forEach((output) => {
            edgeString += `{from:'${context.index}'
              ,color:{color:\' ${Color[EdgeColor[outputIndex]]}\'},
              to: ${intentIndex.get(output.intentName)},title: '${outputContext.name} </br><p style =\"color:red\">lifespanCount: <b> ${outputContext.lifespanCount} </b></p>'},`;
          });
        }

      });
      // console.log(context)
      // edgeString += context.outputContexts.map((outputContext, index) => {
      //   outputContext.num = index
      //   outputContext.index = context.index;
      //   outputContext.intents = intents;
      //   outputContext.intentIndex = intentIndex;
      //   return outputContext;

      // }).reduce(this.getEdgeString, '');
      // console.log("%%%%%%")
      // console.log(edgeString)
    });
    // console.log("%%%%%%")
    console.log(edgeString)
    // console.log("%%%%%%")
    return edgeString;
  }



  // private getEdgeString = (sum, input): string => {

  //   // let test = '';
  //   let test = ''
  //   test += input.intents
  //     .filter(x => x.inputContextNames.includes(input.name))
  //     .reduce((acc, curr) => {
  //       console.log(input.index)
  //       console.log(input.intentIndex.get(curr.intentName))
  //       console.log(curr.intentName)
  //       console.log(input.name)

  //       return acc += `{from:'${input.index}'
  //                ,color:{color:\' ${Color[EdgeColor[input.num]]}\'},
  //                to: ${input.intentIndex.get(curr.intentName)},title: '${input.name} </br><p style =\"color:red\">lifespanCount: <b> ${input.lifespanCount} </b></p>'},`;


  //       // return acc;
  //     }, '');
  //   console.log(test)
  //   console.log("######")
  //   return test;
  // }



  // getEdgeString = (sum, input): string => {
  //   let edgeString = '';

  //   const outputIntent = input.intents.filter(x => x.inputContextNames[0] === input.name);
  //   if (outputIntent) {
  //     outputIntent.forEach((output, index) => {
  //       edgeString += `{from:'${input.index}'
  //       ,color:{color:\' ${Color[EdgeColor[index]]}\'},
  //       to: ${input.intentIndex.get(output.intentName)},title: '${input.name} </br><p style =\"color:red\">lifespanCount: <b> ${input.lifespanCount} </b></p>'},`;
  //     });
  //   }

  //   return edgeString
  // }

  // getEdgeContent = ({ intentOutputContexts, intents, intentIndex }): string => {
  //   console.log(intentOutputContexts.length)
  //   let edgeString = '';
  //   intentOutputContexts.forEach((dataObj) => {
  //     dataObj.outputContext.forEach((outputContext) => {
  //       const outputIntent = intents.filter(x => x.inputContextNames[0] === outputContext.name);
  //       if (outputIntent) {
  //         outputIntent.forEach((output, index) => {
  //           edgeString += `{from:'${dataObj.index}'
  //           ,color:{color:\' ${Color[EdgeColor[index]]}\'},
  //           to: ${intentIndex.get(output.displayName)},title: '${outputContext.name} </br><p style =\"color:red\">lifespanCount: <b> ${outputContext.lifespanCount} </b></p>'},`;
  //         });
  //       }
  //     });
  //   });

  //   return edgeString;
  // }



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
      color = Color.TEXT_BOTH;
      icon = 'both'
    } else if (state === 'ENABLED') {
      color = Color.TEXT_ENABLE;
      icon = 'enable'
    } else if (isFallback) {
      color = Color.TEXT_FALLBACK;
      icon = 'falback'
    } else {
      color = Color.TEXT_NORMAL;
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
