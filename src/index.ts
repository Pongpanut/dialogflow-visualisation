
import { Config } from './config/config';
const htmlBuilder = require('./builder/htmlBuilder');
const dialogflowService = require('./service/dialogflowService');
const express = require('express');
const app = express();
const config: Config = require('./config/config.json');


app.set('view engine', 'ejs');
app.get('/', (req, res) => composeHtml(config.projectId, res));
app.listen(3000, () => console.log('Example app listening on port 3000!'));

async function composeHtml(projectId = 'your-project-id', res) {
  const intentsResult = await dialogflowService.getIntents(projectId);
  const response = await htmlBuilder.buildHtmlText(intentsResult);
  res.render('index', {projectId: config.projectId,
    nodes: JSON.stringify(response.intentStr),
    nodes2: JSON.stringify(response.idvIntentStr),
    edge: JSON.stringify(response.edgeStr)
  });
}
