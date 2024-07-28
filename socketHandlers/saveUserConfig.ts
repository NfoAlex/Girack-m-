//個人設定情報の受け取り、適用

import type { Socket } from "socket.io-client"; //クラス識別用
import { useConfig } from "~/stores/config";
import type Config from "~/types/config";

export default function saveUserConfig(socket: Socket): void {
  //ユーザーの設定データ
  socket.on(
    "RESULT::saveUserConfig",
    (dat: { result: string; data: Config }) => {
      console.log("saveUserConfig :: 情報受け取り->", dat);
    },
  );
}
