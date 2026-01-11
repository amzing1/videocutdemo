import { defineStore, storeToRefs } from "pinia";
import { computed, reactive } from "vue";
import { useMediaStore } from "./mediaStore";
import { useVideoDataStore } from "./videoDataStore";
export const useVideoStore = defineStore("video", () => {
  const { mediaRef } = storeToRefs(useMediaStore());
  const { onMediaLoaded, draw, setCurMedia } = useMediaStore();
  const { cachedIdxs } = storeToRefs(useVideoDataStore());
  const videoMeta = reactive({
    curTime: 0,
    totalFrameCount: 0,
    zoomRate: 1,
    isPlaying: false,
    duration: 0,
    autoPlay: false,
  });
  let isFirstLoaded = true;

  function setCurVideo(idx: number) {
    if (!mediaRef.value) return;
    const videoTagIdx = cachedIdxs.value.findIndex((v) => v === idx);
    setCurMedia(videoTagIdx);
    videoMeta.duration = (mediaRef.value as HTMLVideoElement).duration;
    if (isFirstLoaded) {
      drawVideo();
      isFirstLoaded = false;
    }
  }
  // async function onVideoLoadedData() {
  //   if (!mediaRef.value) return;
  //   onMediaLoaded();
  //   videoMeta.duration = (mediaRef.value as HTMLVideoElement).duration;
  //   if (isFirstLoaded) {
  //     drawVideo();
  //     isFirstLoaded = false;
  //   }
  // }
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
    if (mediaRef.value.paused) {
      videoMeta.autoPlay = true;
      mediaRef.value.play();
    } else {
      videoMeta.autoPlay = false;
      mediaRef.value.pause();
    }
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
    setCurVideo,
    togglePlay,
    setTime,
  };
});
