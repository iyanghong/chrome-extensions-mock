<template>
  <n-el class='popup-container'>
    <n-el>当前页面：<n-text>{{ currentTab.title }}</n-text></n-el>
    <n-space justify="center" class="action-panel">
      <n-button type="primary" size="small">管理</n-button>
      <n-button type="primary" size="small" @click="handleCreate()">创建</n-button>
    </n-space>
    <n-tabs v-model:value='activeTab' justify-content="space-evenly">
      <n-tab-pane tab='全部' name='All'>

      </n-tab-pane>
      <n-tab-pane tab='当前页' name='Current'>
        
      </n-tab-pane>
    </n-tabs>
  </n-el>


</template>
<script setup lang='ts'>

import {useCurrentTab} from '@/common/utils/ChromeUtil';
import {onMounted, ref} from 'vue';
import {NTabPane, NTabs} from 'naive-ui'
import Handler from "@/common/core/handler";

const currentTab = ref<chrome.tabs.Tab>({} as chrome.tabs.Tab);
const activeTab = ref<'All' | 'Current'>('All');
const ruleList = ref([]);

const handler = new Handler('Popup')

onMounted(async () => {
  currentTab.value = await useCurrentTab();
});

function execFunc(id: string = '') {
  // let src = chrome.runtime.getURL('static/js/content.min.js')
  let src = chrome.runtime.getURL('content/index.js')
  const container = document.createElement('div');
  container.setAttribute('id', '_ChromeExtensionsMockContainer')
  const sc = document.createElement('script');
  sc.setAttribute('type', 'text/javascript');
  sc.src = src
  container.append(sc)
  document.body.append(container)
}


async function handleCreate(id: string = '') {
  if (!currentTab.value || currentTab.value.id === undefined) return
  await handler.sendMessage({
    source: 'Popup',
    target: 'Background',
    handler: 'EmitContentOpenPageRuleForm',
    data: {
      id,
      tabId: currentTab.value.id
    }
  })
}

</script>


<style scoped>
* {
  padding: 0 !important;
  margin: 0 !important;
}

.popup-container {
  width: 200px;
  height: 300px;
}

:deep( .action-panel .n-button .n-button__content) {
  padding: 0 10px;
}
</style>
