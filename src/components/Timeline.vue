<template>
  <div class="timeline">
    <div class="video-controller">
      <div>模拟进度条拖拽模式： <input type="checkbox" v-model="videoMeta.moveMode"></div>
      <button @click="togglePlay">
        {{ videoMeta.isPlaying ? "暂停" : "播放" }}
      </button>
    </div>
    <div class="track-container">
      <TrackItem
        v-for="(_, idx) in videoUrls"
        :key="idx"
        :video-idx="idx"
      ></TrackItem>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useVideoStore } from "../store/videoStore";
import { useVideoDataStore } from "../store/videoDataStore";
import TrackItem from "./TrackItem.vue";

const videoStore = useVideoStore();
const videoDataStore = useVideoDataStore();
const { videoUrls } = storeToRefs(videoDataStore);
const { videoMeta } = storeToRefs(videoStore);
const { togglePlay } = videoStore;
</script>

<style lang="scss">
.timeline {
  color: #fff;
  .video-controller {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 32px;
    border-bottom: 1px solid #eee;
    > * + * {
      margin-left: 24px;
    }
  }
  .track-container {
    overflow: auto;
    .track-item {
      height: 24px;
      background-color: #999;
      border: 1px solid #eee;
      
      text-align: center;
      & + .track-item {
        margin-top: 8px;
      }
    }
  }
}
</style>
