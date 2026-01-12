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

  const cachedIdxs = ref([0, 1, 2, 3, 4]);

  const currentVideoIdx = ref(0);

  /**当前是否有 video 标签缓存，若无，需等待 loadedData 事件完成后才绘制，防止黑屏 */
  const curHasCache = ref(true);

  const currentVideoUrl = computed(
    () => videoUrls.value[currentVideoIdx.value]
  );

  async function setVideoIdx(idx: number) {
    curHasCache.value = cachedIdxs.value.includes(idx);

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
    curHasCache,
    setVideoIdx,
  };
});
