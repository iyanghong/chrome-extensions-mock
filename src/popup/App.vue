<template>
  <n-el class='popup-container'>
    <n-el>当前页面：<n-text>{{ currentTab.title }}</n-text></n-el>
    <n-space justify="center" class="action-panel">
      <n-button type="primary" size="small">管理</n-button>
      <n-button type="primary" size="small" @click="handleCreate()">创建</n-button>
    </n-space>
    <n-tabs v-model:value='activeTab' justify-content="space-evenly">
      <n-tab-pane tab='全部' name='All'>
        <Rule v-for="item in originRules" :key="item.id" :data="item"></Rule>
      </n-tab-pane>
      <n-tab-pane tab='当前页' name='Current'>
        <Rule v-for="item in urlRules" :key="item.id" :data="item"></Rule>
      </n-tab-pane>
    </n-tabs>
  </n-el>


</template>
<script setup lang='ts'>

import {useCurrentTab} from '@/common/utils/ChromeUtil';
import {computed, onMounted, ref} from 'vue';
import {NTabPane, NTabs} from 'naive-ui'
import Handler from "@/common/core/handler";
import Rule from './Rule.vue'
import {RuleEntity} from "@/common/entitys/PageEntity";

const handler = new Handler('Popup')
const currentTab = ref<chrome.tabs.Tab>({} as chrome.tabs.Tab);
const activeTab = ref<'All' | 'Current'>('All');

const origin = ref<string>('')
const url = ref<string>('')

const originRules = ref<RuleEntity[]>([]);


const urlRules = computed(() => {
  return originRules.value.filter(rule => rule.url == url.value)
})

onMounted(async () => {
  currentTab.value = await useCurrentTab();
  url.value = currentTab.value.url || ''
  let pathArray = url.value.split('/');
  if (pathArray[2]) {
    let protocol = pathArray[0];
    let host = pathArray[2];
    origin.value = protocol + '//' + host;
  }
  handler.sendMessage({
    source:'Popup',
    target:'Background',
    data:origin.value,
    handler:'GetOriginRules'
  }).then(response => {
    originRules.value = response
  })

});



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
