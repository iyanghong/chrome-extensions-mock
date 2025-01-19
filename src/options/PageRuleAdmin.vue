<template>
  <n-el style='padding: 10px'>

    <n-space justify='start' align='center'>
      <n-select v-model:value='selectOrigin' :options='originList' style='width: 200px'>
      </n-select>
      <n-input type='text' style='margin: 10px 0;width: 150px;' placeholder='请输入关键字' v-model:value='searchKey'></n-input>
      <n-button type='default' size='small' @click='handleExport'>导出</n-button>
      <n-button type='default' size='small' @click='handleSelectImportFile'>导入</n-button>
    </n-space>

    <n-data-table :columns='columns' :data='filterList' :style='{ height: `calc(100vh - 300px)` }' flex-height />

    <MockRuleForm ref="mockRuleFormRef" :handler="handler" @save="handleSave"></MockRuleForm>


    <input ref="importFileRef" type="file" @change="handleImport" style="display: none;">
  </n-el>
</template>
<script setup lang='ts'>
import Handler from '@/common/core/handler';
import { DataTableColumns, NButton, NDataTable, NEl, NInput, NSelect, NSpace, NTag } from 'naive-ui';
import { computed, h, ref } from 'vue';
import { RuleEntity } from '@/common/entitys/PageEntity';
import MockRuleForm from '@/common/components/MockRuleForm/index.vue'

const handler = ref(new Handler('Options'));
const dataList = ref<RuleEntity[]>([]);
const searchKey = ref<string>('');
const selectOrigin = ref<string>('');
const mockRuleFormRef = ref()
const importFileRef = ref()

const filterList = computed(() => {
  return dataList.value.filter(it => (selectOrigin.value ? it.origin == selectOrigin.value : true) && (it.origin.includes(searchKey.value) || it.url.includes(searchKey.value) || it.name.includes(searchKey.value)));
});

const originList = computed(() => {
  let list: { label: string, value: string }[] = [{ label: '请选择Origin', value: '' }];
  dataList.value.forEach(item => {
    if (!list.filter(it => it.value == item.origin)[0]) {
      let label = item.origin;
      if (label.startsWith('https://')) label = label.replace('https://', '');
      if (label.startsWith('http://')) label = label.replace('http://', '');
      list.push({
        label: label,
        value: item.origin
      });
    }
  });
  return list;
});

let columns: DataTableColumns<RuleEntity> = [
  {
    key: 'origin',
    title: 'Origin'
  },
  {
    key: 'url',
    title: '地址'
  },
  {
    key: 'siteTitle',
    title: '页面标题'
  },
  {
    key: 'name',
    title: '名称'
  },
  {
    key: 'ruleItems',
    title: '规则项数',
    render: row => {
      return h(NTag, {}, { default: () => row.ruleItems.length });
    }
  },
  {
    key: 'action',
    width: 100,
    title: '操作',
    render: (row: RuleEntity) => {
      return h(NSpace, { wrap: false, align: 'center' }, {
        default: () => [
          h(NButton, {
            size: 'small',
            text: true,
            type: 'primary',
            onClick: () => handleEdit(row)
          }, { default: () => '编辑' }),
          h(NButton, {
            size: 'small',
            text: true,
            type: 'error',
            onClick: () => handleDelete(row.id)
          }, { default: () => '删除' })
        ]
      });
    }
  }
];

async function loadData() {
  let response = await handler.value.sendBackgroundMessage('getAllPageRule');

  console.log('response = ', response);
  dataList.value = response;
}

function handleEdit(rule: RuleEntity) {
  mockRuleFormRef.value?.open(rule)
}

async function handleSave(rule: RuleEntity) {
  await handler.value.sendBackgroundMessage('savePageRule', rule)
  await loadData()
}

async function handleDelete(id: string) {
  await handler.value.sendBackgroundMessage('deleteRule', id);
  await loadData();
}
async function handleExport() {
  let data = await handler.value.sendBackgroundMessage('getAllPageRule')
  let json = JSON.stringify(data, null, 2);
  let blob = new Blob([json], { type: 'application/json' });
  let url = URL.createObjectURL(blob);
  let a = document.createElement('a');
  a.href = url;
  a.download = 'mock-rules-data.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
function handleSelectImportFile() {
  importFileRef.value?.click()
}
async function handleImport(event) {
  const file = event.target.files[0]
  const text = await new Response(file).text()
  try {
    const data = JSON.parse(text)
    await handler.value.sendBackgroundMessage('setAllRule', data)
  } catch (_) { }
  console.log(text);

}
loadData();
</script>


<style scoped></style>