import {
  extractInputIntentName,
  extractOutputContexts,
  extractWebhookState,
  addEscapeString
} from '../../utils/StringUtils';
describe('dialogflowService', () => {
  describe('extractInputIntentName', () => {
    it('should extract input intent name from original text properly', () => {
      const result = extractInputIntentName(['directory/test1', 'directory/test2']);
      expect(result[0]).toBe('test1');
      expect(result[1]).toBe('test2');
    });
  });

  describe('extractOutputContexts', () => {
    it('should extract output intent name from original text properly', () => {
      const result = extractOutputContexts([
        { name: 'directory/test1' },
        { name: 'directory/test2' }
      ]);
      expect(result[0].name).toBe('test1');
      expect(result[1].name).toBe('test2');
    });
  });

  describe('extractWebhookState', () => {
    test('should extract webhook state from original text properly', () => {
      const result = extractWebhookState('WEBHOOK_STATE_ENABLED');
      expect(result).toBe('ENABLED');
    });

    test('should extract webhook state from original text properly even have no prefix', () => {
      const result = extractWebhookState('ENABLED');
      expect(result).toBe('ENABLED');
    });
  });

  describe('addEscapeString', () => {
    it('Add escape to string properly', () => {
      const result = addEscapeString('"name"\n address');
      expect(result).toEqual('\\"name\\"\\n address');
    });

    it('Add addEscapeString properly when input is empty', () => {
      const result = addEscapeString('');
      expect(result).toEqual('');
    });
  });
});
