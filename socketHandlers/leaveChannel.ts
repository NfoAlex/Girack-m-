//チャンネル削除したっていう情報受け取り、処理

import { Socket } from "socket.io-client"; //クラス識別用
import { useMyUserinfo } from "~/stores/userinfo";
import { useHistory } from "~/stores/history";
import { useMessageReadId } from "~/stores/messageReadId";

export default function leaveChannel(socket: Socket): void {
  const { getMyUserinfo } = storeToRefs(useMyUserinfo());
  //チャンネル情報更新関数を取得
  const { updateMyUserinfo } = useMyUserinfo();

  //チャンネル脱退結果
  socket.on("RESULT::leaveChannel", (dat:{result:string, data:string}) => {
    //成功ならチャンネル情報を削除する
    if (dat.result === "SUCCESS") {
      //参加チャンネル配列を抽出
      const channelJoined:string[] = getMyUserinfo.value.channelJoined;
      //チャンネルIDを削除した配列を作成
      const channelJoinedSpliced = channelJoined.splice(channelJoined.indexOf(dat.data), 1);
      //チャンネル参加配列を更新させる
      updateMyUserinfo({
        ...getMyUserinfo.value,
        channelJoined: channelJoinedSpliced
      });
      //履歴Storeと最新既読Idのデータを削除
      const { deleteHistoryData } = useHistory();
      const { deleteMessageReadId } = useMessageReadId();
      deleteHistoryData(dat.data);
      deleteMessageReadId(dat.data);
    }
  });
}
