import { Color } from '../../enum/color';
import { IOutputContext } from '../../interface/IOutputContext';
import { IIntent } from '../../interface/IIntent';
import MessageBuilder from '../../builder/MessageBuilder';

const rewire = require('rewire');
const messageRewire = rewire('../../../dist/builder/messageBuilder');
const getVerticeColor = messageRewire.__get__('getVerticeColor');

describe('MessageBuilder', () => {
  let intentIndex = new Map<string, number>();
  let intents: IIntent[] = [];
  let intentOutputContexts: IOutputContext[] = [];
  let messageBuilder: MessageBuilder;

  beforeAll(() => {
    intents = require('../mockData/builder/messageBuilder/getEdgeString/intent1.json');
    intentOutputContexts = require('../mockData/builder/messageBuilder/getEdgeString/output1.json');
    intentIndex = new Map<string, number>();
    intentIndex.set('intent1', 0);
    intentIndex.set('intent2', 1);
    messageBuilder = new MessageBuilder();
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

  describe('getEdgeContent', () => {
    test('should return edge content properly', () => {
      const result = messageBuilder.getEdgeContent({
        intentOutputContexts,
        intents,
        intentIndex
      });
      const expected = `{from:'1'
             ,color:{color:' #69b3a2'},
             to: 0,title: 'output1 </br><p style ="color:red">lifespanCount: <b> 3 </b></p>'},{from:'2'
             ,color:{color:' #69b3a2'},
             to: 1,title: 'output2 </br><p style ="color:red">lifespanCount: <b> 4 </b></p>'},`;

      expect(result).toEqual(expected);
    });
  });

  describe('getVerticesString', () => {
    test('should return vertices string properly with fully relations', async () => {
      const intentsVertices =
        require('../mockData/builder/messageBuilder/getVerticesString/intents.json');

      const response = messageBuilder.getVerticesContent({
        intentIndex,
        intents: intentsVertices,
        noOfVertices: 2
      });
      const intentStr = `{id: 0 , label: "intent1",
          font: {color: \'#FF0000\'},
          title: "Number of Payload is 1"},{id: 1 , label: "intent2",
          font: {color: \'#000000\'},
          title: "Training phrases are OK </br>Response Message is response </br>Number of Payload is 1"},`;
      const idvIntentStr = '';
      expect(response.intentStr).toEqual(intentStr);
      expect(response.idvIntentStr).toEqual(idvIntentStr);
    });

    test('should return vertices string properly with empty idvIntentStr', async () => {
      const intentsVertices =
        require('../mockData/builder/messageBuilder/getVerticesString/intents_empty_idvIntent.json');

      const response = messageBuilder.getVerticesContent({
        intentIndex,
        intents: intentsVertices,
        noOfVertices: 2
      });
      const intentStr = `{id: 1 , label: "intent1",
          font: {color: \'#FF0000\'},
          title: "Number of Payload is 1"},`;

      expect(response.intentStr).toEqual(intentStr);
      expect(response.idvIntentStr).toEqual('');
    });

    test('should return vertices string properly with partial intent', async () => {
      const intentsVertices =
        require('../mockData/builder/messageBuilder/getVerticesString/intents_partial.json');
      const response = messageBuilder.getVerticesContent({
        intentIndex,
        intents: intentsVertices,
        noOfVertices: 2
      });
      const intentStr = `{id: 0 , label: "intent1",
          font: {color: \'#FF0000\'},
          title: "Number of Payload is 1"},`;
      const idvIntentStr = `{id: 1 , label:" intent2",
          font: {color: '#000000'},
          title: "Training phrases are OK </br>Response Message is response </br>Number of Payload is 1"},`;
      expect(response.intentStr).toEqual(intentStr);
      expect(response.idvIntentStr).toEqual(idvIntentStr);
    });

    describe('getMessageText', () => {
      test('should return one message to training phrase', () => {
        const messages = [
          {
            platform: 'LINE',
            payload: { fields: [Object] },
            message: 'payload'
          },
          {
            platform: 'PLATFORM_UNSPECIFIED',
            text: {
              text: ['ขออภัยค่ะ ช่วยแจ้งเรื่องที่ลูกค้าต้องให้น้องบอทช่วยเหลืออีกครั้งนะคะ']
            },
            message: 'text'
          }];
        const messageText = messageBuilder.getMessageText(messages);
        expect(messageText.payloadResponse).toBe(1);
        expect(messageText.responseTxt)
          .toBe('ขออภัยค่ะ ช่วยแจ้งเรื่องที่ลูกค้าต้องให้น้องบอทช่วยเหลืออีกครั้งนะคะ');
      });

      test('should return correct number of payload response', () => {
        const messages = [
          {
            platform: 'LINE',
            payload: { fields: [Object] },
            message: 'payload'
          },
          {
            platform: 'LINE',
            payload: { fields: [Object] },
            message: 'payload'
          }];
        const messageText = messageBuilder.getMessageText(messages);
        expect(messageText.payloadResponse).toBe(2);
        expect(messageText.responseTxt).toBe(undefined);
      });

      test.each([[0.3, 'ขออภัยค่ะ ช่วยแจ้งเรื่องที่ลูกค้าต้องให้น้องบอทช่วยเหลืออีกครั้งนะคะ'],
      [0.7, 'น้องบอทขอแนะนำโปรโมชั่นร้านอาหารอร่อยๆตามนี้เลยค่ะ ไปดูกันเลย!']])(
        'should random second message and assign to result object depend on math.random',
        (a, expected) => {
          const ranD: number = Number(a);

          const messages = [
            {
              platform: 'LINE',
              payload: { fields: [Object] },
              message: 'payload'
            },
            {
              platform: 'PLATFORM_UNSPECIFIED',
              text: {
                text: ['ขออภัยค่ะ ช่วยแจ้งเรื่องที่ลูกค้าต้องให้น้องบอทช่วยเหลืออีกครั้งนะคะ',
                  'น้องบอทขอแนะนำโปรโมชั่นร้านอาหารอร่อยๆตามนี้เลยค่ะ ไปดูกันเลย!']
              },
              message: 'text'
            }];
          global.Math.random = () => ranD;
          const messageText = messageBuilder.getMessageText(messages);
          expect(messageText.payloadResponse).toBe(1);
          expect(messageText.responseTxt).toBe(expected);
        },
      );
    });
    describe('getTrainingPhrases', () => {
      test('should add one message to training phrase', () => {
        const training = [
          {
            parts: [{
              text: 'แนะนำติชมบริการ',
              entityType: '',
              alias: '',
              userDefined: false
            }],
            name: '18a840d1-5737-4b7b-8175-e8e4431da967',
            type: 'EXAMPLE',
            timesAddedCount: 0
          }];
        const phrase = messageBuilder.getTrainingPhrases(training);
        expect(phrase).toBe('แนะนำติชมบริการ');
      });

      test('should add two message to training phrase', () => {
        const training = [
          {
            parts: [{
              text: 'แนะนำติชมบริการ',
              entityType: '',
              alias: '',
              userDefined: false
            }],
            name: '18a840d1-5737-4b7b-8175-e8e4431da967',
            type: 'EXAMPLE',
            timesAddedCount: 0
          },
          {
            parts: [{
              text: 'แนะนำติชมบริการ',
              entityType: '',
              alias: '',
              userDefined: false
            }],
            name: '4be04610-a0d9-4612-8faf-bef58a0376fa',
            type: 'EXAMPLE',
            timesAddedCount: 0
          }];
        const phrase = messageBuilder.getTrainingPhrases(training);
        expect(phrase).toBe('แนะนำติชมบริการ,แนะนำติชมบริการ');
      });

      test('should add three message to training phrase', () => {
        const training = [
          {
            parts: [{
              text: 'แนะนำติชมบริการ',
              entityType: '',
              alias: '',
              userDefined: false
            }],
            name: '18a840d1-5737-4b7b-8175-e8e4431da967',
            type: 'EXAMPLE',
            timesAddedCount: 0
          },
          {
            parts: [{
              text: 'บริการ',
              entityType: '',
              alias: '',
              userDefined: false
            }],
            name: '4be04610-a0d9-4612-8faf-bef58a0376fa',
            type: 'EXAMPLE',
            timesAddedCount: 0
          },
          {
            parts: [{
              text: 'สอบถามข้อมูล',
              entityType: '',
              alias: '',
              userDefined: false
            }],
            name: '4be04610-a0d9-4612-8faf-bef58a0376fa',
            type: 'EXAMPLE',
            timesAddedCount: 0
          }];
        const phrase = messageBuilder.getTrainingPhrases(training);
        expect(phrase).toBe('แนะนำติชมบริการ,บริการ,สอบถามข้อมูล');
      });

      test('should not add traing phrase more than three phrases', () => {
        const training = [
          {
            parts: [{
              text: 'แนะนำติชมบริการ',
              entityType: '',
              alias: '',
              userDefined: false
            }],
            name: '18a840d1-5737-4b7b-8175-e8e4431da967',
            type: 'EXAMPLE',
            timesAddedCount: 0
          },
          {
            parts: [{
              text: 'แนะนำติชมบริการ',
              entityType: '',
              alias: '',
              userDefined: false
            }],
            name: '4be04610-a0d9-4612-8faf-bef58a0376fa',
            type: 'EXAMPLE',
            timesAddedCount: 0
          },
          {
            parts: [{
              text: 'สอบถามข้อมูล',
              entityType: '',
              alias: '',
              userDefined: false
            }],
            name: '4be04610-a0d9-4612-8faf-bef58a0376fa',
            type: 'EXAMPLE',
            timesAddedCount: 0
          },
          {
            parts: [{
              text: 'เพิ่มเติม',
              entityType: '',
              alias: '',
              userDefined: false
            }],
            name: '4be04610-a0d9-4612-8faf-bef58a0376fa',
            type: 'EXAMPLE',
            timesAddedCount: 0
          }];
        const phrase = messageBuilder.getTrainingPhrases(training);
        expect(phrase).toBe('แนะนำติชมบริการ,แนะนำติชมบริการ,สอบถามข้อมูล');
      });
    });

  });
});
