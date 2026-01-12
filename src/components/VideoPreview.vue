<template>
  <div class="video-preview">
    <video
      v-for="(vIdx, idx) in cachedIdxs"
      ref="videoRefs"
      crossorigin="anonymous"
      muted
      :src="videoUrls[vIdx]"
      preload="metadata"
      @loadeddata="handleLoadedData(vIdx)"
      @ended="handleCurVideoEnded"
      @seeked="handleSeeked(vIdx)"
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
const { setCurVideo, videoMeta } = useVideoStore();
const { cachedIdxs, videoUrls, currentVideoIdx } = storeToRefs(
  useVideoDataStore()
);
const { setVideoIdx } = useVideoDataStore();
const { startTime, endTime, costTime } = usePerformance();

console.log(mediaRef, mediaCanvasRef, videoMeta);

onMounted(() => {
  setCurMedia(currentVideoIdx.value);
});

function handleLoadedData(idx: number) {
  console.log("handleLoadedData", idx, currentVideoIdx.value);

  if (idx === currentVideoIdx.value) {
    setCurVideo(idx);
  }
}
function handleSeeked(idx: number) {
  if (idx === currentVideoIdx.value) {
    endTime.value = performance.now();
  }
}
function handleCurVideoEnded() {
  if (currentVideoIdx.value < videoUrls.value.length - 1) {
    const idx = currentVideoIdx.value + 1;
    setVideoIdx(idx);
    setCurVideo(idx);
    if (videoMeta.autoPlay) {
      mediaRef.value?.play();
    }
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
    background-color: transparent;
  }

  // video {
  //   position: unset;
  //   width: 100px;
  //   visibility: visible;
  // }

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
