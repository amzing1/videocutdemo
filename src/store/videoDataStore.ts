import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { useVideoCache } from "../hooks/useVideoCache";

export const useVideoDataStore = defineStore("videoDataStore", () => {
  const { getVideo } = useVideoCache();

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

  const allBlobs = ref<Blob[]>([]);

  const currentVideoIdx = ref(0);

  const currentBlob = computed(() => allBlobs.value[currentVideoIdx.value]);

  async function addAllVideos() {
    videoUrls.value.forEach(async (v, i) => {
      allBlobs.value[i] = await getVideo(v, v);
    });
  }

  addAllVideos();

  return {
    videoUrls,
    currentVideoIdx,
    currentBlob,
    allBlobs,
    addAllVideos,
  };
});
