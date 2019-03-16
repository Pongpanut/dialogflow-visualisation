
import { Config } from './config/config';
import HtmlBuilder from './builder/HtmlBuilder';
import MessageBuilder from './builder/MessageBuilder';
import DialogflowService from './service/DialogflowService';
import StringUtils from './utils/StringUtils';
import * as express from 'express';
import dialogflow from 'dialogflow';

const app = express();
const config: Config = require('./config/config.json');
app.set('view engine', 'ejs');

const stringUtils = new StringUtils();
const client = new dialogflow.IntentsClient();
const messageBuilder = new MessageBuilder(stringUtils);
const service = new DialogflowService({
  messageBuilder,
  stringUtils,
  intentsClient: client,
  projectId: config.projectId
});

const builder = new HtmlBuilder({
  messageBuilder,
  dialogflowService: service
});

app.get('/', async (_, res) => await builder.composeHtml(config.projectId, res));
app.listen(3000, () => console.log('Example app listening on port 3000!'));
