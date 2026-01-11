import { defineStore } from "pinia";
import { computed, ref } from "vue";

export const useVideoDataStore = defineStore("videoDataStore", () => {
  const videoUrls = ref([
    "https://cdn.kesci.com/admin/t8piq7gl1/1.m3u8",
    "https://cdn.kesci.com/admin/t8pis4dk0/2.m3u8",
    "https://cdn.kesci.com/admin/t8pito7cd/3.m3u8",
    "https://cdn.kesci.com/admin/t8piu61bjc/4.m3u8",
    "https://cdn.kesci.com/admin/t8piugo1o/5.m3u8",
    "https://cdn.kesci.com/admin/t8piuspl9/6.m3u8",
    "https://cdn.kesci.com/admin/t8piv1hzw/7.m3u8",
    "https://cdn.kesci.com/admin/t8pivaz1u/8.m3u8",
    "https://cdn.kesci.com/admin/t8pivlqe3/9.m3u8",
    "https://cdn.kesci.com/admin/t8pivx7cd/10.m3u8",
  ]);

  const currentVideoIdx = ref(0);

  const currentVideoUrl = computed(
    () => videoUrls.value[currentVideoIdx.value]
  );

  async function setVideoIdx(idx: number) {}

  return {
    videoUrls,
    currentVideoIdx,
    currentVideoUrl,
  };
});
