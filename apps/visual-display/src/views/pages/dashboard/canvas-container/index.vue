<template>
  <div class="dashboard-canvas-container">
    <rule ref="rule1" :width="200" :height="50" scale-direction="start" direction="row" :scale-options="scales" />
    <rule ref="rule2" :width="200" :height="50" scale-direction="end" direction="row" :scale-options="scales" />
    <rule ref="rule3" :width="200" :height="50" scale-direction="start" direction="row-reverse" :scale-options="scales" />
    <rule ref="rule4" :width="200" :height="50" scale-direction="end" direction="row-reverse" :scale-options="scales" />
    <div style="display: flex; flex-direction: row; flex-wrap: nowrap">
      <rule ref="rule5" :width="200" :height="50" scale-direction="start" direction="column" :scale-options="scales" />
      <rule ref="rule6" :width="200" :height="50" scale-direction="end" direction="column" :scale-options="scales" />
      <rule ref="rule7" :width="200" :height="50" scale-direction="start" direction="column-reverse" :scale-options="scales" />
      <rule ref="rule8" :width="200" :height="50" scale-direction="end" direction="column-reverse" :scale-options="scales" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, type Ref } from 'vue';
import Rule from './rule/index.vue';

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
const rule1: Ref<typeof Rule | null> = ref(null);
const rule2: Ref<typeof Rule | null> = ref(null);
const rule3: Ref<typeof Rule | null> = ref(null);
const rule4: Ref<typeof Rule | null> = ref(null);
const rule5: Ref<typeof Rule | null> = ref(null);
const rule6: Ref<typeof Rule | null> = ref(null);
const rule7: Ref<typeof Rule | null> = ref(null);
const rule8: Ref<typeof Rule | null> = ref(null);
onMounted(() => {
  rule1.value?.draw();
  rule2.value?.draw();
  rule3.value?.draw();
  rule4.value?.draw();
  rule5.value?.draw();
  rule6.value?.draw();
  rule7.value?.draw();
  rule8.value?.draw();
});

defineOptions({
  name: 'DashboardCanvasContainerIndex',
});
</script>

<style lang="postcss" scoped>
.dashboard-canvas-container {
  width: 100%;
  height: 100%;
}
</style>
