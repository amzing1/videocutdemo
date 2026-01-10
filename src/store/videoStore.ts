import { defineStore, storeToRefs } from "pinia";
import { computed, reactive } from "vue";
import { useMediaStore } from "./mediaStore";
export const useVideoStore = defineStore("video", () => {
  const { mediaRef } = storeToRefs(useMediaStore());
  const { onMediaLoaded, draw } = useMediaStore();
  const videoMeta = reactive({
    curTime: 0,
    totalFrameCount: 0,
    zoomRate: 1,
    isPlaying: false,
    duration: 0,
  });
  let isFirstLoaded = true;

  async function onVideoLoadedData() {
    if (!mediaRef.value) return;
    onMediaLoaded();
    videoMeta.duration = (mediaRef.value as HTMLVideoElement).duration;
    if (isFirstLoaded) {
      drawVideo();
      isFirstLoaded = false;
    }
  }
  function drawVideo() {
    const innerDraw = () => {
      if (!mediaRef.value) return;
      draw();
      mediaRef.value = mediaRef.value as HTMLVideoElement;
      if (videoMeta.isPlaying) {
        videoMeta.curTime = mediaRef.value.currentTime;
      }
      videoMeta.isPlaying = !mediaRef.value.paused;
      requestAnimationFrame(innerDraw);
    };
    innerDraw();
  }
  function togglePlay() {
    if (!mediaRef.value) return;
    mediaRef.value = mediaRef.value;
    mediaRef.value.paused ? mediaRef.value.play() : mediaRef.value.pause();
  }
  function setTime(time: number) {
    if (!mediaRef.value) return;
    mediaRef.value = mediaRef.value;
    mediaRef.value.currentTime = time;
    videoMeta.curTime = mediaRef.value.currentTime;
  }
  return {
    videoMeta,
    onMediaLoaded,
    onVideoLoadedData,
    togglePlay,
    setTime,
  };
});
