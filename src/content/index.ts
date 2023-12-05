import Handler from '@/common/core/handler';
import { createApp, Ref, ref } from 'vue';
import App from './App.vue';
import NaiveUi from '../plugins/NaiveUi';
import getUUID from '@/common/utils';
import { RuleEntity } from '@/common/entitys/PageEntity';
import request = chrome.permissions.request;
import MockValueInjectAdapter from '@/common/core/MockValueInjectAdapter';

(() => {
  const handler = new Handler('Content');
  handler.on('InjectRuleValues', request => {
    console.log('InjectRuleValues',request.data);
    const adapter = new MockValueInjectAdapter();
    adapter.inject(request.data);
  });
  handler.on('OpenPageRuleFrom', request => {
    console.log('request', request);
    let ruleData: RuleEntity = request.data;
    if (!ruleData.id) {
      ruleData = {
        name: '',
        order: 0,
        origin: location.origin,
        // @ts-ignore
        ruleItems: [],
        siteTitle: document.title,
        url: location.origin + location.pathname,
        id: getUUID()
      };
    }

    let containerId = `ChromeExtensionsMockContainer_${getUUID()}`;
    const container = document.createElement('div');
    container.setAttribute('id', containerId);
    document.body.append(container);
    const app = createApp(App);  // 演示如何向组件中传值

    app.config.globalProperties.$ruleData = ref<RuleEntity>(ruleData);
    app.config.globalProperties.$events = ref<({ remove: () => void } | undefined)[]>([]);

    app.config.globalProperties.$handler = handler;
    app.config.globalProperties.$containerId = containerId;
    app.config.globalProperties.$handleDestroy = () => {
      const events: Ref<({ remove: () => void } | undefined)[]> = app.config.globalProperties.$events || [];
      // 移除所有事件监听
      events.value.forEach((item) => {
        if (item) item.remove();
      });
      document.body.removeChild(container);
      console.log('the chrome extensions mock page rule from is destroyed!');
    };
    app.use(NaiveUi);
    app.mount(`#${containerId}`);

  });

})();


