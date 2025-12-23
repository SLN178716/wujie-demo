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
    window.$wujie?.bus.$emit('sub-router-change', 'chat', to_path);
  },
  { immediate: true, deep: true }
);
onMounted(() => {
  window.$wujie?.bus.$on('chat-router-change', (to_path: string) => {
    router.push({ path: to_path });
  });
});
onUnmounted(() => {
  window.$wujie?.bus.$off('chat-router-change');
});
</script>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
