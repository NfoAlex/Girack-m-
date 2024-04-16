//メッセージの受け取り、履歴記録

import { Socket } from "socket.io-client"; //クラス識別用
import { useHistory } from "~/stores/history";
import { useMessageReadId } from "~/stores/messageReadId";
import { useMyUserinfo } from "~/stores/userinfo";
import type message from "~/types/message";

export default function receiveMessage(socket: Socket): void {
  const { addMessage } = useHistory();
  //メッセージの受け取り
  socket.on("receiveMessage", (message:message) => {
    //console.log("socket(receiveMessage) :: message->", message);

    addMessage(message);

    //現在そのチャンネルにいて、一番下にスクロールしているのなら最新既読Id更新
    const route = useRoute();
    if (typeof(route.params.id) !== "object") {
      //スクロール位置を取り出し
      const scrollPosition:string|null = sessionStorage.getItem(
        "scrollPositionY::" + message.channelId
      );
      //もしスクロールの値がないなら停止
      if (scrollPosition === null) return;
      
      //判別
      if (
        route.params.id === message.channelId
        &&
        parseInt(scrollPosition) === 0
      ) {
        //最終既読IdをStoreにて更新
        const { updateMessageReadId } = useMessageReadId();
        updateMessageReadId(
          message.channelId,
          message.messageId
        );

        //メッセージ既読状態を設定する
        const { getMyUserinfo, getSessionId } = storeToRefs(useMyUserinfo());
        socket.emit("setMessageReadId", {
          RequestSender: {
            userId: getMyUserinfo.value.userId,
            sessionId: getSessionId.value
          },
          channelId: message.channelId,
          messageId: message.messageId
        });
      }
    }
  });
}
