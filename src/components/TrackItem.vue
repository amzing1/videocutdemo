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
  </div>
</template>

<script setup lang="ts">
import { useMouseInElement } from "@vueuse/core";
import { useTemplateRef } from "vue";
import { useVideoStore } from "../store/videoStore";
import { useVideoDataStore } from "../store/videoDataStore";
import { storeToRefs } from "pinia";
import { usePerformance } from "../hooks/usePerformance";
import { useMediaStore } from "../store/mediaStore";

const videoStore = useVideoStore();
const videoDataStore = useVideoDataStore();
const { currentVideoIdx } = storeToRefs(videoDataStore);
const { videoMeta } = storeToRefs(videoStore);
const { setTime } = videoStore;
const { startTime } = usePerformance();
const { setCurMedia } = useMediaStore();

const props = defineProps<{
  videoIdx: number;
}>();

const trackItemRef = useTemplateRef("track-item");

const { elementX, elementWidth } = useMouseInElement(trackItemRef);

function handleClickTrackItem() {
  startTime.value = performance.now();
  if (props.videoIdx === currentVideoIdx.value) {
    const persent = elementX.value / elementWidth.value;
    const time = videoMeta.value.duration * persent;
    setTime(time);
  } else {
    // TODO 动态缓存
    currentVideoIdx.value = props.videoIdx;
    setCurMedia(props.videoIdx);
  }
}
</script>
