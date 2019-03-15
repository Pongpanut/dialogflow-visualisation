
import { Config } from './config/config';
import HtmlBuilder from './builder/htmlBuilder';
import * as express from 'express';
import dialogflow from 'dialogflow';

const app = express();
const config: Config = require('./config/config.json');
app.set('view engine', 'ejs');

const client = new dialogflow.IntentsClient();
const builder = new HtmlBuilder(client)
app.get('/', async (_, res) => await builder.composeHtml(config.projectId, res));

app.listen(3000, () => console.log('Example app listening on port 3000!'));
