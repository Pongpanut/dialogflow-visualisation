export default class StringUtils {
  constructor() {
    //
  }

  extractInputIntentName(inputContexts): any {
    const newContext = inputContexts.map((context) => {
      const n = context.lastIndexOf('/');
      const result = context.substring(n + 1);
      return result;
    });
    return newContext;
  }

  extractOutputContexts(outputContexts): any {
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
  }

  extractWebhookState(originalText) {
    const n = originalText.lastIndexOf('_');
    const result = originalText.substring(n + 1);
    return result;
  }

  addEscapeString(originalText): string {
    if (originalText) {
      return originalText.replace(/\n/g, '\\n').replace(/"/g, '\\"');
    }
    return '';
  }
}
