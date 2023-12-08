<template>
    <n-modal class="ChromeExtensionsMockContainer_MockRule" preset="dialog" v-model:show="visible" title="页面规则编辑"
             style="width: 800px" :z-index="999999"
             @close="handleClose" :show-icon="false">
        <n-scrollbar style="height: 600px" v-if="formData">
            <n-form v-model:model="formData" label-width="80px" label-placement="left">
                <n-form-item>
                    <n-space size="small" justify="center" style="width: 100%">
                        <n-button type="primary" size="small" @click="handleSave">保存</n-button>
                        <n-button type="default" size="small" @click="handleClose">取消</n-button>
                    </n-space>
                </n-form-item>
                <n-form-item label="名称">
                    <n-input type="text" v-model:value="formData.name" placeholder="请输入名称"></n-input>
                </n-form-item>
                <n-tabs v-model:value="activeTab" type="card" animated size="small">
                    <n-tab-pane tab="规则" name="rule">
                        <n-space vertical>
                            <n-form-item v-for="item in formData.ruleItems" :key="item.id" class="rule-item">
                                <n-space size="small" :wrap="false" align="center">
                                    <n-input type="text" size="small" v-model:value="item.name"
                                             placeholder="请输入规则名"
                                             style="width: 120px"></n-input>
                                    <n-el style="width: 80px;" @click="handleShowMenuSelect(item)">
                                        {{ item.mockName || "请选择" }}
                                    </n-el>
                                    <n-button text type="info" size="small" @click="handleRuleItemEdit(item)">编辑
                                    </n-button>
                                    <n-button text type="error" size="small" @click="handleDeleteRuleItem(item)">删除
                                    </n-button>
                                </n-space>
                            </n-form-item>
                        </n-space>
                    </n-tab-pane>

                    <n-tab-pane tab="事件" name="event">
                        <n-space vertical>
                            <n-text type="primary">Mock之前</n-text>
                            <n-space :wrap="false">
                                <n-input type="text" size="small" v-model:value="beforeEventName"
                                         placeholder="请输入事件名称"></n-input>
                                <n-button type="primary" size="small" @click="handleCreateRuleEventForm('before')">
                                    添加
                                </n-button>
                            </n-space>
                            <n-data-table
                                :columns="eventColumns"
                                :data="beforeEvents"
                                :style="{ height:  '150px'}"
                                flex-height
                            />
                            <n-text type="primary">Mock之后</n-text>
                            <n-space :wrap="false">
                                <n-input type="text" size="small" v-model:value="afterEventName"
                                         placeholder="请输入事件名称"></n-input>
                                <n-button type="primary" size="small" @click="handleCreateRuleEventForm('after')">添加
                                </n-button>
                            </n-space>
                            <n-data-table
                                :columns="eventColumns"
                                :data="afterEvents"
                                :style="{ height:  '150px'}"
                                flex-height
                            />
                        </n-space>
                    </n-tab-pane>

                </n-tabs>
            </n-form>
        </n-scrollbar>
    </n-modal>
    <MockMenuModal ref="mockMenuModalRef" :data="treeMockMenuData" @select="handleSelectMenu"></MockMenuModal>
    <MockRuleEventForm ref="mockRuleEventFormRef" @save="handleSaveRuleEvent"></MockRuleEventForm>
    <MockRuleForm ref="mockRuleFormRef" @save="handleSaveRuleItem"></MockRuleForm>
</template>

<script setup lang="ts">

import {
    DataTableColumns,
    NButton,
    NDataTable,
    NEl,
    NForm,
    NFormItem,
    NInput,
    NModal,
    NScrollbar,
    NSpace,
    NTabPane,
    NTabs,
    NTag,
    NText
} from "naive-ui";
import {computed, h, PropType, ref} from "vue";
import MockRuleEventForm from "./MockRuleEventForm.vue";
import MockRuleForm from "./MockRuleForm.vue";
import {RuleEntity, RuleEventEntity, RuleItemEntity} from "@/common/entitys/PageEntity";
import {MenuTreeEntity} from "@/common/core/generate/menu";
import MockMenuModal from "@/common/components/MockMenuModal/index.vue";
import {IHandler} from "@/common/core/handler";

const emit = defineEmits(["close", "save"]);
const props = defineProps({
    handler: {
        type: Object as PropType<IHandler>,
        required: true
    }
});

const visible = ref<boolean>(false);
const formData = ref<RuleEntity>();
const selectRule = ref<RuleItemEntity>();
const treeMockMenuData = ref<MenuTreeEntity[]>([]);
const mockMenuModalRef = ref();
const mockRuleEventFormRef = ref();
const mockRuleFormRef = ref();
const activeTab = ref<'rule' | 'event'>("rule");

const beforeEventName = ref<string>("");
const beforeEvents = computed<RuleEventEntity[]>(() => {
    if (!formData.value?.events) return [];
    return formData.value.events.filter(it => it.type == "before" && it.name.includes(beforeEventName.value));
});
const afterEventName = ref<string>("");
const afterEvents = computed<RuleEventEntity[]>(() => {
    if (!formData.value?.events) return [];
    return formData.value.events.filter(it => it.type == "after" && it.name.includes(afterEventName.value));
});

const eventColumns: DataTableColumns<RuleEventEntity> = [
    { key: "name", title: "名称", width: 120 },
    {
        key: "type", title: "类型", width: 120, render: (row: RuleEventEntity) => {
            return h(NTag, { type: row.type == "before" ? "success" : "info" }, {
                default: () => row.type == "before" ? "Mock之前" : "Mock之后"
            });
        }
    },
    {
        key: "action", title: "操作", width: 120, render: (row: RuleEventEntity) => {
            return h(NSpace, { wrap: false, align: "center" }, {
                default: () => [
                    h(NButton, {
                        text: true, type: "primary", size: "small", onClick: () => {
                            handleOpenRuleEventForm(row);
                        }
                    }, { default: () => "编辑" }),
                    h(NButton, {
                        text: true, type: "error", size: "small", onClick: () => {
                            handleDeleteEvent(row);
                        }
                    }, { default: () => "删除" })
                ]
            });
        }
    }
];

function handleCreateRuleEventForm(type: "before" | "after") {
    let ruleEvent: RuleEventEntity = {
        id: "",
        ruleId: formData.value?.id || "",
        name: "",
        type: type,
        content: ""
    };
    handleOpenRuleEventForm(ruleEvent);

}

function handleOpenRuleEventForm(ruleEvent: RuleEventEntity) {
    mockRuleEventFormRef.value?.open(ruleEvent);
}

function handleSaveRuleEvent(ruleEvent: RuleEventEntity) {
    if (!formData.value) return;
    if (!formData.value.events) formData.value.events = [];
    if (formData.value.events.filter(it => it.id == ruleEvent.id).length == 0) {
        formData.value.events.push(ruleEvent);
    } else {
        formData.value.events = formData.value.events.map(it => {
            if (it.id == ruleEvent.id) {
                return ruleEvent;
            }
            return it;
        });
    }
}

function handleSaveRuleItem(rule: RuleItemEntity) {
    if (!formData.value) return;
    if (!formData.value.ruleItems) formData.value.ruleItems = [];
    if (formData.value.ruleItems.filter((it: RuleItemEntity) => it.id == rule.id).length == 0) {
        formData.value.ruleItems.push(rule);
    } else {
        formData.value.ruleItems = formData.value.ruleItems.map(it => {
            if (it.id == rule.id) {
                return rule;
            }
            return it;
        });
    }
}
function handleShowMenuSelect(item: RuleItemEntity) {
    selectRule.value = item;
    mockMenuModalRef.value?.open();
}

function handleSelectMenu(menu: MenuTreeEntity) {
    if (!formData.value) return;
    formData.value.ruleItems = formData.value.ruleItems.map(it => {
        if (it.id == selectRule.value?.id) {
            it.mockKey = menu.expression || "";
            it.mockName = menu.name;
        }
        return it;
    });
}

function handleDeleteRuleItem(ruleItemEntity: RuleItemEntity) {
    if (!formData.value) return;
    formData.value.ruleItems = formData.value.ruleItems.filter(it => it.id != ruleItemEntity.id);
}

function handleDeleteEvent(ruleEvent: RuleEventEntity) {
    if (!formData.value) return;
    if (!formData.value.events) formData.value.events = [];
    formData.value.events = formData.value.events.filter(it => it.id != ruleEvent.id);
}

function handleEventItemEdit(ruleEvent: RuleEventEntity) {

}

function handleRuleItemEdit(ruleItemEntity: RuleItemEntity) {
    mockRuleFormRef.value?.open(ruleItemEntity)
}

async function handleLoadTreeMenuData() {
    treeMockMenuData.value = await props.handler?.sendBackgroundMessage("getTreeMockMenuData", {});
}

function handleOpen(rule: RuleEntity) {
    let d: RuleEntity = JSON.parse(JSON.stringify(rule));
    if (!d.events) {
        d.events = [];
    }
    formData.value = d;
    visible.value = true;
}

function handleClose() {
    visible.value = false;
    emit("close");
}

function handleSave() {
    emit("save", formData.value);
    handleClose();
}

handleLoadTreeMenuData();
defineExpose({
    open: handleOpen,
    close: handleClose
});
</script>

<style scoped>

</style>