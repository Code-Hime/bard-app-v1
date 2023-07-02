<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
    initialTab: String,
    tabs: Array
});

let activeTab = ref('inspo');

const tabPanelSlotName = computed(() => {
    return `tab-panel-${activeTab.value}`;
});

function tabHeadSlotName(tabName) {
    return `tab-head-${tabName}`;
};

function switchTab(tabName) {
   activeTab.value = tabName;
};
</script>

<template>
    <div class="card">
        <header class="card-header">
            <ul class="tab-heads">
                <li
                  class="tab-head"
                  v-for="tab in tabs"
                  :key="tab"
                  v-bind:class="{
                      'tab-head--active': activeTab === tab
                  }"
                  @click="switchTab(tab);"
                >
                    <slot :name="tabHeadSlotName(tab)">{{ tab }}</slot>
                </li>
            </ul>
        </header>
        <main class="card-body">
            <div class="tab-panel">
                <slot :name="tabPanelSlotName"></slot>
            </div>
        </main>
    </div>
</template>

<style lang="scss" scoped>

</style>