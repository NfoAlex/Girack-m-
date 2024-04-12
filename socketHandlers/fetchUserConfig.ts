//設定情報受け取り

import { Socket } from "socket.io-client"; //クラス識別用
import { useConfig } from "~/stores/config";
import type Config from "~/types/config";

export default function fetchUserConfig(socket: Socket): void {
  //サーバー(インスタンス)情報
  socket.on("RESULT::fetchUserConfig", (dat:{
    result: string,
    data: Config
  }) => {
    //console.log("UserConfig :: dat->", dat);
    const Config = useConfig(); //piniaからインポート

    Config.updateConfig(dat.data); //設定データを適用
  });
}
