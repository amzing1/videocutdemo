import { defineStore } from "pinia";
import { computed, ref } from "vue";

export const useVideoDataStore = defineStore("videoDataStore", () => {
  const videoUrls = ref([
    "https://cdn.kesci.com/admin/t8mzcj10mk/1_processed.mp4",
    "https://cdn.kesci.com/admin/t8mzcj10mk/5_processed.mp4",
    "https://cdn.kesci.com/admin/t8mzcj10mk/3_processed.mp4",
    "https://cdn.kesci.com/admin/t8mzcj10mk/4_processed.mp4",
    "https://cdn.kesci.com/admin/t8mzcj10mk/7_processed.mp4",
    "https://cdn.kesci.com/admin/t8mzcj10mk/8_processed.mp4",
    "https://cdn.kesci.com/admin/t8mzcj10mk/9_processed.mp4",
    "https://cdn.kesci.com/admin/t8mzcj10mk/10_processed.mp4",
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
