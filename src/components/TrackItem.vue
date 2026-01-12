<template>
  <div
    class="track-item"
    ref="track-item"
    @click="handleClickTrackItem"
    @mousemove="handleMousemove"
    :style="{
      width: 40 * duration + 'px',
    }"
  >
    视频{{ videoIdx + 1 }}
    <div
      class="pointer"
      v-if="curClipIdx === videoIdx"
      :style="{
        left: pointerLeft,
      }"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { useMouseInElement, useThrottleFn } from "@vueuse/core";
import { computed, useTemplateRef } from "vue";
import { useVideoDataStore } from "../store/videoDataStore";
import { storeToRefs } from "pinia";

import { useFrameRender } from "../hooks/userFrameRender";
import { usePerformance } from "../hooks/usePerformance";

const videoDataStore = useVideoDataStore();
const { curTime, renderAt, curClipIdx } = useFrameRender();
const { dragMode } = usePerformance();

const props = defineProps<{
  videoIdx: number;
  duration: number;
}>();

const trackItemRef = useTemplateRef("track-item");
const _handleMouseMove = useThrottleFn(handleClickTrackItem, 100);

const { elementX, elementWidth } = useMouseInElement(trackItemRef);

const pointerLeft = computed(() => {
  return (curTime.value / props.duration) * 100 + "%";
});

function handleClickTrackItem() {
  const persent = elementX.value / elementWidth.value;
  renderAt(props.videoIdx, props.duration * persent);
}

function handleMousemove() {
  if (dragMode.value) {
    // _handleMouseMove();
    handleClickTrackItem();
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
