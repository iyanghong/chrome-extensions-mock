import Handler from '@/common/core/handler';
import {createApp, Ref, ref} from 'vue';
import App from './App.vue';
import NaiveUi from '../plugins/NaiveUi';
import getUUID from '@/common/utils';
import {RuleEntity, RuleItemEntity, RuleItemInjectEntity} from '@/common/entitys/PageEntity';
import MockValueInjectAdapter from '@/common/core/MockValueInjectAdapter';

(() => {

  window["PageRuleForm"] = function () {
    console.log("PageRuleForm")
  }
  window["InjectRuleValues"] = async function (itemsJson: string | RuleItemEntity[]) {
    let ruleItems: RuleItemEntity[] = typeof itemsJson === 'string' ? JSON.parse(itemsJson) : itemsJson
    const handler = new Handler('Content');
    let data: RuleItemInjectEntity[] = await handler.sendBackgroundMessage('getInjectRuleValues', ruleItems)
    const adapter = new MockValueInjectAdapter();
    adapter.inject(data);
  }
  window["CreatePageRuleForm"] = async function (ruleData: RuleEntity) {
    const handler = new Handler('Content');
    if (!ruleData.id) {
      ruleData = {
        name: '',
        order: 0,
        origin: location.origin,
        ruleItems: [],
        siteTitle: document.title,
        url: location.origin + location.pathname,
        id: getUUID()
      };
    } else {
      ruleData = await handler.sendBackgroundMessage('getPageRule', ruleData.id)
    }

    let containerId = `ChromeExtensionsMockContainer_${getUUID()}`;
    const container = document.createElement('div');
    container.setAttribute('id', containerId);
    document.body.append(container);
    const app = createApp(App);

    app.config.globalProperties.$ruleData = ref<RuleEntity>(ruleData);
    app.config.globalProperties.$events = ref<({ remove: () => void } | undefined)[]>([]);
    app.config.globalProperties.$handler = handler;
    app.config.globalProperties.$containerId = containerId;
    app.config.globalProperties.$handleDestroy = () => {
      const events: Ref<({ remove: () => void } | undefined)[]> = app.config.globalProperties.$events || [];
      events.value.forEach((item) => {
        if (item) item.remove();
      });
      document.body.removeChild(container);
    };
    app.use(NaiveUi);
    app.mount(`#${containerId}`);

  }
})();
/*

(() => {
  const handler = new Handler('Content');
  const adapter = new MockValueInjectAdapter();

  handler.on('InjectRuleValues', request => {
    adapter.inject(request.data);
  });

  handler.on('OpenPageRuleFrom', request => {
    let ruleData: RuleEntity = request.data;
    if (!ruleData.id) {
      ruleData = {
        name: '',
        order: 0,
        origin: location.origin,
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
    const app = createApp(App);

    app.config.globalProperties.$ruleData = ref<RuleEntity>(ruleData);
    app.config.globalProperties.$events = ref<({ remove: () => void } | undefined)[]>([]);
    app.config.globalProperties.$handler = handler;
    app.config.globalProperties.$containerId = containerId;
    app.config.globalProperties.$handleDestroy = () => {
      const events: Ref<({ remove: () => void } | undefined)[]> = app.config.globalProperties.$events || [];
      events.value.forEach((item) => {
        if (item) item.remove();
      });
      document.body.removeChild(container);
    };
    app.use(NaiveUi);
    app.mount(`#${containerId}`);
  });
})();*/
