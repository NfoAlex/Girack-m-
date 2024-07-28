//チャンネル順序受け取り用

import type { Socket } from "socket.io-client"; //クラス識別用
import { useChannelinfo } from "~/stores/channel";

export default function fetchUserChannelOrder(socket: Socket): void {
  socket.on(
    "RESULT::fetchUserChannelOrder",
    (dat: {
      result: string;
      data: any[];
    }) => {
      //console.log("fetchUserChannelOrder :: dat->", dat);

      //チャンネル順序更新用
      const { updateChannelOrder } = useChannelinfo();
      //格納
      updateChannelOrder(dat.data);
    },
  );
}
