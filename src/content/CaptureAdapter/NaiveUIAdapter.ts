import AdapterInterface, {AdapterResolveItem} from "@/content/CaptureAdapter/AdapterInterface";

export default class NaiveUIAdapter implements AdapterInterface {
    adapterName = 'NaiveUI';

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