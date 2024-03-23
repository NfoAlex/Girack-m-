//切断の検知、設定

import { Socket } from "socket.io-client"; //クラス識別用
import { useAppStatus } from "~/stores/AppStatus";

export default function disconnect(socket: Socket): void {
  //接続状態更新用
  const { getAppStatus } = storeToRefs(useAppStatus());

  //WSからの切断を検知
  socket.on("disconnect", () => {
    console.log("disconnect :: 切断検知");
    
    getAppStatus.value.connected = false;
  });
}
