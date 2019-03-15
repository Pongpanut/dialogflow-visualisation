
import { Config } from './config/config';
import HtmlBuilder from './builder/htmlBuilder';
import MessageBuilder from './builder/messageBuilder'

import * as express from 'express';
import dialogflow from 'dialogflow';

const app = express();
const config: Config = require('./config/config.json');
app.set('view engine', 'ejs');

const client = new dialogflow.IntentsClient();
const messageBuilder = new MessageBuilder();
const builder = new HtmlBuilder(client, messageBuilder)


app.get('/', async (_, res) => await builder.composeHtml(config.projectId, res));

app.listen(3000, () => console.log('Example app listening on port 3000!'));
