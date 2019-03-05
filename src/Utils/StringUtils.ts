function extractIntentName(originalText) {
  var n = originalText.lastIndexOf('/');
  var result = originalText.substring(n + 1);
  return result
}

export = { 
    extractIntentName, 
};