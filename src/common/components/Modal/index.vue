<template>
  <n-modal id="basic-modal" v-bind="$attrs" v-model:show="visible" @close="close">
    <template #header>
      <div class="w-full cursor-move" id="basic-modal-bar">{{ $attrs.title }}</div>
    </template>
    <template #default>
      <slot name="default"></slot>
    </template>
  </n-modal>
</template>
<script setup lang="ts">

import {nextTick, ref} from "vue";
import startDrag from "@/common/utils/drag";

const visible = ref<boolean>(false)

function open() {
  visible.value = true
  nextTick(() => {
    const oBox = document.getElementById('basic-modal');
    const oBar = document.getElementById('basic-modal-bar');
    // @ts-ignore
    startDrag(oBar, oBox);
  });
}

function close() {
  visible.value = false
}
</script>


<style scoped>

</style>