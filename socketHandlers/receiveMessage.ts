//メッセージの受け取り、履歴記録

import { Socket } from "socket.io-client"; //クラス識別用
import { useHistory } from "~/stores/history";
import { useMyUserinfo } from "~/stores/userinfo";
import { useMessageReadId } from "~/stores/messageReadId";
import updateMessageReadIdCloudAndLocal from "~/composables/updateMessageReadIdCloudAndLocal";
import { useWindowFocus } from '@vueuse/core'

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
      //もしスクロールの値がないなら停止
      //if (scrollPosition === null) return;

      //ウィンドウへのフォーカスを取得
      const windowFocused = useWindowFocus()
      
      //新着判別
      if (
        route.params.id === message.channelId
        &&
        parseInt(scrollPosition || "0") === 0
        &&
        windowFocused.value
      ) {
        //最新既読Idを更新
        updateMessageReadIdCloudAndLocal(message.channelId, message.messageId);
        //最新Idに合わせてBeforeを設定
        const { updateMessageReadIdBefore } = useMessageReadId();
        updateMessageReadIdBefore(message.channelId);
        
      } else {
        //新着があると設定
        const { setHasNewMessage } = useHistory();
        setHasNewMessage(message.channelId, true);

        //もし自分宛てのメンションが入っているなら通知
        const { getMyUserinfo } = storeToRefs(useMyUserinfo());
        if (message.content.includes("@<" + getMyUserinfo.value.userId + ">")) {
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
