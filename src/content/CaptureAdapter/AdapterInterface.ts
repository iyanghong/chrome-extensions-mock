export interface AdapterResolveItem {
  // 元素的标签名
  tagName: string;
  // 当前表单项名字
  name: string;
  // 元素真实地址
  realPath: string;
  // 使用的适配器
  adapter: string;
  // 表单类型
  type: string;
  // mock的名字
  mockName: string;
  // mock的唯一标识
  mockKey: string;
}

export default interface AdapterInterface {
  adapterName: string;
  input: (target: Element, basePath: string) => (AdapterResolveItem | undefined);
  select: (target: Element, basePath: string) => (AdapterResolveItem | undefined);
  radio: (target: Element, basePath: string) => (AdapterResolveItem | undefined);
  checkbox: (target: Element, basePath: string) => (AdapterResolveItem | undefined);
}