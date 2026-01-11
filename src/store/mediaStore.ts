import { defineStore } from "pinia";
import { reactive, ref } from "vue";

export const useMediaStore = defineStore("mediaStore", () => {
  const canvasPos = reactive({
    w: 0,
    h: 0,
    dx: 0,
    dy: 0,
  });
  const mediaSize = reactive({
    w: 0,
    h: 0,
  });

  const videoRefs = ref<HTMLVideoElement[]>([]);
  // img 或 video 标签
  const mediaRef = ref<HTMLVideoElement | null>(null);
  // 用于展示图片或者视频的 canvas 元素
  const mediaCanvasRef = ref<HTMLCanvasElement | null>(null);

  function setCurMedia(idx: number) {
    mediaRef.value = videoRefs.value[idx]!;
    onChangeCanvasSize();
  }
  function onMediaLoaded() {
    onChangeCanvasSize();
  }
  function onChangeCanvasSize() {
    if (!mediaRef.value || !mediaCanvasRef.value) {
      return;
    }

    mediaSize.w = mediaRef.value.videoWidth;
    mediaSize.h = mediaRef.value.videoHeight;

    mediaCanvasRef.value.width = mediaRef.value.parentElement!.offsetWidth;
    mediaCanvasRef.value.height = mediaRef.value.parentElement!.offsetHeight;
    draw();
  }
  function draw() {
    const innerDraw = () => {
      if (!mediaCanvasRef.value || !mediaRef.value) return;
      const mediaCtx = mediaCanvasRef.value.getContext("2d")!;
      mediaCtx.save();
      mediaCtx.clearRect(
        0,
        0,
        mediaCtx.canvas.offsetWidth,
        mediaCtx.canvas.offsetHeight
      );
      const [w, h, cw, ch, dx, dy] = getViewport() as [
        number,
        number,
        number,
        number,
        number,
        number
      ];
      canvasPos.w = cw;
      canvasPos.h = ch;
      canvasPos.dx = dx;
      canvasPos.dy = dy;

      mediaCtx.drawImage(mediaRef.value, 0, 0, w, h, dx, dy, cw, ch);
      mediaCtx.restore();
    };
    innerDraw();
  }
  function getViewport() {
    mediaRef.value = mediaRef.value!;
    mediaCanvasRef.value = mediaCanvasRef.value!;
    let mediaRate = 1;
    const { w, h } = mediaSize;
    mediaRate = w / h;
    const ow = mediaRef.value.offsetWidth;
    const oh = mediaRef.value.offsetHeight;
    let [dx, dy, cw, ch] = [0, 0, ow, oh];
    if (
      w < mediaCanvasRef.value.offsetWidth &&
      h < mediaCanvasRef.value.offsetHeight
    ) {
      // 尺寸小的图片或视频展示在可视区域中间
      cw = w;
      ch = h;
      dx = (mediaCanvasRef.value.offsetWidth - cw) / 2;
      dy = (mediaCanvasRef.value.offsetHeight - ch) / 2;
    } else if (
      mediaCanvasRef.value.offsetWidth / mediaCanvasRef.value.offsetHeight >=
      mediaRate
    ) {
      // 可视区域高度占满，左右居中
      ch = mediaCanvasRef.value.offsetHeight;
      cw = ch * mediaRate;
      dx = (mediaCanvasRef.value.width - cw) / 2;
      dy = 0;
    } else {
      // 可视区域宽度占满，上下居中
      cw = mediaCanvasRef.value.offsetWidth;
      ch = cw / mediaRate;
      dx = 0;
      dy = (mediaCanvasRef.value.height - ch) / 2;
    }
    canvasPos.w = cw;
    canvasPos.h = ch;
    canvasPos.dx = dx;
    canvasPos.dy = dy;

    return [w, h, cw, ch, dx, dy];
  }

  window.addEventListener("resize", onChangeCanvasSize);

  return {
    videoRefs,
    mediaRef,
    mediaCanvasRef,
    canvasPos,
    mediaSize,
    onMediaLoaded,
    draw,
    setCurMedia,
  };
});
