<template>
  <div class="video-preview">
    <!-- <video
      ref="mediaRef"
      crossorigin="anonymous"
      muted
      :src="currentVideoUrl"
      data-testid="video"
      @loadeddata="handleLoadedData"
      @seeked="handleSeeked"
    ></video> -->
    <video
      v-for="vIdx in cachedIdxs"
      ref="videoRefs"
      crossorigin="anonymous"
      muted
      :src="videoUrls[vIdx]"
      preload="metadata"
      @loadeddata="handleLoadedData(vIdx)"
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
import { onMounted, ref } from "vue";

const { mediaRef, mediaCanvasRef, videoRefs } = storeToRefs(useMediaStore());
const { setCurMedia } = useMediaStore();
const { onVideoLoadedData, videoMeta } = useVideoStore();
const { cachedIdxs, videoUrls, currentVideoIdx } = storeToRefs(
  useVideoDataStore()
);
const { startTime, endTime, costTime } = usePerformance();

console.log(mediaRef, mediaCanvasRef, videoMeta);

onMounted(() => {
  setCurMedia(currentVideoIdx.value);
});

function handleLoadedData(idx: number) {
  if (idx === currentVideoIdx.value) {
    endTime.value = performance.now();
    onVideoLoadedData();
  }
}
function handleSeeked() {
  endTime.value = performance.now();
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
