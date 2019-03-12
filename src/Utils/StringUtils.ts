function extractIntentName(originalText) {
  const n = originalText.lastIndexOf('/');
  const result = originalText.substring(n + 1);
  return result;
}

function extractWebhookState(originalText) {
  const n = originalText.lastIndexOf('_');
  const result = originalText.substring(n + 1);
  return result;
}

export = {
  extractIntentName,
  extractWebhookState
};
