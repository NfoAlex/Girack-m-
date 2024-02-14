//クッキー設定するやつ(MDNから参考)
export function setCookie(cname:string, cvalue:string, exdays:number):void {
  const d = new Date();

  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000); //寿命のための時間計算
  let expires = "expires=" + d.toUTCString(); //寿命設定
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/"; //クッキー追加
}