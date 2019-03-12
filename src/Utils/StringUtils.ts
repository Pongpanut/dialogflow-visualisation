function extractIntentName(originalText) {
  var n = originalText.lastIndexOf('/');
  var result = originalText.substring(n + 1);
  return result
}

function extractWebhookState(originalText) {
  var n = originalText.lastIndexOf('_');
  var result = originalText.substring(n + 1);
  return result
}

export = { 
    extractIntentName,
    extractWebhookState 
};