import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { videoCache } from "../utils/VideoCacheManager";

export const useVideoDataStore = defineStore("videoDataStore", () => {
  const videoUrls = ref([
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

  const currentVideoUrl = ref('');
  const progress = ref(0);

  async function addVideo() {
    const url = videoUrls.value[currentVideoIdx.value]!;
    currentVideoUrl.value = await videoCache.getVideo(url, url, (p) => {
      progress.value = p;
    })
  }

  return {
    videoUrls,
    currentVideoIdx,
    currentVideoUrl,
    addVideo
  };
});
