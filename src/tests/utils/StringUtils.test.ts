import StringUtils = require('../../utils/StringUtils');

describe('StringUtils', () => {
  describe('extractIntentName', () => {
    it('should extract intent name from original text properly', () => {
      const result = StringUtils.extractIntentName('directory/test');
      expect(result).toBe('test');
    });

    it('should extract intent name from original text properly even have no prefix', () => {
      const result = StringUtils.extractIntentName('test');
      expect(result).toBe('test');
    });
  });

  describe('extractWebhookState', () => {
    it('should extract webhook state from original text properly', () => {
      const result = StringUtils.extractWebhookState('WEBHOOK_STATE_ENABLED');
      expect(result).toBe('ENABLED');
    });

    it('should extract webhook state from original text properly even have no prefix', () => {
      const result = StringUtils.extractWebhookState('ENABLED');
      expect(result).toBe('ENABLED');
    });
  });
});
