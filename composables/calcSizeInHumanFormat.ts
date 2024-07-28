/**
 * ファイルサイズを単位で表示できるように
 * @param size
 */
export default function calcSizeInHumanFormat(size: number) {
  let sizeCalculated = size; //ファイルサイズ記録用
  let level = 0; //単位表示の段階
  const sizeDisplay = ["B", "KB", "MB", "GB", "TB"]; //単位表示用、表示段階に合わせる

  //サイズの計算結果が1024未満になるまで割り続ける
  while (sizeCalculated > 1024) {
    sizeCalculated = sizeCalculated / 1024;
    level++; //段階上げ
  }

  //省略したサイズ表示と単位の文字列を返す
  return Math.floor(sizeCalculated) + sizeDisplay[level];
}
