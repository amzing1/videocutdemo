import { createSharedComposable } from "@vueuse/core";
import Dexie from "dexie";
import type { Table } from "dexie";

interface VideoAsset {
  id: string; // 视频唯一标识
  name: string; // 视频文件名
  blob: Blob; // 视频二进制数据
  lastUsed: number; // 最后使用时间戳，用于缓存清理
  format: string; // 视频格式，如 'video/mp4'
}

class VideoCacheDatabase extends Dexie {
  // 定义表类型
  assets!: Table<VideoAsset>;

  constructor() {
    super("VideoEditorDB");
    this.version(1).stores({
      assets: "id, name, lastUsed", // 索引字段
    });
  }
}

export const useVideoCache = createSharedComposable(() => {
  const db = new VideoCacheDatabase();

  async function getVideo(
    id: string,
    url: string,
    onProgress?: (progress: number) => void
  ): Promise<Blob> {
    const item = await db.assets.get(id);

    if (item) {
      console.log(`%c[Cache] 命中本地存储: ${id}`, "color: #4CAF50");
      await updateLastUsed(id);
      return item.blob;
    }

    console.log(`%c[Network] 开始下载资源: ${url}`, "color: #2196F3");
    const blob = await downloadWithProgress(url, onProgress);

    const newAsset: VideoAsset = {
      id,
      name: url.split("/").pop() || "unknown",
      blob,
      lastUsed: Date.now(),
      format: blob.type,
    };

    await db.assets.put(newAsset);
    return blob;
  }

  async function downloadWithProgress(
    url: string,
    onProgress?: (progress: number) => void
  ): Promise<Blob> {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`下载失败: ${response.statusText}`);

    const contentLength = Number(response.headers.get("Content-Length")) || 0;
    const reader = response.body?.getReader();

    if (!reader) throw new Error("无法读取响应流");

    let receivedLength = 0;
    const chunks: Uint8Array[] = [];

    while (true) {
      const { done, value } = await reader.read();

      if (done) break;

      chunks.push(value);
      receivedLength += value.length;

      if (onProgress && contentLength) {
        const progress = Math.round((receivedLength / contentLength) * 100);
        onProgress(progress);
      }
    }

    return new Blob(chunks as BlobPart[]);
  }

  async function updateLastUsed(id: string): Promise<void> {
    await db.assets.update(id, { lastUsed: Date.now() });
  }

  async function clearOldCache(maxItems: number = 10): Promise<void> {
    const count = await db.assets.count();
    if (count > maxItems) {
      const deleteCount = count - maxItems;
      const oldestItems = await db.assets
        .orderBy("lastUsed")
        .limit(deleteCount)
        .primaryKeys();
      await db.assets.bulkDelete(oldestItems);
      console.log(`清理了 ${deleteCount} 条旧缓存`);
    }
  }

  return {
    getVideo,
    clearOldCache,
  };
});
