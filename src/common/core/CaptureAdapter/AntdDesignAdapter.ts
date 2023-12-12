import AdapterInterface, {AdapterResolveItem} from "./AdapterInterface";

export default class AntdDesignAdapter implements AdapterInterface{
    adapterName = 'AntdDesign';

    checkbox(target: Element): AdapterResolveItem | undefined {
        return undefined;
    }

    input(target: Element): AdapterResolveItem | undefined {
        return undefined;
    }

    radio(target: Element): AdapterResolveItem | undefined {
        return undefined;
    }

    select(target: Element): AdapterResolveItem | undefined {
        return undefined;
    }

    switch(target: Element): AdapterResolveItem | undefined {
        return undefined;
    }





}