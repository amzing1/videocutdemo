<template>
  <div class="timeline">
    <div class="video-controller">
      <button @click="init(allBlobs)">加载视频</button>
      <button @click="playVideo">
        {{ isPlaying ? "暂停" : "播放" }}
      </button>
      <input type="checkbox" v-model="dragMode" />
    </div>
    <div class="track-container">
      <TrackItem
        v-for="(c, idx) in clipMetas"
        :key="idx"
        :video-idx="idx"
        :duration="c?.duration || 0"
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

const { allBlobs } = storeToRefs(useVideoDataStore());
const { clipMetas, isPlaying, playVideo, init } = useFrameRender();
const { dragMode } = usePerformance();
</script>

<style lang="scss">
.timeline {
  .video-controller {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 32px;
    border-bottom: 1px solid #eee;
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
