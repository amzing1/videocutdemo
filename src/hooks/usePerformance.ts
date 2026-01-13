import { createSharedComposable } from "@vueuse/core";
import { computed, ref } from "vue";

export const usePerformance = createSharedComposable(() => {
  const startTime = ref(0);
  const endTime = ref(0);

  const costTime = computed(() => ((endTime.value - startTime.value) / 1000).toFixed(2));

  const dragMode = ref(false);

  return {
    startTime,
    endTime,
    costTime,
    dragMode,
  };
});
