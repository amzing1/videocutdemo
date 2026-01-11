<template>
  <div
    class="track-item"
    ref="track-item"
    @click="handleClickTrackItem"
    :style="{
      width: '800px',
    }"
  >
    视频{{ videoIdx + 1 }}
    <div
      class="pointer"
      v-if="currentVideoIdx === videoIdx"
      :style="{
        left: pointerLeft,
      }"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { useMouseInElement } from "@vueuse/core";
import { computed, useTemplateRef } from "vue";
import { useVideoStore } from "../store/videoStore";
import { useVideoDataStore } from "../store/videoDataStore";
import { storeToRefs } from "pinia";
import { usePerformance } from "../hooks/usePerformance";

const videoStore = useVideoStore();
const videoDataStore = useVideoDataStore();
const { currentVideoIdx } = storeToRefs(videoDataStore);
const { videoMeta } = storeToRefs(videoStore);
const { setTime } = videoStore;
const { startTime } = usePerformance();

const props = defineProps<{
  videoIdx: number;
}>();

const trackItemRef = useTemplateRef("track-item");

const { elementX, elementWidth } = useMouseInElement(trackItemRef);

const pointerLeft = computed(() => {
  return (videoMeta.value.curTime / videoMeta.value.duration) * 100 + "%";
});

function handleClickTrackItem() {
  startTime.value = performance.now();
  if (props.videoIdx === currentVideoIdx.value) {
    const persent = elementX.value / elementWidth.value;
    const time = videoMeta.value.duration * persent;
    setTime(time);
  } else {
    currentVideoIdx.value = props.videoIdx;
  }
}
</script>

<style lang="scss">
.track-item {
  position: relative;
  .pointer {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 2px;
    background-color: red;
  }
}
</style>
