import { defineStore } from "pinia";
import { computed, ref } from "vue";

export const useVideoDataStore = defineStore("videoDataStore", () => {
  const videoUrls = ref([
    "https://cdn.kesci.com/admin/t8mzcj10mk/1_processed.mp4",
    "https://cdn.kesci.com/admin/t8mzcj10mk/5_processed.mp4",
    // "https://cdn.kesci.com/admin/t8oqtrron/3.m3u8", // 直接转未降低码率
    "https://cdn.kesci.com/admin/t8oreay9r/3.m3u8", // 降低码率 ffmpeg -i 3.mp4 -c:v libx264 -g 60 -sc_threshold 0 -b:v 2000k -maxrate 2000k -bufsize 4000k -hls_time 2 -hls_list_size 0 3.m3u8
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
