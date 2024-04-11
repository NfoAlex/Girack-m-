//メッセージの受け取り、履歴記録

import { Socket } from "socket.io-client"; //クラス識別用
import { useHistory } from "~/stores/history";
import type message from "~/types/message";

export default function receiveMessage(socket: Socket): void {
  const { addMessage } = useHistory();
  //メッセージの受け取り
  socket.on("receiveMessage", (message:message) => {
    //console.log("socket(receiveMessage) :: message->", message);

    addMessage(message);
  });
}
