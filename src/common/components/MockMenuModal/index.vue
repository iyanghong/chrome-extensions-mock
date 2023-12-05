<template>
  <n-modal preset='dialog' v-model:show='visible' title='规则菜单' style='width: 600px' z-index='999999' @close='handleClose' :show-icon='false'>
    <n-scrollbar style='height: 500px'>
      <MenuItem v-for='item in data' :key='item.id' :data='item' @item-click='handleSelect'></MenuItem>
    </n-scrollbar>
  </n-modal>
</template>
<script setup lang='ts'>
import { NModal,NScrollbar } from 'naive-ui';
import { PropType, ref } from 'vue';
import { MenuTreeEntity } from '@/common/core/generate/menu';
import MenuItem from './MockItem.vue';

const emit = defineEmits(['close', 'select']);

const props = defineProps({
  data: {
    type: Array as PropType<MenuTreeEntity[]>,
    default: () => {
      return [];
    }
  }
});


const visible = ref<boolean>(false);

function handleOpen() {
  visible.value = true;
}

function handleClose() {
  visible.value = false;
  emit('close');
}

function handleSelect(item) {
  emit('select', item);
  handleClose();
}

defineExpose({
  open: handleOpen,
  close: handleClose
});

</script>


<style scoped>

</style>