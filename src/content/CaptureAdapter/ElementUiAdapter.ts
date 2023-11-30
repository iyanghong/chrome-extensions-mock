import AdapterInterface, {AdapterResolveItem} from "@/content/CaptureAdapter/AdapterInterface";

export default class ElementUiAdapter implements AdapterInterface {
    adapterName = "ElementUI"

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