const service = require('../../service/dialogflowService');
jest.mock('dialogflow', () => {
  return {
    IntentsClient: jest.fn(() => {
      return {
        projectAgentPath: jest.fn(() => 'projectAgentPath'),
        listIntents: jest.fn(() => Promise.resolve('intents'))
      };
    })
  };
}, { virtual: true });

describe('dialogflowService', () => {
  describe('getIntents', () => {
    it('should return intent properly', async () => {
      const result = await service.getIntents('proj-id');
      expect(result).toEqual('intents');
    });
  });
});
