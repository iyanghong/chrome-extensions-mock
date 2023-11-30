<template>
  <Modal title="编辑规则" @close="handleClose">
    <n-space :wrap="false">
      <n-text>名称：</n-text>
      <n-input type="text" size="small"></n-input>
    </n-space>
    <n-text>注：点击页面上的控件来添加控件</n-text>
  </Modal>
</template>
<script setup lang="ts">

import Modal from '@/common/components/Modal/index.vue'

function handleClose() {
}

</script>
<style scoped lang="scss">

</style>