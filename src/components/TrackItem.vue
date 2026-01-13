<template>
  <div
    class="track-item"
    ref="track-item"
    @click="handleClickTrackItem"
    @mousemove="handleMousemove"
    :style="{
      width: 50 * meta.duration + 'px',
    }"
  >
    视频{{ videoIdx + 1 }}
    <canvas ref="canvasRef"></canvas>
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
import { computed, onMounted, useTemplateRef } from "vue";

import { useFrameRender } from "../hooks/userFrameRender";
import { usePerformance } from "../hooks/usePerformance";

const { curTime, renderAt, curClipIdx, clipMetas } = useFrameRender();
const { dragMode } = usePerformance();

const canvasRef = useTemplateRef('canvasRef');

const props = defineProps<{
  videoIdx: number;
  meta: {
    duration: number;
    width: number;
    height: number;
    thumbnails: {
      ts: number;
      img: Blob;
    }[]
  }
}>();

const trackItemRef = useTemplateRef("track-item");
const _handleMouseMove = useThrottleFn(handleClickTrackItem, 100);

const { elementX, elementWidth } = useMouseInElement(trackItemRef);

let ctx: CanvasRenderingContext2D | null = null;

onMounted(() => {
  if (!canvasRef.value) return;
  canvasRef.value.width = canvasRef.value.offsetWidth;
  canvasRef.value.height = canvasRef.value.offsetHeight;
  ctx = canvasRef.value!.getContext('2d')!;
  drawTrack();
})

const pointerLeft = computed(() => {
  return (curTime.value / props.meta.duration) * 100 + "%";
});

function handleClickTrackItem() {
  const persent = elementX.value / elementWidth.value;
  renderAt(props.videoIdx, props.meta.duration * persent);
}

function handleMousemove() {
  if (dragMode.value) {
    _handleMouseMove();
    // handleClickTrackItem();
  }
}

function drawTrack() {
  let x = 0;
  props.meta.thumbnails.forEach(async (v) => {
    if (ctx) {
      const bitmap = await createImageBitmap(v.img);
      const width = 40 * (props.meta.width / props.meta.height);
      ctx.drawImage(bitmap, x, 0, width, 40)
      x += width;
    }
  })
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
  canvas {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    // background-color: blue;
  }
}
</style>
