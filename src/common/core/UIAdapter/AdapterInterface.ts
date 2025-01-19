import { RuleItemInjectEntity } from '@/common/entitys/PageEntity';

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
export interface MockInjectAdapterInterface{
  mockInjectInput: (rule: RuleItemInjectEntity) => void;
  mockInjectSelect: (rule: RuleItemInjectEntity) => void;
  mockInjectRadio: (rule: RuleItemInjectEntity) => void;
  mockInjectCheckbox: (rule: RuleItemInjectEntity) => void;
  mockInjectSwitch: (rule: RuleItemInjectEntity) => void;
}
export default interface AdapterInterface extends MockInjectAdapterInterface{
  adapterName: string;
  captureInput: (target: Element) => (AdapterResolveItem | undefined);
  captureSelect: (target: Element) => (AdapterResolveItem | undefined);
  captureRadio: (target: Element) => (AdapterResolveItem | undefined);
  captureCheckbox: (target: Element) => (AdapterResolveItem | undefined);
  captureSwitch: (target: Element) => (AdapterResolveItem | undefined);
}