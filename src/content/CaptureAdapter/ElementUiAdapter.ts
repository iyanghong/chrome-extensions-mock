import AdapterInterface, {AdapterResolveItem} from "@/content/CaptureAdapter/AdapterInterface";

export default class ElementUiAdapter implements AdapterInterface {
    adapterName = "ElementUI"

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