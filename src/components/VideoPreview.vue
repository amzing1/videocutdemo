<template>
  <div class="video-preview">
    <video
      ref="mediaRef"
      crossorigin="anonymous"
      muted
      :src="currentVideoUrl"
      data-testid="video"
      preload="metadata"
      @loadeddata="handleLoadedData"
      @seeked="handleSeeked"
      @ended="handleCurVideoEnded"
    ></video>
    <canvas ref="mediaCanvasRef"></canvas>
    <div class="debug">
      <p>start: {{ startTime }}</p>
      <p>end: {{ endTime }}</p>
      <p>cost: {{ costTime }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useMediaStore } from "../store/mediaStore";
import { useVideoStore } from "../store/videoStore";
import { useVideoDataStore } from "../store/videoDataStore";
import { usePerformance } from "../hooks/usePerformance";

const { mediaRef, mediaCanvasRef } = storeToRefs(useMediaStore());
const { onVideoLoadedData, videoMeta, togglePlay } = useVideoStore();
const { currentVideoUrl, currentVideoIdx, videoUrls } = storeToRefs(
  useVideoDataStore()
);
const { startTime, endTime, costTime } = usePerformance();

console.log(mediaRef, mediaCanvasRef, videoMeta);

function handleLoadedData() {
  endTime.value = performance.now();
  onVideoLoadedData();
  if (videoMeta.autoPlay) {
    togglePlay();
  }
}
function handleSeeked() {
  endTime.value = performance.now();
}
function handleCurVideoEnded() {
  if (currentVideoIdx.value < videoUrls.value.length - 1) {
    currentVideoIdx.value += 1;
  }
}
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
