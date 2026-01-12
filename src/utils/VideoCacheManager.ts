import Dexie from 'dexie';
import type { Table } from 'dexie';

interface VideoAsset {
  id: string;          // 视频唯一标识
  name: string;        // 视频文件名
  blob: Blob;          // 视频二进制数据
  lastUsed: number;    // 最后使用时间戳，用于缓存清理
  format: string;      // 视频格式，如 'video/mp4'
}

class VideoCacheDatabase extends Dexie {
  // 定义表类型
  assets!: Table<VideoAsset>;

  constructor() {
    super('VideoEditorDB');
    this.version(1).stores({
      assets: 'id, name, lastUsed' // 索引字段
    });
  }
}

class VideoCacheManager {
  private db: VideoCacheDatabase;

  constructor() {
    this.db = new VideoCacheDatabase();
  }

  /**
   * 获取视频的本地 Object URL
   * @param id 视频唯一标识
   * @param url 远程下载地址
   * @param onProgress 下载进度回调 (0-100)
   */
  async getVideo(
    id: string, 
    url: string, 
    onProgress?: (progress: number) => void
  ): Promise<string> {
    const item = await this.db.assets.get(id);

    if (item) {
      console.log(`%c[Cache] 命中本地存储: ${id}`, 'color: #4CAF50');
      await this.updateLastUsed(id);
      return URL.createObjectURL(item.blob);
    }

    console.log(`%c[Network] 开始下载资源: ${url}`, 'color: #2196F3');
    const blob = await this.downloadWithProgress(url, onProgress);
    
    const newAsset: VideoAsset = {
      id,
      name: url.split('/').pop() || 'unknown',
      blob,
      lastUsed: Date.now(),
      format: blob.type
    };

    await this.db.assets.put(newAsset);
    return URL.createObjectURL(blob);
  }

  /**
   * 使用流式 API 处理下载进度
   */
  private async downloadWithProgress(
    url: string, 
    onProgress?: (progress: number) => void
  ): Promise<Blob> {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`下载失败: ${response.statusText}`);

    const contentLength = Number(response.headers.get('Content-Length')) || 0;
    const reader = response.body?.getReader();
    
    if (!reader) throw new Error('无法读取响应流');

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

  private async updateLastUsed(id: string): Promise<void> {
    await this.db.assets.update(id, { lastUsed: Date.now() });
  }

  /**
   * 手动释放 URL 内存
   */
  revokeUrl(url: string): void {
    URL.revokeObjectURL(url);
  }

  /**
   * 清理过期缓存
   */
  async clearOldCache(maxItems: number = 10): Promise<void> {
    const count = await this.db.assets.count();
    if (count > maxItems) {
      const deleteCount = count - maxItems;
      const oldestItems = await this.db.assets
        .orderBy('lastUsed')
        .limit(deleteCount)
        .primaryKeys();
      await this.db.assets.bulkDelete(oldestItems);
      console.log(`清理了 ${deleteCount} 条旧缓存`);
    }
  }
}

export const videoCache = new VideoCacheManager();