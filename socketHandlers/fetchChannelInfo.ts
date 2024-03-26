//チャンネル情報受け取り

import { Socket } from "socket.io-client"; //クラス識別用
import { useChannelinfo } from "~/stores/channel";

export default function fetchChannelInfo(socket: Socket): void {
  //チャンネル情報更新関数を取得
  const { updateChannelinfo } = useChannelinfo();

  //チャンネル情報
  socket.on("RESULT::fetchChannelInfo", (dat) => {
    console.log("infoChannel :: dat->", dat);
  });
}
