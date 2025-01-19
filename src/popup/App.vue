<template>
  <n-el class='popup-container'>
    <n-el>当前页面：
      <n-text>{{ currentTab.title }}</n-text>
    </n-el>
    <n-space justify="center" class="action-panel">
      <n-button type="primary" size="small" @click='handleOpenOption'>管理</n-button>
      <n-button type="primary" size="small" @click="handleCreate()">创建</n-button>
    </n-space>
    <n-tabs v-model:value='activeTab' justify-content="space-evenly">
      <n-tab-pane tab='全部' name='All'>
        <n-data-table :columns="columns" :data="originRules" :style="{ height: `300px` }" flex-height />
      </n-tab-pane>
      <n-tab-pane tab='当前页' name='Current'>
        <n-data-table :columns="columns" :data="urlRules" :style="{ height: `300px` }" flex-height />
      </n-tab-pane>
      <n-tab-pane tab='Cookie' name='Cookie'>
        <n-space vertical>
          <n-space justify="center">
            <n-button size="small" style="margin: 20px 0" type="primary" @click="handleSetCookie">设置Cookie</n-button>
          </n-space>
          <n-data-table style="margin-top: 20px" :columns="cookieColumns" :data="cookieList" :style="{ height: `300px` }"
            flex-height />
        </n-space>
      </n-tab-pane>
    </n-tabs>
  </n-el>
</template>
<script setup lang='ts'>
import { useCurrentTab } from '@/common/utils/ChromeUtil';
import { computed, h, onMounted, ref } from 'vue';
import {
  DataTableColumns,
  NButton,
  NDataTable,
  NEl,
  NSpace,
  NTabPane,
  NTabs,
  NText,
  useMessage,
  NMessageProvider, NTooltip
} from 'naive-ui';
import Handler from '@/common/core/handler';
import { RuleEntity, RuleItemEntity } from '@/common/entitys/PageEntity';
import Cookie = chrome.cookies.Cookie;

const handler = new Handler('Popup');
const currentTab = ref<chrome.tabs.Tab>({} as chrome.tabs.Tab);
const activeTab = ref<'All' | 'Current' | 'Cookie'>('All');

const origin = ref<string>('');
const url = ref<string>('');

const originRules = ref<RuleEntity[]>([]);
const cookieList = ref<Cookie[]>([]);

const urlRules = computed(() => {
  return originRules.value.filter(rule => rule.url == url.value);
});

let columns: DataTableColumns<RuleEntity> = [
  {
    key: 'name',
    render: (row: RuleEntity) => {
      return h(NSpace, { justify: 'space-between', wrap: false, align: 'center' }, {
        default: () => [
          h(NButton, {
            style: 'width:160px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;', onClick: () => {
              handleInjectRuleValues(row.ruleItems);
            }
          }, { default: () => row.name }),
          h(NSpace, { justify: 'space-between', wrap: false, align: 'center' }, {
            default: () => [
              h(NButton, {
                size: 'small',
                text: true,
                type: 'primary',
                onClick: () => handleCreate(row.id)
              }, { default: () => '编辑' }),
              h(NButton, {
                size: 'small',
                text: true,
                type: 'error',
                onClick: () => handleDelete(row.id)
              }, { default: () => '删除' })
            ]
          })
        ]
      });
    }
  }
];
let cookieColumns: DataTableColumns<Cookie> = [
  {
    key: 'name',
    render: (row: Cookie) => {
      return h(NSpace, { justify: 'space-between', wrap: false, align: 'center' }, {
        default: () => [
          h(NTooltip, {
            trigger: 'hover',
            style: 'maxWidth:230px'
          }, {
            default: () => {
              return `${row.name}=${row.value}`;
            },
            trigger: () => {
              return h(NButton, {
                size: 'small',
                style: 'width:100px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;font-size:12px',
                onClick: () => {
                  handleCopyCookie(row);
                }
              }, { default: () => row.name });
            }
          })
          ,
          h(NSpace, { justify: 'space-between', wrap: false, align: 'center' }, {
            default: () => [
              h(NButton, {
                size: 'small',
                text: true,
                type: 'primary',
                onClick: () => handleCopyCookieName(row)
              }, { default: () => 'Key' }),
              h(NButton, {
                size: 'small',
                text: true,
                type: 'primary',
                onClick: () => handleCopyCookieValue(row)
              }, { default: () => 'Value' }),
              h(NButton, {
                size: 'small',
                text: true,
                type: 'error',
                onClick: () => handleDeleteCookie(row)
              }, { default: () => '删除' })
            ]
          })
        ]
      });


    }
  }
];
onMounted(async () => {
  currentTab.value = await useCurrentTab();
  url.value = currentTab.value.url || '';
  let pathArray = url.value.split('/');
  if (pathArray[2]) {
    let protocol = pathArray[0];
    let host = pathArray[2];
    origin.value = protocol + '//' + host;
  }
  await loadData();
  loadCookie()
});

function loadCookie() {
  chrome.cookies.getAll({
    url: origin.value
  }, (cookies => {
    cookieList.value = cookies;
  }));
}
async function loadData() {
  originRules.value = await handler.sendBackgroundMessage('getOriginRules', origin.value);
}

function handleInjectRuleValues(ruleItems: RuleItemEntity[]) {
  if (!currentTab.value || currentTab.value.id === undefined) return;
  chrome.scripting.executeScript({
    target: { tabId: currentTab.value.id },
    func: (itemsJson: string) => {
      window['InjectRuleValues'](itemsJson);
    },
    args: [JSON.stringify(ruleItems)]
  });
}

function handleCreate(id: string = '') {
  if (!currentTab.value || currentTab.value.id === undefined) return;
  chrome.scripting.executeScript({
    target: { tabId: currentTab.value.id },
    func: (ruleData: RuleEntity | Record<string, any>) => {
      window['CreatePageRuleForm'](ruleData);
    },
    args: [{ id: id }]
  });
}

function handleOpenOption() {
  chrome.runtime.openOptionsPage();
}

async function handleDelete(id: string) {
  if (!id) return false;
  await handler.sendBackgroundMessage('deleteRule', id);
  loadData();
}


function handleCopyCookie(cookie: Cookie) {
  navigator.clipboard.writeText(`${cookie.name}=${cookie.value}`).then(res => {

  });
}

function handleCopyCookieValue(cookie: Cookie) {
  navigator.clipboard.writeText(cookie.value).then(res => {

  });
}

function handleCopyCookieName(cookie: Cookie) {
  navigator.clipboard.writeText(cookie.name).then(res => {

  });
}
function handleDeleteCookie(cookie: Cookie) {
  chrome.cookies.remove({
    url: origin.value,
    name: cookie.name,
  }, () => {
    loadCookie()
  });
}
function handleSetCookie() {
  navigator.clipboard.readText().then((res: string) => {
    let defaultValue:string = ''
    if (res && res.match(/^([^=]*)=(.*)$/)) {
      defaultValue = res
    }
    promptCookie(defaultValue)
  }).catch(() => promptCookie())

}

function promptCookie(defaultValue:string = '') {
  const content = prompt('请输入Cookie(Key=value)：', defaultValue);
  if (content !== null) {
    if (content.indexOf('=') > -1) {
      let match = content.match(/^([^=]*)=(.*)$/);
      if (match) {
        let key = match[1];
        let value = match[2];
        chrome.cookies.set({
          url: origin.value,
          name: key,
          value: value
        });
      }
    }
  }
}
</script>


<style scoped>
* {
  padding: 0 !important;
  margin: 0 !important;
}

.popup-container {
  width: 260px;
  height: 300px;
}

:deep(.action-panel .n-button .n-button__content) {
  padding: 0 10px;
}

:deep(.n-data-table-thead) {
  display: none;
}
</style>
