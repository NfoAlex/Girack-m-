//チャンネル情報受け取り

import { Socket } from "socket.io-client"; //クラス識別用

export default function infoChannel(socket: Socket): void {
  socket.on("infoChannel", (dat) => {
    console.log("infoChannel :: dat->", dat);
  });
}