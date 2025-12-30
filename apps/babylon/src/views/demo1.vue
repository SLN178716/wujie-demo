<template>
  <div v-resize="resize" class="demo1-container">
    <canvas ref="canvasRef" class="babylon-canvas" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { Engine, Scene, type SceneOptions, ArcRotateCamera, Vector3, HemisphericLight, MeshBuilder, Color4 } from '@babylonjs/core';

defineOptions({
  name: 'BabylonDemo1',
});

class Babylon {
  readonly engine: Engine;
  private scenes: Map<string, Scene>;

  constructor(...args: ConstructorParameters<typeof Engine>) {
    console.log(args[0]);
    this.engine = new Engine(...args);
    this.scenes = new Map();
  }

  newScene(option?: SceneOptions & { key?: string }) {
    const k = option?.key || '__default';
    if (this.scenes.has(k)) throw new Error(`Duplicate  scene key: ${k}`);
    const scene = option ? new Scene(this.engine, option) : new Scene(this.engine);
    this.scenes.set(k, scene);
  }

  getScene(key?: string): Scene {
    const k = key || '__default';
    const scene = this.scenes.get(k);
    if (!scene) throw new Error(`Undefined scene key: ${k}`);
    return scene;
  }

  resize() {
    this.engine.resize();
  }
}

const canvasRef = ref(null);
let babylon: Babylon;
const init = () => {
  babylon = new Babylon(canvasRef.value);
  babylon.newScene();
  const camera = new ArcRotateCamera('camera1', Math.PI / 2, Math.PI / 4, 5, Vector3.Zero(), babylon.getScene());
  camera.attachControl(canvasRef.value, true);
  const light = new HemisphericLight('light1', Vector3.Up(), babylon.getScene());
  light.intensity = 0.7;
  MeshBuilder.CreateBox('box', { size: 2 }, babylon.getScene());
  const sphere = MeshBuilder.CreateSphere('sphere', { segments: 100, arc: 0.3, slice: 0.5, sideOrientation: 2 }, babylon.getScene());
  sphere.position = new Vector3(3, 3, 3);
  MeshBuilder.CreateLines('x', { points: [new Vector3(0, 0, 0), new Vector3(100, 0, 0)], colors: [new Color4(255, 255, 255, 1), new Color4(255, 255, 255, 1)] });
  // MeshBuilder.CreateLines('y', { points: [new Vector3(0, 0, 0), new Vector3(0, 100, 0)], colors: [new Color4(255, 255, 255, 1), new Color4(255, 255, 255, 1)] });
  MeshBuilder.CreateLines('z', { points: [new Vector3(0, 0, 0), new Vector3(0, 0, 100)], colors: [new Color4(255, 255, 255, 1), new Color4(255, 255, 255, 1)] });
  babylon.engine.runRenderLoop(() => {
    babylon.getScene().render();
  });
};
const resize = () => {
  babylon.resize();
};

onMounted(init);
</script>

<style lang="postcss" scoped>
.demo1-container {
  width: 100%;
  height: 100%;

  .babylon-canvas {
    width: 100%;
    height: 100%;
  }
}
</style>
