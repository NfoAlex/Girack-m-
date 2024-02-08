//サーバー情報受け取り

import { Socket } from "socket.io-client"; //クラス識別用
import { storeServerinfo } from "../stores/serverinfo";
const Serverinfo = storeServerinfo(); //piniaからインポート

export default function infoServer(socket: Socket): void {
  //サーバー(インスタンス)情報
  socket.on("infoServer", (dat) => {
    console.log("infoServer :: dat->", dat);
    Serverinfo.updateInfo(dat); //サーバー情報へ適用
  });
}