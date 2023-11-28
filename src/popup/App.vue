<template>
  <n-el class='popup-container'>
    <n-el>当前页面：<n-text>{{ currentTab.title }}</n-text></n-el>
    <n-tabs v-model:value='activeTab' justify-content="space-evenly">
      <n-tab-pane tab='全部' name='All'>

      </n-tab-pane>
      <n-tab-pane tab='当前页' name='Current'>
        
      </n-tab-pane>
    </n-tabs>
  </n-el>


</template>
<script setup lang='ts'>

import { useCurrentTab } from '@/utils/ChromeUtil';
import { onMounted, ref } from 'vue';
import {NTabs,NTabPane} from 'naive-ui'

const currentTab = ref<chrome.tabs.Tab>({} as chrome.tabs.Tab);
const activeTab = ref<'All' | 'Current'>('All');
const ruleList = ref([]);

onMounted(async () => {
  currentTab.value = await useCurrentTab();
});


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
</style>
