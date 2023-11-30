import AdapterInterface, {AdapterResolveItem} from "@/content/CaptureAdapter/AdapterInterface";

export default class AntdDesignAdapter implements AdapterInterface{
    adapterName = 'AntdDesign';

    checkbox(target: Element, basePath: string): AdapterResolveItem | undefined {
        return undefined;
    }

    input(target: Element, basePath: string): AdapterResolveItem | undefined {
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