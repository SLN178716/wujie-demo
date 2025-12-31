<template>
  <div class="rule-container" :style="{ width: `${rw}px`, height: `${rh}px` }">
    <canvas ref="rule" />
  </div>
</template>

<script setup lang="ts">
import { ref, type Ref } from 'vue';
import type { DashboardCanvasRuleProps } from './types';
import { defaultScaleOption } from './constants';

defineOptions({
  name: 'DashboardCanvasRule',
});

const props = withDefaults(defineProps<DashboardCanvasRuleProps>(), {
  direction: 'row',
  scaleDirection: 'end',
  scaleOptions: () => defaultScaleOption,
});

const rule: Ref<HTMLCanvasElement | null> = ref(null);
const rw = ref(0);
const rh = ref(0);
const draw = (opt?: { width?: number; height?: number }) => {
  // 按照step大到小排序scaleOptions
  const scaleOptions = (props.scaleOptions || defaultScaleOption).sort((a, b) => b.step - a.step);
  const ruleWidth = opt?.width || props.width; // 尺子宽度
  const ruleHeight = opt?.height || props.height; // 尺子高度
  const horizontal = props.direction.startsWith('row'); // 是否水平
  const reverse = props.direction.endsWith('reverse'); // 是否反向
  const scaleStart = props.scaleDirection === 'start';

  const canvas = rule.value!;
  const ctx = canvas.getContext('2d')!;
  // 现根据原先的canvas大小进行擦除
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 设置新的画布宽高
  [canvas.width, canvas.height] = horizontal ? [ruleWidth, ruleHeight] : [ruleHeight, ruleWidth];
  rw.value = canvas.width;
  rh.value = canvas.height;

  let [h, hs] = reverse ? [ruleWidth, -1] : [0, 1],
    [v, vs] = scaleStart ? [0, 1] : [ruleHeight, -1];
  for (let i = 0; i <= ruleWidth; i++) {
    const si = h + hs * i;
    const so = scaleOptions.find((itm) => si % itm.step === 0);
    if (!so) continue;

    const [sx, sy, xs, ys] = horizontal ? [si, v, 0, vs] : [v, si, vs, 0];
    ctx.beginPath();
    ctx.moveTo(sx, sy);
    const [ex, ey] = [sx + xs * so.long, sy + ys * so.long];
    ctx.lineTo(ex, ey);
    ctx.strokeStyle = so.color || '#333333';
    ctx.stroke();

    if (!so.showNumber) continue;

    const font = `${si}`;
    const fontHeight = so.fontSize || 10;
    const fontWidth = (fontHeight * font.length) / 2;

    ctx.font = `${fontHeight}px`;
    ctx.fillStyle = so.fontColor || '#333333';

    const offset = Number(horizontal === scaleStart) * (horizontal ? fontHeight : fontWidth) + 3;
    ctx.fillText(font, ex + xs * offset, ey + ys * offset);
  }
};

defineExpose({
  draw,
});
</script>

<style lang="postcss" scoped>
.rule-container {
  overflow: hidden;
  width: 100%;
  height: 100%;
  flex-direction: column;
}
</style>
