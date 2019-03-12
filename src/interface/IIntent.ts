export interface IIntent {
  inputContextNames: string;
  outputContexts: string;
  intentName: string;
  trainingPhrase: string;
  id: number;
  payloadCount: number;
  responseMsg: string;
  webhookState: string;
  isFallback: boolean;
}
