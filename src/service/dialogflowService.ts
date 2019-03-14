const dialogflow = require('dialogflow');

async function getIntents(projectId): Promise<any> {
  const intentsClient = new dialogflow.IntentsClient();
  const projectAgentPath = intentsClient.projectAgentPath(projectId);
  let responses;
  const request = {
    parent: projectAgentPath,
    intentView: 'INTENT_VIEW_FULL',
  };

  try {
    responses = await intentsClient.listIntents(request);
  } catch (err) {
    console.error('ERROR:', err);
  }
  return responses;
}

module.exports = {
  getIntents
};
