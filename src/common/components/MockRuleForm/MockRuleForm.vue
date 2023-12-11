<template>
    <n-modal class="ChromeExtensionsMockContainer_MockRuleEventForm" preset="dialog" v-model:show="visible"
             title="页面规则项编辑"
             style="width: 500px" :z-index="999999"
             @close="handleClose" :show-icon="false">
        <n-form v-if="ruleItemData" :model="ruleItemData">
            <n-form-item>
                <n-space size="small" justify="center" style="width: 100%">
                    <n-button type="primary" size="small" @click="handleSave">保存</n-button>
                    <n-button type="default" size="small" @click="handleClose">取消</n-button>
                </n-space>
            </n-form-item>
            <n-form-item label="名称" path="name">
                <n-input type="text" v-model:value="ruleItemData.name" placeholder="请输入名称"></n-input>
            </n-form-item>
            <n-form-item label="真实地址" path="realPath">
                <n-input type="textarea" v-model:value="ruleItemData.realPath" readonly
                         placeholder="请输入真实地址"></n-input>
            </n-form-item>
            <n-space :wrap="false">
                <n-form-item label="适配器" path="adapter">
                    <n-input v-model:value="ruleItemData.adapter" placeholder="请选择适配器" readonly></n-input>
                </n-form-item>
                <n-form-item label="元素类型" path="mockType">
                    <n-select
                        v-model:value="ruleItemData.type"
                        placeholder="请选择元素类型"
                        :options="ruleItemTypes"
                        style="width: 120px;"
                    ></n-select>
                </n-form-item>
            </n-space>
            <n-form-item label="Mock名称" path="mockName">
                <n-input type="text" :readonly="ruleItemData.type !== 'input'" v-model:value="ruleItemData.mockName"
                         placeholder="请输入Mock名称"></n-input>
            </n-form-item>
            <n-form-item label="Mock表达式" path="mockName" v-if="ruleItemData.type === 'input'">
                <n-mention
                    v-model:value="ruleItemData.mockKey"
                    placeholder="请输入表达式"
                    type="textarea"
                    :options="mentionOptions"
                />
            </n-form-item>
            <n-form-item label="排序" path="sort">
                <n-input-number v-model:value="ruleItemData.sort" placeholder="请输入排序"></n-input-number>
            </n-form-item>
        </n-form>
    </n-modal>
</template>
<script setup lang="ts">
import { PropType, ref } from "vue";
import { NButton, NForm, NFormItem, NInput, NInputNumber, NMention, NModal, NSelect, NSpace } from "naive-ui";
import { RuleItemEntity } from "@/common/entitys/PageEntity";
import { IHandler } from "@/common/core/handler";
import { MockItemEntity } from "@/common/core/generate/types";

const emit = defineEmits(["close", "save"]);
const props = defineProps({
    handler: {
        type: Object as PropType<IHandler>,
        required: true
    }
});

const visible = ref<boolean>(false);
const ruleItemData = ref<RuleItemEntity>();
const ruleFormRef = ref();
const mentionOptions = ref([]);
const ruleItemTypes = ref([
    { label: "输入框", value: "input" },
    { label: "选择框", value: "select" },
    { label: "单选", value: "radio" },
    { label: "多选", value: "checkbox" },
    { label: "开关", value: "switch" }
]);

async function handleLoad() {
    if (!props.handler) return;
    mentionOptions.value = (await props.handler.sendBackgroundMessage("getAllMockEntity", null)).map((it: MockItemEntity) => {
        return {
            value: it.placeholder.replace("@", ""),
            label: `${it.placeholder.replace("@", "")}(${it.comment})`
        };
    });
}

const handleSave = () => {
    if (!ruleItemData.value || !ruleFormRef.value) return;
    ruleFormRef.value?.validate((errors: any) => {
        if (!errors) {
            emit("save", ruleItemData.value);
            handleClose();
        }
    });
};
const handleOpen = (data: RuleItemEntity) => {
    ruleItemData.value = JSON.parse(JSON.stringify(data));
    visible.value = true;
};
const handleClose = () => {
    visible.value = false;
    emit("close");
};

handleLoad();
defineExpose({
    open: handleOpen,
    close: handleClose
});


</script>


<style scoped>

</style>