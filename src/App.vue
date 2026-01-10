<script setup lang="ts">
import VideoPreview from "./components/VideoPreview.vue";
import Timeline from "./components/Timeline.vue";
</script>

<template>
  <div class="video-cut-app">
    <VideoPreview></VideoPreview>
    <Timeline></Timeline>
  </div>
</template>

<style lang="scss">
.video-cut-app {
  width: 100vw;
  height: 100vh;
  .video-preview {
    height: 60vh;
    width: 100%;
  }
  .timeline {
    height: 40vh;
    width: 100%;
  }
}
</style>
