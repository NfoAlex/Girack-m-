import { socket } from "~/socketHandlers/socketInit";
import { useMyUserinfo } from "~/stores/userinfo";

export default function updateMessageReadIdCloudAndLocal(channelId:string, messageId:string) {
  //最終既読IdをStoreにて更新
  const { updateMessageReadId } = useMessageReadId();
  updateMessageReadId(
    channelId,
    messageId
  );

  //メッセージ既読状態を更新させて同期する
  const { getMyUserinfo, getSessionId } = storeToRefs(useMyUserinfo());
  socket.emit("setMessageReadId", {
    RequestSender: {
      userId: getMyUserinfo.value.userId,
      sessionId: getSessionId.value
    },
    channelId: channelId,
    messageId: messageId
  });
}
