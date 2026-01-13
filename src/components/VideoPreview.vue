<template>
  <div class="video-preview">
    <canvas ref="canvasRef"></canvas>
    <div class="debug">
      提取视频帧花费时间：{{ costTime }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, useTemplateRef } from "vue";
import { useFrameRender } from "../hooks/userFrameRender";
import { usePerformance } from "../hooks/usePerformance";

const { setCanvas } = useFrameRender();
const canvasRef = useTemplateRef("canvasRef");
const { costTime } = usePerformance();

onMounted(() => {
  setCanvas(canvasRef.value!);
});
</script>

<style lang="scss">
.video-preview {
  position: relative;
  border-bottom: 1px solid #eee;
  video,
  canvas {
    visibility: hidden;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
  canvas {
    visibility: visible;
  }
  .debug {
    position: absolute;
    top: 12px;
    right: 12px;
    color: #fff;
    background-color: #000;
    padding: 12px;
  }
}
</style>
