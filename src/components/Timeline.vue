<template>
  <div class="timeline">
    <div class="video-controller">
      <button @click="addVideo">加载下一个视频</button>
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
const { addVideo } = videoDataStore


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
      height: 24px;
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
