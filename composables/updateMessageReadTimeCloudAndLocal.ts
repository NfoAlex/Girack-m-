import { socket } from "~/socketHandlers/socketInit";
//import { useMessageReadId } from "~/stores/messageReadId";
import { useMessageReadTime } from "~/stores/messageReadTime";
import { useMyUserinfo } from "~/stores/userinfo";

export default function updateMessageReadTimeCloudAndLocal(
  channelId: string,
  dateString: string,
) {
  //最終既読時間をStoreにて更新
  //const { updateMessageReadId } = useMessageReadId();
  const { updateMessageReadTime, getMessageReadTime } = useMessageReadTime();

  //今の既読時間と比較して更新する値が古いなら同期を停止
  //今
  const currentReadTime: number = new Date(
    getMessageReadTime(channelId),
  ).valueOf();
  //更新する予定の値
  const newReadTime: number = new Date(dateString).valueOf();
  if (newReadTime < currentReadTime) return;

  //ローカルの既読時間更新させる
  updateMessageReadTime(channelId, dateString);

  //メッセージ既読状態を更新させて同期する
  const { getMyUserinfo, getSessionId } = storeToRefs(useMyUserinfo());
  socket.emit("setMessageReadTime", {
    RequestSender: {
      userId: getMyUserinfo.value.userId,
      sessionId: getSessionId.value,
    },
    channelId: channelId,
    messageTime: dateString,
  });
}
