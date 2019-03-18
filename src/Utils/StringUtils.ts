export const extractInputIntentName = (inputContexts) => {
  const newContext = inputContexts.map((context) => {
    const n = context.lastIndexOf('/');
    const result = context.substring(n + 1);
    return result;
  });
  return newContext;
};

export const extractOutputContexts = (outputContexts) => {
  const newContext = outputContexts.map((context) => {
    const n = context.name.lastIndexOf('/');
    const name = context.name.substring(n + 1);
    return {
      name,
      lifespanCount: context.lifespanCount,
      parameters: context.parameters
    };
  });
  return newContext;
};

export const extractWebhookState = (originalText) => {
  const n = originalText.lastIndexOf('_');
  const result = originalText.substring(n + 1);
  return result;
};

export const addEscapeString = (originalText): string => {
  if (originalText) {
    return originalText.replace(/\n/g, '\\n').replace(/"/g, '\\"');
  }
  return '';
};
