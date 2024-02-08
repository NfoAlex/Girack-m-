//一番最初に認識されて、いろんなSocketハンドラをまとめるところ

import { io } from "socket.io-client"; //ウェブソケット通信用
import infoServer from "./InfoServer";
import infoChannel from "./InfoChannel";

console.log("socketInit :: INITIALIZED");

//Socket接続
export const socket = io("localhost:33333", {
  transports: ["websocket"],
  reconnection: true,
  reconnectionDelay: 100,
  reconnectionDelayMax: 1000,
});

//接続時
socket.on("connect", () => {
  console.log("socketInit :: connect : 接続しました", socket);

  //サーバー情報の取得
  socket.emit("getInfoServer");
});

//情報受け取り周り
infoServer(socket); //サーバー情報
infoChannel(socket); //チャンネル情報の操作