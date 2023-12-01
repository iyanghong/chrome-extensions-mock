import { MessageRequestEntity, MessageRequestSourceType } from '@/common/entitys/MessageType';

export type BackgroundHandler =
  'EmitContentOpenPageRuleForm'
  | 'SavePageRule'
  | 'GetOriginRules'
  | 'GetPageRules'
  | 'GetPageRule'
  | 'GetAllPageRule'
  | 'DeleteRule'

  | 'getAllMockEntity'
  | 'getAllMock'

export interface IHandler {
  on: (key: string, callback: (response: MessageRequestEntity) => void) => void;
  sendMessage: (message: MessageRequestEntity) => Promise<any>;
}

export default class Handler implements IHandler {
  source: MessageRequestSourceType;

  constructor(source: MessageRequestSourceType) {
    this.source = source;
  }

  on(key: string, callback: (response: MessageRequestEntity) => void) {
    chrome.runtime.onMessage.addListener((request: MessageRequestEntity) => {
      if (request.target == this.source && request.handler == key) {
        callback(request);
      }
    });
  }

  sendMessage(message: MessageRequestEntity) {
    message.source = this.source;
    return chrome.runtime.sendMessage(message);
  }

  sendBackgroundMessage(handler: BackgroundHandler, data: any = null) {
    let message: MessageRequestEntity = {
      source: this.source,
      target: 'Background',
      handler,
      data
    };
    return this.sendMessage(message);
  }
}