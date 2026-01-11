import { defineStore } from "pinia";
import { computed, ref } from "vue";

export const useVideoDataStore = defineStore("videoDataStore", () => {
  const videoUrls = ref([
    "https://cdn.kesci.com/admin/t8mzcj10mk/1_processed.mp4",
    "https://cdn.kesci.com/admin/t8mzcj10mk/5_processed.mp4",
    "https://cdn.kesci.com/admin/t8mzcj10mk/3_processed.mp4",
    "https://cdn.kesci.com/admin/t8orv3i4b/3_low_bitrate.mp4",
    "https://cdn.kesci.com/admin/t8mzcj10mk/4_processed.mp4",
    "https://cdn.kesci.com/admin/t8mzcj10mk/7_processed.mp4",
    "https://cdn.kesci.com/admin/t8mzcj10mk/8_processed.mp4",
    "https://cdn.kesci.com/admin/t8mzcj10mk/9_processed.mp4",
    "https://cdn.kesci.com/admin/t8mzcj10mk/10_processed.mp4",
  ]);

  const cachedIdxs = ref([0, 1, 2, 3, 4]);

  const currentVideoIdx = ref(0);

  const currentVideoUrl = computed(
    () => videoUrls.value[currentVideoIdx.value]
  );

  async function setVideoIdx(idx: number) {
    let targets: number[] = [];
    if (idx <= 2) {
      targets = [0, 1, 2, 3, 4];
    } else if (idx >= videoUrls.value.length - 3) {
      targets = [4, 3, 2, 1, 0].map((v) => videoUrls.value.length - 1 - v);
    } else {
      targets = [idx - 2, idx - 1, idx, idx + 1, idx + 2];
    }

    const needAdded: number[] = [];
    const needDelIdxs: number[] = [];
    for (let i = 0; i < targets.length; i++) {
      const idx = cachedIdxs.value.findIndex((v) => v === targets[i]);
      if (idx < 0) {
        needAdded.push(targets[i]!);
      }
    }
    for (let i = 0; i < cachedIdxs.value.length; i++) {
      const idx = targets.findIndex((v) => v === cachedIdxs.value[i]);
      if (idx < 0) {
        needDelIdxs.push(i);
      }
    }
    for (let i = 0; i < needDelIdxs.length; i++) {
      cachedIdxs.value[needDelIdxs[i]!] = needAdded[i]!;
    }
    currentVideoIdx.value = idx;
  }

  return {
    videoUrls,
    currentVideoIdx,
    currentVideoUrl,
    cachedIdxs,
    setVideoIdx,
  };
});
