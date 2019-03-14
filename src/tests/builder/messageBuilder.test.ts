import { Color } from '../../enum/color';

const message = require('../../builder/messageBuilder');
const rewire = require('rewire');
const messageRewire = rewire('../../../dist/builder/messageBuilder');

const addEscapeString = messageRewire.__get__('addEscapeString');
const getVerticeColor = messageRewire.__get__('getVerticeColor');

describe('MessageBuilder', () => {
  describe('addEscapeString', () => {
    it('Add addEscapeString properly', () => {
      expect(addEscapeString('"name"\n address')).toEqual('\\"name\\"\\n address');
    });
  });

  describe('getVerticeColor', () => {
    it('return Color.RED if state is ENABLED and isFallback is true', () => {
      expect(getVerticeColor('TEST_ENABLED', true)).toEqual(Color.RED);
    });
    it('return Color.GREEN if state is ENABLED and isFallback is false', () => {
      expect(getVerticeColor('TEST_ENABLED', false)).toEqual(Color.GREEN);
    });
    it('return Color.BLUE if state is UNSPECIFIED and isFallback is true', () => {
      expect(getVerticeColor('TEST_UNSPECIFIED', true)).toEqual(Color.BLUE);
    });
    it('return Color.BLACK if state is UNSPECIFIED and isFallback is false', () => {
      expect(getVerticeColor('TEST_UNSPECIFIED', false)).toEqual(Color.BLACK);
    });
  });

  describe('buildVerticesTooltip', () => {
    it('Add addEscapeString properly', () => {
      expect(addEscapeString('"name"\n address')).toEqual('\\"name\\"\\n address');
    });

    it('Add addEscapeString properly when input is empty', () => {
      expect(addEscapeString('')).toEqual('');
    });
  });

  describe('getEdgeString', () => {
    it('should return edge string properly', async () => {
      const intentJson = require('../mockData/builder/messageBuilder/getEdgeString/intent1.json');
      const outputJson = require('../mockData/builder/messageBuilder/getEdgeString/output1.json');
      const intent = intentJson;
      const output = outputJson;
      const intentIndex = new Map<string, number>();
      intentIndex.set('intent1', 3);
      intentIndex.set('intent2', 4);
      const edgeString = `{from:'1'
          ,color:{color:\' #69b3a2\'},
          to: 3,
          title: 'output1 </br> <p style =\"color:red\">lifespanCount: <b> 3 </b></p>'},{from:'1'
          ,color:{color:\' #0000ff\'},
          to: 4,
          title: 'output1 </br> <p style =\"color:red\">lifespanCount: <b> 3 </b></p>'},`;

      const response = await message.getEdgeString(output, intent, intentIndex);
      expect(response).toEqual(edgeString);
    });
  });

  describe('getVerticesString', () => {
    it('should return vertices string properly with fully relations', async () => {
      const intentDictJson = require('../mockData/builder/messageBuilder/getVerticesString/intentDict.json');

      const intentIndex = new Map<string, number>();
      intentIndex.set('intent1', 1);
      intentIndex.set('intent2', 2);
      const intentDict = intentDictJson;
      const response = await message.getVerticesString(intentIndex, intentDict, 2);
      const intentStr = '{id: 1 , label: "intent1",\n        font: {color: \'#FF0000\'},\n        title: "Number of Payload is 1"},{id: 2 , label: "intent2",\n        font: {color: \'#000000\'},\n        title: "Training phrases are โอเค,สนใจจ้า,ถูกต้องแล้ว </br>Response Message is ได้เลยค่ะ น้องบอทขอเสนอเป็น สินเชื่อปรับได้ตามใจคุณ ค่ะ </br>Number of Payload is 1"},';
      const idvIntentStr = '';
      expect(response.intentStr).toEqual(intentStr);
      expect(response.idvIntentStr).toEqual(idvIntentStr);
    });

    it('should return vertices string properly with empty idvIntentStr', async () => {
      const intentDictJson = require('../mockData/builder/messageBuilder/getVerticesString/intentDict_empty_idvIntent.json');

      const intentIndex = new Map<string, number>();
      intentIndex.set('intent1', 1);
      intentIndex.set('intent2', 10);
      const intentDict = intentDictJson;
      const response = await message.getVerticesString(intentIndex, intentDict, 2);
      const intentStr = '{id: 1 , label: "intent1",\n        font: {color: \'#FF0000\'},\n        title: "Number of Payload is 1"},';

      expect(response.intentStr).toEqual(intentStr);
      expect(response.idvIntentStr).toEqual('');
    });

    it('should return vertices string properly with partial intent', async () => {
      const intentDictJson = require('../mockData/builder/messageBuilder/getVerticesString/intentDict_partial.json');

      const intentIndex = new Map<string, number>();
      intentIndex.set('intent1', 1);
      intentIndex.set('intent2', 2);
      const intentDict = intentDictJson;
      const response = await message.getVerticesString(intentIndex, intentDict, 2);
      const intentStr = '{id: 1 , label: "intent1",\n        font: {color: \'#FF0000\'},\n        title: "Number of Payload is 1"},';
      const idvIntentStr = `{id: 2 , label:" intent2",\n        font: {color: '#000000'},\n        title: "Training phrases are โอเค,สนใจจ้า,ถูกต้องแล้ว </br>Response Message is ได้เลยค่ะ น้องบอทขอเสนอเป็น สินเชื่อปรับได้ตามใจคุณ </br>Number of Payload is 1"},`;
      expect(response.intentStr).toEqual(intentStr);
      expect(response.idvIntentStr).toEqual(idvIntentStr);
    });
  });

  describe('getMessageText', () => {
    it('should return one message to training phrase', () => {
      const messages = [
        { platform: 'LINE',
          payload: { fields: [Object] },
          message: 'payload' },
        { platform: 'PLATFORM_UNSPECIFIED',
          text: { text: ['ขออภัยค่ะ ช่วยแจ้งเรื่องที่ลูกค้าต้องให้น้องบอทช่วยเหลืออีกครั้งนะคะ'] },
          message: 'text' }];
      const messageText = message.getMessageText(messages);
      expect(messageText.payloadResponse).toBe(1);
      expect(messageText.responseTxt).toBe('ขออภัยค่ะ ช่วยแจ้งเรื่องที่ลูกค้าต้องให้น้องบอทช่วยเหลืออีกครั้งนะคะ');
    });

    it('should return correct number of payload response', () => {
      const messages = [
        { platform: 'LINE',
          payload: { fields: [Object] },
          message: 'payload' },
        { platform: 'LINE',
          payload: { fields: [Object] },
          message: 'payload' }];
      const messageText = message.getMessageText(messages);
      expect(messageText.payloadResponse).toBe(2);
      expect(messageText.responseTxt).toBe('');
    });

    test.each([[ 0.3, 'ขออภัยค่ะ ช่วยแจ้งเรื่องที่ลูกค้าต้องให้น้องบอทช่วยเหลืออีกครั้งนะคะ'],
              [0.7, 'น้องบอทขอแนะนำโปรโมชั่นร้านอาหารอร่อยๆตามนี้เลยค่ะ ไปดูกันเลย!']])(
      'should random second message and assign to result object depend on math.random',
      (a, expected) => {
        const ranD: number = Number(a);

        const messages = [
          { platform: 'LINE',
            payload: { fields: [Object] },
            message: 'payload' },
          { platform: 'PLATFORM_UNSPECIFIED',
            text: { text: ['ขออภัยค่ะ ช่วยแจ้งเรื่องที่ลูกค้าต้องให้น้องบอทช่วยเหลืออีกครั้งนะคะ',
              'น้องบอทขอแนะนำโปรโมชั่นร้านอาหารอร่อยๆตามนี้เลยค่ะ ไปดูกันเลย!']},
            message: 'text' }];
        global.Math.random = () => ranD;
        const messageText = message.getMessageText(messages);
        expect(messageText.payloadResponse).toBe(1);
        expect(messageText.responseTxt).toBe(expected);
      },
    );
  });

  describe('getTrainingPhrases', () => {
    it('should add one message to training phrase', () => {
      const training = [
        { parts: [{ text: 'แนะนำติชมบริการ',
          entityType: '',
          alias: '',
          userDefined: false }],
          name: '18a840d1-5737-4b7b-8175-e8e4431da967',
          type: 'EXAMPLE',
          timesAddedCount: 0 }];
      const phrase = message.getTrainingPhrases(training);
      expect(phrase).toBe('แนะนำติชมบริการ');
    });

    it('should add two message to training phrase', () => {
      const training = [
        { parts: [{ text: 'แนะนำติชมบริการ',
          entityType: '',
          alias: '',
          userDefined: false }],
          name: '18a840d1-5737-4b7b-8175-e8e4431da967',
          type: 'EXAMPLE',
          timesAddedCount: 0 },
        { parts: [{ text: 'แนะนำติชมบริการ',
          entityType: '',
          alias: '',
          userDefined: false }],
          name: '4be04610-a0d9-4612-8faf-bef58a0376fa',
          type: 'EXAMPLE',
          timesAddedCount: 0 }];
      const phrase = message.getTrainingPhrases(training);
      expect(phrase).toBe('แนะนำติชมบริการ,แนะนำติชมบริการ');
    });

    it('should add three message to training phrase', () => {
      const training = [
        { parts: [{ text: 'แนะนำติชมบริการ',
          entityType: '',
          alias: '',
          userDefined: false }],
          name: '18a840d1-5737-4b7b-8175-e8e4431da967',
          type: 'EXAMPLE',
          timesAddedCount: 0 },
        { parts: [{ text: 'แนะนำติชมบริการ',
          entityType: '',
          alias: '',
          userDefined: false }],
          name: '4be04610-a0d9-4612-8faf-bef58a0376fa',
          type: 'EXAMPLE',
          timesAddedCount: 0 },
        { parts: [{ text: 'สอบถามข้อมูล',
          entityType: '',
          alias: '',
          userDefined: false }],
          name: '4be04610-a0d9-4612-8faf-bef58a0376fa',
          type: 'EXAMPLE',
          timesAddedCount: 0 }];
      const phrase = message.getTrainingPhrases(training);
      expect(phrase).toBe('แนะนำติชมบริการ,แนะนำติชมบริการ,สอบถามข้อมูล');
    });

    it('should not add traing phrase more than three phrases', () => {
      const training = [
        { parts: [{ text: 'แนะนำติชมบริการ',
          entityType: '',
          alias: '',
          userDefined: false }],
          name: '18a840d1-5737-4b7b-8175-e8e4431da967',
          type: 'EXAMPLE',
          timesAddedCount: 0 },
        { parts: [{ text: 'แนะนำติชมบริการ',
          entityType: '',
          alias: '',
          userDefined: false }],
          name: '4be04610-a0d9-4612-8faf-bef58a0376fa',
          type: 'EXAMPLE',
          timesAddedCount: 0 },
        { parts: [{ text: 'สอบถามข้อมูล',
          entityType: '',
          alias: '',
          userDefined: false }],
          name: '4be04610-a0d9-4612-8faf-bef58a0376fa',
          type: 'EXAMPLE',
          timesAddedCount: 0 },
        { parts: [{ text: 'เพิ่มเติม',
          entityType: '',
          alias: '',
          userDefined: false }],
          name: '4be04610-a0d9-4612-8faf-bef58a0376fa',
          type: 'EXAMPLE',
          timesAddedCount: 0 }];
      const phrase = message.getTrainingPhrases(training);
      expect(phrase).toBe('แนะนำติชมบริการ,แนะนำติชมบริการ,สอบถามข้อมูล');
    });
  });
});
