import Handler from "@/common/core/handler";
import {createApp} from 'vue'
import App from './App.vue'
import NaiveUi from '../plugins/NaiveUi';

(() => {
    const handler = new Handler('Content')

    handler.on('OpenPageRuleFrom', request => {
        let containerId = `ChromeExtensionsMockContainer-${new Date().getTime()}`
        const container = document.createElement('div');
        container.setAttribute('id', containerId)
        document.body.append(container)
        const app = createApp(App)  // 演示如何向组件中传值
        app.config.globalProperties.$sendMessage = handler.sendMessage
        app.config.globalProperties.$containerId = containerId
        app.config.globalProperties.$handleDestroy = () => {
            document.body.removeChild(container)
        }
        app.use(NaiveUi)
        app.mount(`#${containerId}`);

    })

})()


