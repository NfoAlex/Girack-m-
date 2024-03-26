//チャンネル削除したっていう情報受け取り、処理

import { Socket } from "socket.io-client"; //クラス識別用
import { useChannelinfo } from "~/stores/channel";

export default function deleteChannel(socket: Socket): void {
  //チャンネル情報更新関数を取得
  const { deleteChannelinfo } = useChannelinfo();

  //チャンネル削除通知
  socket.on("RESULT::deleteChannel", (dat:{result:string, data:string}) => {
    //Storeからチャンネル情報を削除する
    deleteChannelinfo(dat.data);
  });
}
