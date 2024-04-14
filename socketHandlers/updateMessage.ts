//メッセージ更新の受信

import { Socket } from "socket.io-client"; //クラス識別用
import { useHistory } from "~/stores/history";
import type message from "~/types/message";

export default function updateMessage(socket: Socket): void {

  //WSからの切断を検知
  socket.on("updateMessage", (dat:{result:string, data:message}
  ) => {
    console.log("updateMessage :: ");
    
    //メッセージデータを上書き
    const { updateMessage } = useHistory();
    updateMessage(dat.data);
  });
}
