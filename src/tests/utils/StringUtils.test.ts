import StringUtils = require('../../utils/StringUtils');

describe('StringUtils', function() {
  describe('extractIntentName', function() {
    it('should extract intent name from original text properly', function() {
      let result = StringUtils.extractIntentName('directory/test');   
      expect(result).toBe('test');   
    })

    it('should extract intent name from original text properly even have no prefix', function() {
      let result = StringUtils.extractIntentName('test');   
      expect(result).toBe('test');   
    })
  })

  describe('extractWebhookState', function() {
    it('should extract webhook state from original text properly', function() {
      let result = StringUtils.extractWebhookState('WEBHOOK_STATE_ENABLED');   
      expect(result).toBe("ENABLED");   
    })

    it('should extract webhook state from original text properly even have no prefix', function() {
      let result = StringUtils.extractWebhookState('ENABLED');   
      expect(result).toBe("ENABLED");   
    })
  })
});