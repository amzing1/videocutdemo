import { defineStore } from "pinia";
import { computed, ref } from "vue";

export const useVideoDataStore = defineStore("videoDataStore", () => {
  const videoUrls = ref([
    // "https://cdn.kesci.com/admin/t8mzcj10mk/1_processed.mp4",
    // "https://cdn.kesci.com/admin/t8mzcj10mk/5_processed.mp4",
    // "https://cdn.kesci.com/admin/t8mzcj10mk/3_processed.mp4",
    // "https://cdn.kesci.com/admin/t8orv3i4b/3_low_bitrate.mp4",
    // "https://cdn.kesci.com/admin/t8mzcj10mk/4_processed.mp4",
    // "https://cdn.kesci.com/admin/t8mzcj10mk/7_processed.mp4",
    // "https://cdn.kesci.com/admin/t8mzcj10mk/8_processed.mp4",
    // "https://cdn.kesci.com/admin/t8mzcj10mk/9_processed.mp4",
    // "https://cdn.kesci.com/admin/t8mzcj10mk/10_processed.mp4",
    "https://cdn.kesci.com/admin/t8phuh1d1r/1_low_bitrate.mp4",
    "https://cdn.kesci.com/admin/t8phuh1d1r/2_low_bitrate.mp4",
    "https://cdn.kesci.com/admin/t8phuh1d1r/3_low_bitrate.mp4",
    "https://cdn.kesci.com/admin/t8phuh1d1r/4_low_bitrate.mp4",
    "https://cdn.kesci.com/admin/t8phuh1d1r/5_low_bitrate.mp4",
    "https://cdn.kesci.com/admin/t8phuh1d1r/6_low_bitrate.mp4",
    "https://cdn.kesci.com/admin/t8phuh1d1r/7_low_bitrate.mp4",
    "https://cdn.kesci.com/admin/t8phuh1d1r/8_low_bitrate.mp4",
    "https://cdn.kesci.com/admin/t8phuh1d1r/9_low_bitrate.mp4",
    "https://cdn.kesci.com/admin/t8phuh1d1r/10_low_bitrate.mp4",
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
