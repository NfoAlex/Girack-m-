//チャンネル情報受け取り

import { Socket } from "socket.io-client"; //クラス識別用
import { useChannelinfo } from "~/stores/channel";
import { useMyUserinfo } from "~/stores/userinfo";
import type { channel } from "~/types/channel";

export default function fetchChannelInfo(socket: Socket): void {
  const { getMyUserinfo, getSessionId } = storeToRefs(useMyUserinfo());
  //チャンネル情報更新関数を取得
  const { updateChannelinfo } = useChannelinfo();

  //チャンネル情報
  socket.on("RESULT::fetchChannelInfo", (
    dat:{
      result:string,
      data: {
        channelId: string,
        channelInfo: channel
      }
    }
  ) => {
    //console.log("infoChannel :: dat->", dat);

    //データがnullじゃないなら更新、そうなら脱退させる
    if (dat.data.channelInfo !== null && dat.data !== null) {
      //チャンネル情報の更新
      updateChannelinfo(dat.data.channelId, dat.data.channelInfo);
    } else if (getMyUserinfo.value.channelJoined.includes(dat.data.channelId)) {
      console.log("socket(fetchChannelInfo) :: 情報ないから脱退するわ", dat.data.channelId);
      //チャンネル脱退処理をする
      socket.emit("leaveChannel", {
        RequestSender: {
          userId: getMyUserinfo.value.userId,
          sessionId: getSessionId.value
        },
        channelId: dat.data.channelId
      });
    }
  });
}
