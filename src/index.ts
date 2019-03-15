
import { Config } from './config/config';
import HtmlBuilder from './builder/htmlBuilder';
import * as express from 'express';
import dialogflow from 'dialogflow';

const app = express();
const config: Config = require('./config/config.json');

app.set('view engine', 'ejs');

const builder = new HtmlBuilder()
// Initiate client in index
const intentsClient = new dialogflow.IntentsClient(); //Naming if scope is clear; no need to be verbose
// Unused variable use _ 
app.get('/', async (_, res) => await builder.composeHtml(intentsClient, config.projectId, res));

app.listen(3000, () => console.log('Example app listening on port 3000!'));
