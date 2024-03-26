//チャンネル情報受け取り

import { Socket } from "socket.io-client"; //クラス識別用
import { useChannelinfo } from "~/stores/channel";
import type { channel } from "~/types/channel";

export default function fetchChannelInfo(socket: Socket): void {
  //チャンネル情報更新関数を取得
  const { updateChannelinfo } = useChannelinfo();

  //チャンネル情報
  socket.on("RESULT::fetchChannelInfo", (dat:{result:string, data:channel}) => {
    //console.log("infoChannel :: dat->", dat);

    //チャンネル情報の更新
    updateChannelinfo(dat.data.channelId, dat.data);
  });
}
