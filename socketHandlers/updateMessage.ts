//メッセージ更新の受信

import type { Socket } from "socket.io-client"; //クラス識別用
import { useHistory } from "~/stores/history";
import type message from "~/types/message";

export default function updateMessage(socket: Socket): void {
  //メッセージの更新受け取り
  socket.on("updateMessage", (dat: { result: string; data: message }) => {
    //console.log("updateMessage :: dat->", dat);

    //メッセージデータを上書き
    const { updateMessage } = useHistory();
    updateMessage(dat.data);
  });
}
