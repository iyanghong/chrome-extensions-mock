<template>
  <n-card :id="modalId" class="chrome-extensions-mock-modal" closable @close="handleClose" :style="modalStyle">
    <template #header>
      <slot name="header">
        <n-el :id="modalId + '-bar'" class="chrome-extensions-mock-modal-header cursor-move">
          {{ title }}
        </n-el>
      </slot>
    </template>
    <slot></slot>
  </n-card>
</template>

<script setup lang="ts">

import {nextTick, onMounted, ref} from "vue";
import {EventListener} from "@/common/utils/DomUtils";

const emit = defineEmits(['close'])
const props = defineProps({
  title: {
    type: String,
    default: () => ''
  },
  width: {
    type: [String, Number],
    default: () => ''
  },
  height: {
    type: [String, Number],
    default: () => ''
  }
})
const modalId = `chrome-extensions-mock-modal-${new Date().getTime()}`
const modalStyle = ref<Record<string, any>>({})

onMounted(() => {
  if (props.width) modalStyle.value.width = props.width
  if (props.height) modalStyle.value.height = props.height
  nextTick(() => {
    const oBox = document.getElementById(modalId);
    const oBar = document.getElementById(`${modalId}-bar`);
    console.log(oBox)
    console.log(oBar)
    //@ts-ignore
    handleDrag(oBox,oBar);
  });
})

function handleDrag(container: { offsetWidth: any; offsetHeight: any; offsetLeft: number; offsetTop: number; style: { left: string; top: string; }; }, header: { onmousedown: (e: any) => void; offsetLeft: number; offsetTop: number; }) {
  let documentMouseMoveEvent:any = null
  let documentMouseUpEvent:any = null
  header.onmousedown = (e) => {
    // 鼠标按下，计算当前元素距离可视区的距离
    const disX = e.clientX - header.offsetLeft
    const disY = e.clientY - header.offsetTop

    const dragDomWidth = container.offsetWidth
    const dragDomHeight = container.offsetHeight

    const screenWidth = document.body.clientWidth
    const screenHeight = document.body.clientHeight

    const minDragDomLeft = container.offsetLeft
    const maxDragDomLeft = screenWidth - container.offsetLeft - (dragDomWidth / 2)

    const minDragDomTop = container.offsetTop
    const maxDragDomTop = screenHeight - container.offsetTop - (dragDomHeight / 2)
    //@ts-ignore
    let containerStyles = getComputedStyle(container)
    // 获取到的值带px 正则匹配替换
    let styL:string | number = containerStyles.left
    let styT:string | number = containerStyles.top

    if (styL.includes('%')) {
      styL = +document.body.clientWidth * (+styL.replace(/\%/g, '') / 100)
      styT = +document.body.clientHeight * (+styT.replace(/\%/g, '') / 100)
    } else {
      //@ts-ignore
      styL = +styL.replace(/\px/g, '')
      //@ts-ignore
      styT = +styT.replace(/\px/g, '')
    }
    documentMouseMoveEvent = EventListener.listen(document, 'mousemove', e => {
      // 通过事件委托，计算移动的距离
      //@ts-ignore
      let left = e.clientX - disX
      //@ts-ignore
      let top = e.clientY - disY

      // 边界处理
      if (-(left) > minDragDomLeft) {
        left = -minDragDomLeft
      } else if (left > maxDragDomLeft) {
        left = maxDragDomLeft
      }

      if (-(top) > minDragDomTop) {
        top = -minDragDomTop
      } else if (top > maxDragDomTop) {
        top = maxDragDomTop
      }

      // 移动当前元素
      container.style.left = `${Number(left) + Number(styL)}px`
      container.style.top = `${Number(top) + Number(styT)}px`


      // dragDom.style.cssText += `;left:${left + styL}px;top:${top + styT}px;`

      // emit onDrag event

      // vnode.child.$emit('dragDialog', e)
    })

    documentMouseUpEvent = EventListener.listen(document, 'mouseup', () => {
      if (documentMouseMoveEvent) documentMouseMoveEvent.remove()
      if (documentMouseUpEvent) documentMouseUpEvent.remove()
    })
  }
}


function handleClose() {
  emit('close')
}
</script>

<style scoped lang="scss">
:deep(.n-card-header),:deep(.n-card__content)  {
  padding: 10px !important;
}

.chrome-extensions-mock-modal {
  width: 300px;
  min-height: 300px;
  position: fixed;
  top: 30px;
  right: 30px;
  padding: 0 12px 50px 12px;
  background-color: #fff;
  box-shadow: rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset;
  z-index: 999999;

  .cursor-move {
    cursor: move;
    position: relative;
  }
}
</style>
