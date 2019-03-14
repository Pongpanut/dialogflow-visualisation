
import { Config } from './config/config';
import htmlBuilder from './builder/htmlBuilder';
const express = require('express');
const app = express();
const config: Config = require('./config/config.json');

app.set('view engine', 'ejs');
app.get('/', async (req, res) => await htmlBuilder.composeHtml(config.projectId, res));
app.listen(3000, () => console.log('Example app listening on port 3000!'));
