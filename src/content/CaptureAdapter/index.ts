import AdapterInterface, {AdapterResolveItem} from "@/content/CaptureAdapter/AdapterInterface";
import BaseAdapter from "@/content/CaptureAdapter/BaseAdapter";
import ElementUiAdapter from "@/content/CaptureAdapter/ElementUiAdapter";
import AntdDesignAdapter from "@/content/CaptureAdapter/AntdDesignAdapter";
import NaiveUIAdapter from "@/content/CaptureAdapter/NaiveUIAdapter";
import MiniUIAdapter from "@/content/CaptureAdapter/MiniUIAdapter";

class CaptureAdapter {
    adapterList: AdapterInterface[] = []

    constructor() {
        this.registerAdapter(new ElementUiAdapter())
        this.registerAdapter(new AntdDesignAdapter())
        this.registerAdapter(new NaiveUIAdapter())
        this.registerAdapter(new MiniUIAdapter())
        this.registerAdapter(new BaseAdapter())
    }

    registerAdapter(adapter: AdapterInterface) {
        let check = this.adapterList.filter(it => it.adapterName == adapter.adapterName)[0]
        if (check) return false
        this.adapterList.push(adapter)
    }

    resolve(): AdapterResolveItem | undefined {
        return undefined
    }
}