<template>
  <n-el class='popup-container'>
    <n-el>当前页面：<n-text>{{ currentTab.title }}</n-text></n-el>
    <n-space justify="center" class="action-panel">
      <n-button type="primary" size="small" @click='handleOpenOption'>管理</n-button>
      <n-button type="primary" size="small" @click="handleCreate()">创建</n-button>
    </n-space>
    <n-tabs v-model:value='activeTab' justify-content="space-evenly">
      <n-tab-pane tab='全部' name='All'>
        <n-data-table
            :columns="columns"
            :data="originRules"
            :style="{ height: `300px` }"
            flex-height
        />
      </n-tab-pane>
      <n-tab-pane tab='当前页' name='Current'>
        <n-data-table
            :columns="columns"
            :data="urlRules"
            :style="{ height: `300px` }"
            flex-height
        />
      </n-tab-pane>
    </n-tabs>
  </n-el>


</template>
<script setup lang='ts'>
import {useCurrentTab} from '@/common/utils/ChromeUtil';
import {computed, h, onMounted, ref} from 'vue';
import {DataTableColumns, NButton, NDataTable, NEl, NSpace, NTabPane, NTabs, NText} from 'naive-ui'
import Handler from "@/common/core/handler";
import {RuleEntity, RuleItemEntity} from "@/common/entitys/PageEntity";

const handler = new Handler('Popup')
const currentTab = ref<chrome.tabs.Tab>({} as chrome.tabs.Tab);
const activeTab = ref<'All' | 'Current'>('All');

const origin = ref<string>('')
const url = ref<string>('')

const originRules = ref<RuleEntity[]>([]);


const urlRules = computed(() => {
  return originRules.value.filter(rule => rule.url == url.value)
})


let columns: DataTableColumns<RuleEntity> = [
  {
    key: 'name',
    render: (row: RuleEntity) => {
      return h(NSpace, {justify: "space-between", wrap: false, align: "center"}, {
        default: () => [
          h(NButton, {style: "width:100px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;",onClick:() => {
              handleInjectRuleValues(row.ruleItems);
            }}, {default: () => row.name}),
          h(NSpace, {justify: "space-between", wrap: false, align: "center"}, {
            default: () => [
              h(NButton, {
                size: 'small',
                text: true,
                type: 'primary',
                onClick: () => handleCreate(row.id)
              }, {default: () => '编辑'}),
              h(NButton, {
                size: 'small',
                text: true,
                type: 'error',
                onClick: () => handleDelete(row.id)
              }, {default: () => '删除'}),
            ]
          })
        ]
      })
    }
  }
]

onMounted(async () => {
  currentTab.value = await useCurrentTab();
  url.value = currentTab.value.url || ''
  let pathArray = url.value.split('/');
  if (pathArray[2]) {
    let protocol = pathArray[0];
    let host = pathArray[2];
    origin.value = protocol + '//' + host;
  }
  await loadData()

});

async function loadData() {
  console.log('origin.value', origin.value)
  originRules.value = await handler.sendBackgroundMessage('getOriginRules', origin.value)
}

function handleInjectRuleValues(ruleItems: RuleItemEntity[]) {
  if (!currentTab.value || currentTab.value.id === undefined) return
  chrome.scripting.executeScript({
    target: {tabId: currentTab.value.id},
    func: (itemsJson: string) => {
      window["InjectRuleValues"](itemsJson)
    },
    args: [JSON.stringify(ruleItems)]
  })
}

function handleCreate(id: string = '') {
  if (!currentTab.value || currentTab.value.id === undefined) return
  chrome.scripting.executeScript({
    target: {tabId: currentTab.value.id},
    func: (ruleData: RuleEntity | Record<string, any>) => {
      window["CreatePageRuleForm"](ruleData)
    },
    args: [{id: id}]
  })
}

function handleOpenOption(){
  chrome.runtime.openOptionsPage()
}

async function handleDelete(id: string) {
  if (!id) return false
  await handler.sendBackgroundMessage('deleteRule', id)
  loadData()
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
