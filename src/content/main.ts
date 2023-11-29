/* eslint-disable */
// 使用原生JS创建了一个锚点，将vue组件渲染到这个锚点上
import {createApp} from 'vue'
import App from './App.vue'

window.onload = function () {
    createExample()
}

function createExample() {
    const app = createApp(App)  // 演示如何向组件中传值
    app.mount('#chrome-extension-mock-2.0');
}

chrome.runtime.onMessage.addListener(function (request) {
    if (request.target === 'CONTENT' && request.from === 'BACKGROUND') {

    }
});
