//メッセージの受け取り、履歴記録

import { useDocumentVisibility, useWindowFocus } from "@vueuse/core";
import type { Socket } from "socket.io-client"; //クラス識別用
import updateMessageReadTimeCloudAndLocal from "~/composables/updateMessageReadTimeCloudAndLocal";
import { useConfig } from "~/stores/config";
import { useHistory } from "~/stores/history";
import { useMessageReadTime } from "~/stores/messageReadTime";
import { useMyUserinfo } from "~/stores/userinfo";

import type message from "~/types/message";

//通知イベント格納用
let NoticationHolder: null | Notification = null;

export default function receiveMessage(socket: Socket): void {
  //メッセージ追加を取得
  const { addMessage } = useHistory();
  //メッセージの受け取り
  socket.on("receiveMessage", (message: message) => {
    //console.log("socket(receiveMessage) :: message->", message);

    addMessage(message);

    //システムメッセなら通知しないのでここで停止
    if (message.isSystemMessage) return;

    //現在そのチャンネルにいて、フォーカスしていてかつ一番下にスクロールしているのなら最新既読Id更新
    const route = useRoute();
    if (typeof route.params.id !== "object") {
      //スクロール位置を取り出し
      const scrollPosition: string | null = sessionStorage.getItem(
        `scrollPositionY::${message.channelId}`,
      );

      //ウィンドウへのフォーカスを取得
      const windowFocused = useWindowFocus();
      //タブへのフォーカスを取得
      const tabFocused = useDocumentVisibility();

      //新着判別
      if (
        route.params.id === message.channelId &&
        Number.parseInt(scrollPosition || "0") === 0 &&
        tabFocused.value &&
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
        const { getConfig } = storeToRefs(useConfig());
        if (
          getConfig.value.notification.notifyAllMessages || //すべてで通知するか
          (getConfig.value.notification.notifyMention && //メンション通知が有効で
            message.content.includes(`@<${getMyUserinfo.value.userId}>`)) //メンションが入っているなら
        ) {
          //もし通知イベントがすでに起きているなら閉じる
          try {
            NoticationHolder?.close();
          } catch (e) {}

          //通知を出す
          NoticationHolder = new Notification(message.userId, {
            body: message.content,
            icon: `/icon/${message.userId}`,
          });
        }
      }
    }
  });
}
