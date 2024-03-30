//チャンネル削除したっていう情報受け取り、処理

import { Socket } from "socket.io-client"; //クラス識別用
import { useChannelinfo } from "~/stores/channel";
import { useMyUserinfo } from "~/stores/userinfo";

export default function deleteChannel(socket: Socket): void {
  const { getMyUserinfo, getSessionId } = storeToRefs(useMyUserinfo());
  //チャンネル情報更新関数を取得
  const { deleteChannelinfo } = useChannelinfo();
  const { updateMyUserinfo } = useMyUserinfo();

  //チャンネル削除通知
  socket.on("RESULT::deleteChannel", (dat:{result:string, data:string}) => {
    //参加チャンネル配列を抽出
    const channelJoined:string[] = getMyUserinfo.value.channelJoined;
    //チャンネルIDを削除した配列を作成
    const channelJoinedSpliced = channelJoined.splice(channelJoined.indexOf(dat.data), 1);
    //チャンネル参加配列を更新させる
    updateMyUserinfo({
      ...getMyUserinfo.value,
      channelJoined: channelJoinedSpliced
    });
    
    //Storeからチャンネル情報を削除する
    deleteChannelinfo(dat.data);

    //console.log("socket(deleteChannel) : 処理してる");

    //チャンネル脱退処理をする
    socket.emit("leaveChannel", {
      RequestSender: {
        userId: getMyUserinfo.value.userId,
        sessionId: getSessionId.value
      },
      channelId: dat.data
    });
  });
}
