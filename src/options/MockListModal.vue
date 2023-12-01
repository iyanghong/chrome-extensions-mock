<template>
  <n-modal v-model:show='showMockModal' preset='dialog' title='Mock大全' :show-icon='false' style='width: 1000px'>
    <n-data-table
      :columns='columns'
      :data='dataList'
      :style='{ height: `600px` }'
      flex-height
    />
  </n-modal>
</template>
<script setup lang='ts'>
import { DataTableColumns, NDataTable, NEl, NModal } from 'naive-ui';
import { h, ref } from 'vue';
import { RuleEntity } from '@/common/entitys/PageEntity';
import { MockItemEntity, MockItemType } from '@/common/core/generate/types';
import Handler from '@/common/core/handler';

const handler = new Handler('Options');
const showMockModal = ref<boolean>(false);
const dataList = ref<MockItemEntity[]>([]);
let columns: DataTableColumns<MockItemEntity> = [
  {
    key:'key',
    title:'序号',
    width:60,
    align:'center',
    titleAlign:'center',
    render:(row,index)=>{
      return `${index+1}`
    }
  },
  {
    key: 'key',
    title: 'key',
    titleAlign:'center',
    width: 120,
    ellipsis: {
      tooltip: true
    }
  },
  {
    key: 'comment',
    title: '说明',
    titleAlign:'center',
    width: 180,
    align:'center',
    ellipsis: {
      tooltip: true
    }
  },
  {
    key: 'params',
    title: '参数',
    align:'center',
    titleAlign:'center',
    render: row => {
      if (!row.params || row.params.length == 0) return '无';
      return `(${row.params.join(',')})`;
    },
    width: 100,
    ellipsis: {
      tooltip: true
    }
  },
  {
    key: 'placeholder',
    title: '表达式',
    titleAlign:'center',
    width: 220,
    ellipsis: {
      tooltip: true
    }
  },
  {
    key:'exampleValue',
    title:'示例值',
    titleAlign:'center',
    width: 150,
    ellipsis: {
      tooltip: true
    }
  }
];


async function loadData() {
  dataList.value = await handler.sendBackgroundMessage('getAllMockEntity');
}

async function open() {
  showMockModal.value = true;
  await loadData();
}

function close() {
  showMockModal.value = false;
}

defineExpose({
  open,
  close
});
</script>
<style scoped>

</style>