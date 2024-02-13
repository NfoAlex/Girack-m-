//クッキーを取得(MDNから参考)
export function getCookie(cname:string):string {
  let name = cname + "="; //検索するクッキーの名前を設定
  let decodedCookie = decodeURIComponent(document.cookie); //クッキー取得
  let ca = decodedCookie.split(";"); //クッキーを探せるようにするために分解

  //該当クッキーの探索開始
  for (let i:number = 0; i < ca.length; i++) {
    let c = ca[i];

    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }

  return "";
}