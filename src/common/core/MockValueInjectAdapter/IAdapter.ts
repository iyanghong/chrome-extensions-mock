import { AdapterResolveItem } from '@/common/core/CaptureAdapter/AdapterInterface';
import { RuleItemInjectEntity } from '@/common/entitys/PageEntity';

export interface IAdapter {
  adapterName: string;
  input: (rule: RuleItemInjectEntity) => void;
  select: (rule: RuleItemInjectEntity) => void;
  radio: (rule: RuleItemInjectEntity) => void;
  checkbox: (rule: RuleItemInjectEntity) => void;
  switch: (rule: RuleItemInjectEntity) => void;
}