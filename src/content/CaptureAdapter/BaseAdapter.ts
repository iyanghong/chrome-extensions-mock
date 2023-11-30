import AdapterInterface, {AdapterResolveItem} from './AdapterInterface';

export default class BaseAdapter implements AdapterInterface{
    adapterName = "Base"

    checkbox(target:Element, basePath: string): AdapterResolveItem | undefined {
        return undefined;
    }

    input(target:Element, basePath: string): AdapterResolveItem | undefined {
        return undefined;
    }

    radio(target: Element, basePath: string): AdapterResolveItem | undefined {
        return undefined;
    }

    select(target: Element, basePath: string): AdapterResolveItem | undefined {
        return undefined;
    }

    switch(target: Element, basePath: string): AdapterResolveItem | undefined {
        return undefined;
    }




}