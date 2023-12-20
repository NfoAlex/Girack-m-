//一番最初に認識されて、いろんなSocketハンドラをまとめるところ

import { io } from "socket.io-client"; //ウェブソケット通信用
import { infoServer } from "@socket/InfoServer.ts";
import { infoChannel } from "@socket/InfoChannel.ts";

console.log("socketInit :: INITIALIZED");

//Socket接続
export const socket = io(location.origin, {
  transports: ["websocket"],
  reconnection: true,
  reconnectionDelay: 100,
  reconnectionDelayMax: 1000,
});

//接続時
socket.on("connect", () => {
  console.log("socketInit :: connect : 接続しました", socket);

  socket.emit("getInfoServer");
});


infoServer(socket);
infoChannel(socket);