
import { Config } from './config/config';
import HtmlBuilder from './builder/htmlBuilder';
import MessageBuilder from './builder/messageBuilder';
import DialogflowService from './service/dialogflowService';
import * as express from 'express';
import dialogflow from 'dialogflow';

const app = express();
const config: Config = require('./config/config.json');
app.set('view engine', 'ejs');

const client = new dialogflow.IntentsClient();
const messageBuilder = new MessageBuilder();
const service = new DialogflowService({
  messageBuilder,
  intentsClient: client,
  projectId: config.projectId,
  languageCode: config.languageCode
});

const builder = new HtmlBuilder({
  messageBuilder,
  dialogflowService: service
});

app.get('/', async (_, res) => await builder.composeHtml(config.projectId, res));

const server = app.listen(8080, () => {
  const host = server.address().address;
  const port = server.address().port;

  console.log(`Example app listening at http://${host}:${port}`);
});
// app.listen(3000, () => console.log('Example app listening on port 3000!'));
