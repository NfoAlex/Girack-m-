//サーバー情報受け取り

import { Socket } from "socket.io-client"; //クラス識別用

export default function infoServer(socket: Socket): void {
  socket.on("infoServer", (dat) => {
    console.log("infoServer :: dat->", dat);
  });
}