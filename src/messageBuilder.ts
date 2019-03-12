const stringUtils = require('./utils/StringUtils');
import {Color} from './enum/color';
import {EdgeColor} from './enum/edgeColor';


export class MessageBuilder {    

    constructor(){

    }
    public async getEdgeString(data, intents, intentIndex): Promise<string>{
        let edgeString = '';
    
        data.forEach(function(dataObj){
          dataObj.outputContext.forEach(function(outputContext){
              let outputIntent = intents.filter(x => x.inputContextNames[0] == outputContext.name)
              if(outputIntent){
                    outputIntent.forEach(function (data, index) {
                         edgeString += '{from:' + dataObj.index + ',color:{color:\''+Color[EdgeColor[index]]+'\'},  to: '+  intentIndex.get(data.displayName) + ', title: "'+stringUtils.extractIntentName(outputContext.name)+' </br> <p style =\'color:red\'> lifespanCount: <b>'+outputContext.lifespanCount+'</b></p>"},';
                    });
                }
            });
        });
        return edgeString
    }

    public async getVerticesString(intentIndex, intentDict, noOfVertices) : Promise<any>{ 
        let i: number = 0; 
        let intentStr: string = ''; 
        let idvIntentStr: string = ''; 
        let color: string = ''; 
            
        for(i = 1 ;i <= noOfVertices ;i++) {
            let intent = intentDict.find(x => x.id == i);
            color = this.getVerticeColor(intent.webhookState, intent.isFallback);
            if(intent.inputContextNames != "" || intent.outputContexts != ""){
                intentStr += '{id:' + i + ', label: "'+ intent.intentName + '", font: {color: \''+color +'\'}, title: "'+ this.buildVerticesTooltip(intent)+'"},';
            }
            else {
                idvIntentStr += '{id:' + i + ', label:"'+ intent.intentName + '", font: {color: \''+color +'\'}, title: "'+ this.buildVerticesTooltip(intent)+'"},'; 
            }
        }   
        return {
            intentStr: intentStr,
            idvIntentStr: idvIntentStr
        };
    }

    public getTrainingPhrases(trainingPhrases) : string{
        let trainingPhrasesTxt = ''
        
        if(trainingPhrases && trainingPhrases.length){
          for (const {phrase, index} of trainingPhrases.map((phrase, index) => ({ phrase, index }))) {          
            if ( index === 3 ) break;        
            trainingPhrasesTxt += phrase.parts[0].text
            if ((index < trainingPhrases.length - 1) && index < 2 ){
                trainingPhrasesTxt += ','
            }         
          }
        }
    
        return trainingPhrasesTxt;
    }

    public getMessageText(messages){
        let responseTxt : string = '';
        let payloadResponse : number = 0;
        
        messages.forEach(messageObj => {
            if (messageObj.message = 'text' && messageObj.text){
                let response = messageObj.text.text;
                if(response.length > 1){
                responseTxt = response[Math.floor(Math.random() * response.length)];
                }
                else{
                responseTxt = messageObj.text.text[0]
                }
            }
            else{
                payloadResponse++
            }
        });

        return {
            responseTxt: responseTxt,
            payloadResponse: payloadResponse
        }
    }

    private getVerticeColor(webhookState, isFallback){
        let state = stringUtils.extractWebhookState(webhookState);
        if (state == "ENABLED" && isFallback){
            return Color.RED;
        }
        else if(state == "ENABLED"){
            return Color.GREEN;
        }
        else if(isFallback){
            return Color.BLUE;
        }
        else{
            return Color.BLACK;
        }
    }

    private addEscapeString(originalText)
    {
        if(originalText){
            return originalText.replace(/\n/g, '\\n').replace(/"/g, '\\"');
        }
        return ''
    }

    private buildVerticesTooltip(intent){
      let trainingPhrase = intent.trainingPhrase != ""? 'Training phrases is ' + this.addEscapeString(intent.trainingPhrase) + '</br>' : '';
      let responseMsg = intent.responseMsg != "" ?   'Response message is ' + this.addEscapeString(intent.responseMsg) + '</br>' : '';
      let payload = intent.payloadCount > 0 ? 'Number of Payload is '+ intent.payloadCount : '';
     
      return trainingPhrase
         + responseMsg
         + payload;
    }
}
