import { createSharedComposable } from "@vueuse/core";
import { MP4Clip } from "@webav/av-cliper";
import { computed, ref, shallowRef } from "vue";

interface ClipMeta {
  duration: number;
  id: number;
}

export const useFrameRender = createSharedComposable(() => {
  const clips: MP4Clip[] = [];
  const clipMetas = ref<ClipMeta[]>([]);
  const curClipIdx = ref(0);
  const curClip = computed(() => clipMetas.value[curClipIdx.value]);
  const curTime = ref(0);
  const isPlaying = ref(false);

  let canvasCtx: CanvasRenderingContext2D | null = null;

  function setCanvas(canvas: HTMLCanvasElement) {
    canvasCtx = canvas.getContext("2d")!;
  }

  async function init(blobs: Blob[]) {
    const loadClip = async (blob: Blob, id: number) => {
      const clip = new MP4Clip(blob.stream());
      await clip.ready;
      clips[id] = clip;
      clipMetas.value[id] = {
        duration: clip.meta.duration / 1000000,
        id,
      };
    };

    blobs.forEach((v, i) => {
      loadClip(v, i);
    });
  }

  async function renderAt(key: number, time: number) {
    if (!canvasCtx) {
      return;
    }

    const clip = clips[key]!;
    curTime.value = time;
    curClipIdx.value = key;

    const { video, state } = await clip.tick(time * 1000000);

    if (state === "success" && video) {
      const [w, h, cw, ch, dx, dy] = getViewport(video!);
      canvasCtx.clearRect(
        0,
        0,
        canvasCtx.canvas.width,
        canvasCtx.canvas.height
      );

      canvasCtx.drawImage(video, 0, 0, w, h, dx, dy, cw, ch);
      video.close();
    }
  }

  async function playVideo() {
    isPlaying.value = true;

    const startTime = curTime.value * 1000;
    let _time = performance.now();

    const tick = async () => {
      const dis = performance.now() - _time;
      const targetTime = (curTime.value * 1000 + dis) / 1000;
      if (targetTime >= curClip.value!.duration) {
        isPlaying.value = false;
        return;
      }
      await renderAt(curClipIdx.value, targetTime);
      _time = performance.now();
      requestAnimationFrame(tick);
    };

    tick();
  }

  function getViewport(
    video: VideoFrame
  ): [number, number, number, number, number, number] {
    if (!canvasCtx) return [0, 0, 0, 0, 0, 0];

    let mediaRate = 1;
    const { displayWidth: w, displayHeight: h } = video;
    mediaRate = w / h;
    const canvas = canvasCtx.canvas as HTMLCanvasElement;
    const ow = canvas.offsetWidth;
    const oh = canvas.offsetHeight;
    canvasCtx.canvas.width = ow;
    canvasCtx.canvas.height = oh;
    let [dx, dy, cw, ch] = [0, 0, ow, oh];
    if (w < ow && h < oh) {
      // 尺寸小的图片或视频展示在可视区域中间
      cw = w;
      ch = h;
      dx = (ow - cw) / 2;
      dy = (oh - ch) / 2;
    } else if (ow / oh >= mediaRate) {
      // 可视区域高度占满，左右居中
      ch = oh;
      cw = ch * mediaRate;
      dx = (ow - cw) / 2;
      dy = 0;
    } else {
      // 可视区域宽度占满，上下居中
      cw = ow;
      ch = cw / mediaRate;
      dx = 0;
      dy = (oh - ch) / 2;
    }

    return [w, h, cw, ch, dx, dy];
  }

  // function destroy() {
  //   clip?.destroy();
  // }

  return {
    clips,
    clipMetas,
    curClip,
    curClipIdx,
    curTime,
    isPlaying,
    init,
    setCanvas,
    renderAt,
    playVideo,
  };
});
