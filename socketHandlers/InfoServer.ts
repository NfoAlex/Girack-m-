//サーバー情報受け取り

import { Socket } from "socket.io-client"; //クラス識別用
import { useServerinfo } from "../stores/serverinfo";
import type { Serverinfo } from "~/types/serverInfo";

export default function infoServer(socket: Socket): void {
  //サーバー(インスタンス)情報
  socket.on("RESULTfetchServerInfoLimited", (dat:{
    result: string,
    data: Serverinfo
  }) => {
    console.log("infoServer :: dat->", dat);
    const Serverinfo = useServerinfo(); //piniaからインポート
    Serverinfo.updateInfo(dat.data); //サーバー情報へ適用
  });
}
