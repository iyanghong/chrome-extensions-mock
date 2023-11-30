import AdapterInterface, {AdapterResolveItem} from './AdapterInterface';

export default class BaseAdapter implements AdapterInterface{
    adapterName = "Base"

    checkbox(target: EventTarget | Element | Document, basePath: string): AdapterResolveItem | undefined {
        return undefined;
    }

    input(target: EventTarget | Element | Document, basePath: string): AdapterResolveItem | undefined {
        return undefined;
    }

    radio(target: EventTarget | Element | Document, basePath: string): AdapterResolveItem | undefined {
        return undefined;
    }

    select(target: EventTarget | Element | Document, basePath: string): AdapterResolveItem | undefined {
        return undefined;
    }




}