<template>
  <n-el style='padding: 10px'>

    <n-space justify='start' align='center'>
      <n-select
        v-model:value='selectOrigin'
        :options='originList'
        style='width: 200px'
      >
      </n-select>
      <n-input type='text' style='margin: 10px 0;width: 150px;' placeholder='请输入关键字'
               v-model:value='searchKey'></n-input>
    </n-space>

    <n-data-table
      :columns='columns'
      :data='filterList'
      :style='{ height: `calc(100vh - 300px)` }'
      flex-height
    />
  </n-el>
</template>
<script setup lang='ts'>
import Handler from '@/common/core/handler';
import { DataTableColumns, NEl, NSelect, NButton, NSpace, NInput, NTabPane, NTag, NDataTable } from 'naive-ui';
import { computed, h, ref } from 'vue';
import { RuleEntity } from '@/common/entitys/PageEntity';

const handler = new Handler('Options');
const dataList = ref<RuleEntity[]>([]);
const searchKey = ref<string>('');
const selectOrigin = ref<string>('');
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
            onClick: () => handleEdit(row.id)
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
  let response = await handler.sendBackgroundMessage('GetAllPageRule');

  console.log('response = ', response);
  dataList.value = response;
}

function handleEdit(id: string) {
}

async function handleDelete(id: string) {
  await handler.sendBackgroundMessage('DeleteRule', id);
  await loadData();
}

loadData();
</script>


<style scoped>

</style>