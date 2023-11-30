import Handler from "@/common/core/handler";
import { createApp, Ref, ref } from 'vue';
import App from './App.vue'
import NaiveUi from '../plugins/NaiveUi';
import { EventListenerType } from '@/common/utils/DomUtils';

(() => {
    const handler = new Handler('Content')

    handler.on('OpenPageRuleFrom', request => {
        let containerId = `ChromeExtensionsMockContainer-${new Date().getTime()}`
        const container = document.createElement('div');
        container.setAttribute('id', containerId)
        document.body.append(container)
        const app = createApp(App)  // 演示如何向组件中传值
        app.config.globalProperties.$events = ref<({remove:() => void} | undefined)[]>([])
        app.config.globalProperties.$sendMessage = handler.sendMessage
        app.config.globalProperties.$containerId = containerId
        app.config.globalProperties.$handleDestroy = () => {
            const events:Ref<({remove:() => void} | undefined)[]> = app.config.globalProperties.$events || []
            // 移除所有事件监听
            events.value.forEach((item) => {
                if (item) item.remove()
            })
            document.body.removeChild(container)
            console.log('the chrome extensions mock page rule from is destroyed!');
        }
        app.use(NaiveUi)
        app.mount(`#${containerId}`);

    })

})()


