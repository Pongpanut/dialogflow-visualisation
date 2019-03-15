function extractInputIntentName(inputContexts): any {
  let newContext = inputContexts.map((context) => {
    const n = context.lastIndexOf('/');
    const result = context.substring(n + 1);
    return result;
  });
  return newContext;
}

function extractOutputContexts(outputContexts): any {
  let newContext = outputContexts.map((context) => {
    const n = context.name.lastIndexOf('/');
    const name = context.name.substring(n + 1);
    return {
      name: name,
      lifespanCount: context.lifespanCount,
      parameters: context.parameters
    };
  });

  return newContext;
}


function extractWebhookState(originalText) {
  const n = originalText.lastIndexOf('_');
  const result = originalText.substring(n + 1);
  return result;
}

function addEscapeString(originalText): string {
  if (originalText) {
    return originalText.replace(/\n/g, '\\n').replace(/"/g, '\\"');
  }
  return '';
}

export = {
  extractInputIntentName,
  extractWebhookState,
  extractOutputContexts,
  addEscapeString
};
