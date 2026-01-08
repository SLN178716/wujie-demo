<template>
  <el-container class="dashboard-container">
    <!-- <el-header> 顶部工具栏 </el-header> -->
    <el-container>
      <!-- <el-aside width="200px">左侧视图</el-aside> -->
      <el-main style="--el-main-padding: 0">
        <!-- 画布空间 -->
        <canvasContainer />
      </el-main>
      <!-- <el-aside width="200px">右侧属性栏</el-aside> -->
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import canvasContainer from './canvas-container/index.vue';
defineOptions({
  name: 'DashboardIndex',
});
</script>

<style lang="postcss" scoped>
.dashboard-container {
  width: 100vw;
  height: 100vh;
}
</style>
