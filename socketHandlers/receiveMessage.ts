//メッセージの受け取り、履歴記録

import { Socket } from "socket.io-client"; //クラス識別用
import { useHistory } from "~/stores/history";
import { useMyUserinfo } from "~/stores/userinfo";
import { useMessageReadTime } from "~/stores/messageReadTime";
import updateMessageReadTimeCloudAndLocal from "~/composables/updateMessageReadTimeCloudAndLocal";
import { useWindowFocus, useDocumentVisibility } from '@vueuse/core'

import type message from "~/types/message";

//通知イベント格納用
let NoticationHolder:null|Notification = null;

export default function receiveMessage(socket: Socket): void {
  //メッセージ追加を取得
  const { addMessage } = useHistory();
  //メッセージの受け取り
  socket.on("receiveMessage", (message:message) => {
    //console.log("socket(receiveMessage) :: message->", message);

    addMessage(message);

    //現在そのチャンネルにいて、フォーカスしていてかつ一番下にスクロールしているのなら最新既読Id更新
    const route = useRoute();
    if (typeof(route.params.id) !== "object") {
      //スクロール位置を取り出し
      const scrollPosition:string|null = sessionStorage.getItem(
        "scrollPositionY::" + message.channelId
      );

      //ウィンドウへのフォーカスを取得
      const windowFocused = useWindowFocus()
      //タブへのフォーカスを取得
      const tabFocused = useDocumentVisibility();
      
      //新着判別
      if (
        route.params.id === message.channelId
        &&
        parseInt(scrollPosition || "0") === 0
        &&
        tabFocused.value
        &&
        windowFocused.value
      ) {
        //最新既読時間を更新
        updateMessageReadTimeCloudAndLocal(message.channelId, message.time);
        //最新既読時間に合わせてBeforeを設定
        const { updateMessageReadTimeBefore } = useMessageReadTime();
        updateMessageReadTimeBefore(message.channelId);
      } else {
        //新着があると設定
        const { setHasNewMessage } = useHistory();
        setHasNewMessage(message.channelId, true);

        //もし自分宛てのメンションが入っているなら通知
        const { getMyUserinfo } = storeToRefs(useMyUserinfo());
        if (
          message.content.includes("@<" + getMyUserinfo.value.userId + ">") //メンションが入っていて
        ) {
          //もし通知イベントがすでに起きているなら閉じる
          try {
            NoticationHolder?.close();
          } catch(e) {}

          //通知を出す
          NoticationHolder = new Notification(
            message.userId,
            {
              body: message.content,
              icon: "/icon/" + message.userId
            }
          );
        }
      }
    }
  });
}
