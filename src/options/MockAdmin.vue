<template>
  <n-el style='padding: 10px'>
    <n-space>
      <n-button type='primary' size='small' @click='handleShowMockModal'>查看所有Mock</n-button>
    </n-space>
  </n-el>
  <MockListModal ref='mockListModalRef'></MockListModal>

</template>

<script setup lang='ts'>
import { NEl, NSpace, NButton, NModal } from 'naive-ui';
import MockListModal from './MockListModal.vue';
import { ref } from 'vue';

const mockListModalRef = ref();

function handleShowMockModal() {
  mockListModalRef.value?.open();
}

</script>


<style scoped>

</style>