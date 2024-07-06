import { socket } from "~/socketHandlers/socketInit";
import { useMyUserinfo } from "~/stores/userinfo";
//import { useMessageReadId } from "~/stores/messageReadId";
import { useMessageReadTime } from "~/stores/messageReadTime";

export default function updateMessageReadTimeCloudAndLocal(channelId:string, dateString:string) {
  //最終既読時間をStoreにて更新
  //const { updateMessageReadId } = useMessageReadId();
  const { updateMessageReadTime, getMessageReadTime } = useMessageReadTime();

  //今の既読時間と比較して更新する値が古いなら同期を停止
  const currentReadTime:number = new Date(getMessageReadTime(channelId)).valueOf();
  const newReadTime:number = new Date(dateString).valueOf();
  if (newReadTime < currentReadTime) return;

  updateMessageReadTime(
    channelId,
    dateString
  );

  //メッセージ既読状態を更新させて同期する
  const { getMyUserinfo, getSessionId } = storeToRefs(useMyUserinfo());
  socket.emit("setMessageReadTime", {
    RequestSender: {
      userId: getMyUserinfo.value.userId,
      sessionId: getSessionId.value
    },
    channelId: channelId,
    messageTime: dateString
  });
}
