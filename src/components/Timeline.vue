<template>
  <div class="timeline">
    <div class="video-controller">
      <button @click="loadClips">加载视频</button>
      <button @click="playVideo">
        {{ isPlaying ? "暂停" : "播放" }}
      </button>
      <div>模拟拖拽<input type="checkbox" v-model="dragMode" /></div>
    </div>
    <div class="track-container" v-if="loaded">
      <TrackItem
        v-for="(c, idx) in clipMetas"
        :key="idx"
        :video-idx="idx"
        :meta="c"
      ></TrackItem>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useFrameRender } from "../hooks/userFrameRender";
import { useVideoDataStore } from "../store/videoDataStore";
import TrackItem from "./TrackItem.vue";
import { usePerformance } from "../hooks/usePerformance";
import { ref } from "vue";

const { allBlobs } = storeToRefs(useVideoDataStore());
const { clipMetas, isPlaying, playVideo, init } = useFrameRender();
const { dragMode } = usePerformance();

const loaded = ref(false);

async function loadClips() {
  await init(allBlobs.value),
  loaded.value = true;
}
</script>

<style lang="scss">
.timeline {
  .video-controller {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 32px;
    border-bottom: 1px solid #eee;
    color: #fff;
    > * + * {
      margin-left: 12px;
    }
  }
  .track-container {
    overflow: auto;
    .track-item {
      height: 40px;
      background-color: #999;
      border: 1px solid #eee;
      color: #fff;
      text-align: center;
      & + .track-item {
        margin-top: 8px;
      }
    }
  }
}
</style>
