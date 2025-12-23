<template>
  <router-view />
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { onMounted, onUnmounted, watch } from 'vue';

const router = useRouter();
watch(
  () => router.currentRoute.value.path,
  (to_path) => {
    window.$wujie?.bus.$emit('sub-router-change', 'visual-display', to_path);
  },
  { immediate: true, deep: true }
);
onMounted(() => {
  window.$wujie?.bus.$on('visual-display-router-change', (to_path: string) => {
    console.log('visual-display-router-change', to_path);
    router.push({ path: to_path });
  });
});
onUnmounted(() => {
  window.$wujie?.bus.$off('visual-display-router-change');
});
</script>

<style scoped></style>
