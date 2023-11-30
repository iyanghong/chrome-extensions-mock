import AdapterInterface, {AdapterResolveItem} from "@/content/CaptureAdapter/AdapterInterface";

export default class NaiveUIAdapter implements AdapterInterface {
    adapterName = 'NaiveUI';

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

}