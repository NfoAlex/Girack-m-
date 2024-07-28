//新着の受け取り

import type { Socket } from "socket.io-client"; //クラス識別用
import { useMyUserinfo } from "~/stores/userinfo";

export default function newNotification(socket: Socket): void {
  const { getMyUserinfo, getSessionId } = storeToRefs(useMyUserinfo());

  //新着通知受け取り
  socket.on("newNotification", (dat: { result: string; data: string }) => {
    console.log("socket(newNotification) : 処理してる");

    //チャンネル脱退処理をする
    socket.emit("fetchUserInbox", {
      RequestSender: {
        userId: getMyUserinfo.value.userId,
        sessionId: getSessionId.value,
      },
    });
  });
}
