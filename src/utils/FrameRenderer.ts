import { MP4Clip } from "@webav/av-cliper";

export class VideoFrameRenderer {
  private clip: MP4Clip | null = null;
  private canvasCtx:
    | CanvasRenderingContext2D
    | OffscreenCanvasRenderingContext2D
    | null = null;
  private clipMap: Map<number, MP4Clip> = new Map();

  setCanvas(canvas: HTMLCanvasElement | OffscreenCanvas) {
    this.canvasCtx = canvas.getContext("2d")!;
  }

  /**
   * 渲染特定时间的视频帧
   */
  async renderAt(blob: Blob, key: number, time: number) {
    if (!this.canvasCtx) {
      return;
    }

    if (!this.clipMap.has(key)) {
      // 1. 直接用 Blob 创建 Clip 对象
      this.clip = new MP4Clip(blob.stream());
      this.clipMap.set(key, this.clip);
      // 2. 等待初始化（自动完成 Demux 和 Decoder 配置）
      await this.clip.ready;
    } else {
      this.clip = this.clipMap.get(key)!;
    }

    // 3. tick 会返回指定时间点的帧数据
    // time 单位是微秒 (µs)，所以秒要乘以 1,000,000
    const { video, state } = await this.clip.tick(time * 1000000);
    console.log(this.clip);
    const [w, h, cw, ch, dx, dy] = this.getViewport(video!);
    if (state === "success" && video) {
      console.log(video);
      this.canvasCtx.clearRect(
        0,
        0,
        this.canvasCtx.canvas.width,
        this.canvasCtx.canvas.height
      );
      // video 直接就是一个 VideoFrame 对象

      this.canvasCtx.drawImage(video, 0, 0, w, h, dx, dy, cw, ch);

      // 注意：WebAV 的 tick 内部会管理 frame 的释放，
      // 但如果你是手动操作，通常需要确认是否需要销毁
    }
  }

  getViewport(
    video: VideoFrame
  ): [number, number, number, number, number, number] {
    if (!this.canvasCtx) return [0, 0, 0, 0, 0, 0];

    let mediaRate = 1;
    const { displayWidth: w, displayHeight: h } = video;
    mediaRate = w / h;
    const canvas = this.canvasCtx.canvas as HTMLCanvasElement;
    const ow = canvas.offsetWidth;
    const oh = canvas.offsetHeight;
    this.canvasCtx.canvas.width = ow;
    this.canvasCtx.canvas.height = oh;
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

  destroy() {
    this.clip?.destroy();
  }
}

export const frameRenderer = new VideoFrameRenderer();
