import {MessageRequestEntity, MessageRequestSourceType} from '@/common/entitys/MessageType';

/**
 * BackgroundHandler 是一个类型，表示可以在后台使用的不同类型的处理程序。
 */
export type BackgroundHandler =
    'EmitContentOpenPageRuleForm'  // 规则表单打开页面的内容发射
    | 'SavePageRule'  // 保存页面规则
    | 'GetOriginRules'  // 获取原始规则
    | 'GetPageRules'  // 获取页面规则
    | 'GetPageRule'  // 获取单个页面规则
    | 'GetAllPageRule'  // 获取所有页面规则
    | 'DeleteRule'  // 删除规则
    | 'getAllMockEntity'  // 获取所有模拟实体
    | 'getAllMock'  // 获取所有模拟
    | 'getMockValue'  // 获取模拟值
    | 'getAllMockMenu'  // 获取所有模拟菜单
    | 'getTreeMockMenuData'  // 获取树形模拟菜单数据
    | 'saveMockMenu'  // 保存模拟菜单
    | 'removeMockMenu'  // 移除模拟菜单
    | 'getMockMenu'  // 获取模拟菜单
    | 'getInjectRuleValues'  // 获取注入规则值

/**
 * IHandler 是一个接口，定义了处理程序的结构。
 * 它包括监听消息和发送消息的方法。
 */
export interface IHandler {
  on: (key: string, callback: (response: MessageRequestEntity) => void) => void;  // 监听消息
  sendMessage: (message: MessageRequestEntity) => Promise<any>;  // 发送消息
  sendBackgroundMessage: (handler: BackgroundHandler, data: any) => Promise<any>;  // 发送后台消息
}

/**
 * Handler 是一个类，实现了 IHandler 接口。
 * 它提供了监听消息和发送消息的方法。
 */
export default class Handler implements IHandler {
  source: MessageRequestSourceType;  // 消息来源

  /**
   * Handler 类的构造函数。
   * @param {MessageRequestSourceType} source - 消息的来源。
   */
  constructor(source: MessageRequestSourceType) {
    this.source = source;
  }

  /**
   * 监听消息的方法。
   * @param {string} key - 要监听的消息的键。
   * @param {(response: MessageRequestEntity) => void} callback - 接收到消息时执行的回调。
   */
  on(key: string, callback: (response: MessageRequestEntity) => void) {
    chrome.runtime.onMessage.addListener((request: MessageRequestEntity) => {
      if (request.target == this.source && request.handler == key) {
        callback(request);
      }
    });
  }

  /**
   * 发送消息的方法。
   * @param {MessageRequestEntity} message - 要发送的消息。
   * @returns {Promise<any>} - 一个解析为消息响应的 Promise。
   */
  sendMessage(message: MessageRequestEntity): Promise<any> {
    message.source = this.source;
    return chrome.runtime.sendMessage(message);
  }

  /**
   * 发送后台消息的方法。
   * @param {BackgroundHandler} handler - 消息的处理程序。
   * @param {any} data - 要与消息一起发送的数据。
   * @returns {Promise<any>} - 一个解析为消息响应的 Promise。
   */
  sendBackgroundMessage(handler: BackgroundHandler, data: any = null): Promise<any> {
    let message: MessageRequestEntity = {
      source: this.source,
      target: 'Background',
      handler,
      data
    };
    return this.sendMessage(message);
  }
}
