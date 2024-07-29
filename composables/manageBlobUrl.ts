export const blobUrlCache = new Map<
  string,
  {
    fileName: string;
    blobUrl: string;
  }
>();

/**
 * blobURLをキャッシュへ登録する
 * @param fileId
 * @param blobUrl
 */
export function registerBlobUrl(
  fileId: string,
  args: { fileName: string; blobUrl: string },
) {
  //キャッシュへ登録
  blobUrlCache.set(fileId, args);

  //もしキャッシュが30以上になっているなら削る
  if (blobUrlCache.size > 30) {
    //順番を取り出すためのハンドラを作る
    const firstObjectHandler = blobUrlCache.entries();
    //ファイルIdにあたるものを取得
    const firstObject: [string, string] = firstObjectHandler.next().value;
    //ファイルIDとURLに分ける
    const firstFileId = firstObject[0];
    const firstBlobUrl = firstObject[1];

    //blobURLを無効化
    URL.revokeObjectURL(firstBlobUrl);
    //キャッシュから削除
    blobUrlCache.delete(firstFileId);
  }
}

/**
 * blobURLキャッシュからURLを取得
 * @param fileId
 * @returns
 */
export function getBlobUrl(fileId: string):
  | {
      fileName: string;
      blobUrl: string;
    }
  | undefined {
  return blobUrlCache.get(fileId);
}

/**
 * BlobUrl削除
 * @param fileId
 */
export function deleteBlobUrl(fileId: string) {
  const fileBlobData = blobUrlCache.get(fileId);
  if (fileBlobData === undefined) return;

  //blobURLを無効化
  URL.revokeObjectURL(fileBlobData.blobUrl);
  //キャッシュから削除
  blobUrlCache.delete(fileId);
}
