// import * as functions from 'firebase-functions';
import { IIntent } from './interface/IIntent';

const dialogflow = require('dialogflow');
const uuid = require('uuid');
const express = require('express')
const app = express()
const stringUtils = require('./Utils/StringUtils');

// exports.helloWorld = functions.https.onRequest((request, response) => {
//   runSample('x-petch').then(() => console.log('this will succeed')).catch(() => console.log('obligatory catch'));
//   response.send('Hello Petch. This is updated. with runSample ');
// });

app.get('/', (req, res) => res.send('Hello World!'));
app.get('/matchintent', (req, res) => runSample('x-petch').then(() => console.log('Success')).catch(() => console.log('obligatory catch')));
app.listen(3000, () => console.log('Example app listening on port 3000!'));

async function runSample(projectId = 'your-project-id') {  
    listIntents('x-petch').then(() => console.log('listIntents Success')).catch(() => console.log('obligatory catch'))
}

async function listIntents(projectId){
  const intentsClient = new dialogflow.IntentsClient();  
  const projectAgentPath = intentsClient.projectAgentPath(projectId);

  const request = {
    parent: projectAgentPath,
  };
   
  let responses 
  try {
    responses = await intentsClient.listIntents(request);
    if(responses){
        const responseData =  responses[0];
        var intentList: IIntent[] = [];

        responseData.forEach(function (data) {
            intentList.push({
                inputContextNames: data.inputContextNames[0] ? 
                  stringUtils.extractIntentName(data.inputContextNames[0]) : '',
                outputContexts: data.outputContexts[0] ?
                  stringUtils.extractIntentName(data.outputContexts[0].name) : '',
                intentName: data.displayName
            });          
        }); 
        console.log(intentList);
        // console.log('################### Full version response #######');
        // console.log(responseData);
        // console.error('Data count'+ responses[0].length);   
    }
  } catch (err) {
    console.error('ERROR:', err);
  }

//   console.log(responses[0]);   
}

async function detectIntent(projectId){
    const sessionId = uuid.v4();
    const sessionClient = new dialogflow.SessionsClient();
    const sessionPath = sessionClient.sessionPath(projectId, sessionId);
    const request = {
       session: sessionPath,
       queryInput: {
         text: {
           text: 'ดูหนัง',
           languageCode: 'en-US',
         },
       },
     };
     let responses 
     try {
       responses = await sessionClient.detectIntent(request);
     } catch (err) {
       console.error('ERROR:', err);
     }

     console.log(responses); 
     console.log('Detected intent');
     const result = responses[0].queryResult;
     console.log('Query:' +result.queryText);
     console.log('OutputContexts:' +JSON.stringify(result.outputContexts));
     console.log('Response: ${result.fulfillmentText}');
     if (result.intent) {
       console.log('Intent: '+result.intent.displayName);
     } else {
       console.log('No intent matched.');
     }
}
