<template>
  <el-scrollbar class="dashboard-canvas-container" :style="{ '--rule-height': `${ruleHeight}px` }">
    <div class="space" />
    <rule ref="ruleTop" class="rule rule-top" :width="canvasWidth" :height="ruleHeight" scale-direction="end" direction="row" :scale-options="scales" />
    <rule ref="ruleLeft" class="rule rule-left" :width="canvasHeight" :height="ruleHeight" scale-direction="end" direction="column" :scale-options="scales" />
    <div :style="{ width: `${canvasWidth}px`, height: `${canvasHeight}px` }" />
  </el-scrollbar>
</template>

<script setup lang="ts">
import { onMounted, ref, watch, type Ref } from 'vue';
import { storeToRefs } from 'pinia';

import { useEditorStore } from '@/store/index';
import Rule from './rule/index.vue';

const ruleHeight = 50;
const ruleTop: Ref<typeof Rule | null> = ref(null);
const ruleLeft: Ref<typeof Rule | null> = ref(null);
const editorStore = useEditorStore();
const { canvasWidth, canvasHeight } = storeToRefs(editorStore);
watch(canvasWidth, () => {
  ruleTop.value?.draw(canvasWidth.value, ruleHeight);
});
watch(canvasHeight, () => {
  ruleLeft.value?.draw(canvasHeight.value, ruleHeight);
});

const scales = [
  {
    step: 10,
    long: 5,
    color: '#ffffff',
  },
  {
    showNumber: true,
    step: 50,
    long: 10,
    color: '#ffffff',
    fontColor: '#ffffff',
  },
  {
    showNumber: true,
    step: 100,
    long: 15,
    color: '#ffffff',
    fontColor: '#ffffff',
  },
];
onMounted(() => {
  ruleTop.value?.draw();
  ruleLeft.value?.draw();
});

defineOptions({
  name: 'DashboardCanvasContainerIndex',
});
</script>

<style lang="postcss" scoped>
.dashboard-canvas-container {
  width: 100%;
  height: 100%;

  .space {
    position: absolute;
    width: var(--rule-height);
    height: var(--rule-height);
    top: 0;
    left: 0;
    background-color: #242424;
    z-index: 2027;
  }
  .rule {
    position: sticky;
    z-index: 2026;

    &.rule-top {
      top: 0;
      margin-left: var(--rule-height);
    }
    &.rule-left {
      left: 0;
    }
  }
}
</style>
