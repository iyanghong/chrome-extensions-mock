import AdapterInterface, {AdapterResolveItem} from "@/content/CaptureAdapter/AdapterInterface";

export default class MiniUIAdapter implements AdapterInterface {
    adapterName = 'MiniUI';

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