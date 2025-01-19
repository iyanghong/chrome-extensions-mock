import AdapterInterface, { AdapterResolveItem } from '@/common/core/UIAdapter/AdapterInterface';
import BaseMockInjectAdapter from '@/common/core/UIAdapter/BaseMockInjectAdapter';


export default class AntdDesignAdapter extends BaseMockInjectAdapter implements AdapterInterface{
  adapterName = 'AntdDesign';

  captureCheckbox(target: Element): AdapterResolveItem | undefined {
    return undefined;
  }

  captureInput(target: Element): AdapterResolveItem | undefined {
    return undefined;
  }

  captureRadio(target: Element): AdapterResolveItem | undefined {
    return undefined;
  }

  captureSelect(target: Element): AdapterResolveItem | undefined {
    return undefined;
  }

  captureSwitch(target: Element): AdapterResolveItem | undefined {
    return undefined;
  }
}