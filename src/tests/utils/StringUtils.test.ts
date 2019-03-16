import StringUtils from '../../utils/StringUtils';
describe('dialogflowService', () => {
  let stringUtils: StringUtils;

  beforeEach(() => {
    stringUtils = new StringUtils();
  });

  describe('extractInputIntentName', () => {
    it('should extract input intent name from original text properly', () => {
      const result = stringUtils.extractInputIntentName(['directory/test1', 'directory/test2']);
      expect(result[0]).toBe('test1');
      expect(result[1]).toBe('test2');
    });
  });

  describe('extractOutputContexts', () => {
    it('should extract output intent name from original text properly', () => {
      const result = stringUtils.extractOutputContexts([
        { name: 'directory/test1' },
        { name: 'directory/test2' }
      ]);
      expect(result[0].name).toBe('test1');
      expect(result[1].name).toBe('test2');
    });
  });

  describe('extractWebhookState', () => {
    test('should extract webhook state from original text properly', () => {
      const result = stringUtils.extractWebhookState('WEBHOOK_STATE_ENABLED');
      expect(result).toBe('ENABLED');
    });

    test('should extract webhook state from original text properly even have no prefix', () => {
      const result = stringUtils.extractWebhookState('ENABLED');
      expect(result).toBe('ENABLED');
    });
  });

  describe('addEscapeString', () => {
    it('Add escape to string properly', () => {
      const result = stringUtils.addEscapeString('"name"\n address');
      expect(result).toEqual('\\"name\\"\\n address');
    });

    it('Add addEscapeString properly when input is empty', () => {
      const result = stringUtils.addEscapeString('');
      expect(result).toEqual('');
    });
  });
});
