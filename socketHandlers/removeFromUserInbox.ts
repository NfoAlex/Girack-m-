//新着削除結果の受け取り、Inbox再取得

import { Socket } from "socket.io-client"; //クラス識別用
import { useMyUserinfo } from "~/stores/userinfo";

export default function removeFromUserInbox(socket: Socket): void {
  const { getMyUserinfo, getSessionId } = storeToRefs(useMyUserinfo());

  //新着削除結果受け取り
  socket.on("RESULT::removeFromUserInbox", (dat:{result:string, data:boolean}) => {
    console.log("socket(removeFromUserInbox) : 処理してる", dat);

    if (dat.result === "SUCCESS") {
      //チャンネル脱退処理をする
      socket.emit("fetchUserInbox", {
        RequestSender: {
          userId: getMyUserinfo.value.userId,
          sessionId: getSessionId.value
        }
      });
    }
  });
}
