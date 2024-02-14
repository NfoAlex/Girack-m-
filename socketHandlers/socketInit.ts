//一番最初に認識されて、いろんなSocketハンドラをまとめるところ

import { Socket, io } from "socket.io-client"; //ウェブソケット通信用
import infoServer from "./InfoServer";
import infoChannel from "./InfoChannel";
import infoUser from "./InfoUser";

console.log("socketInit :: INITIALIZED");

//Socket接続
export const socket:Socket = io({
  path: "/socket.io",
  reconnection: true,
  reconnectionDelay: 100,
  reconnectionDelayMax: 1000,
});

//piniaが構成されるよりも先にsocketHandlerがpiniaを使おうとする前に待たせるため関数化
//  ->app.vueでonNuxtReadyにて実行される
export function loadSocket() {
  console.log("socketInit :: loadSocket : 通信設定開始");
  //接続時
  socket.on("connect", () => {
    console.log("socketInit :: connect : 接続しました", socket);
  });

  //サーバー情報取得する
  socket.emit("getInfoServer");

  //情報受け取り周り
  infoServer(socket); //サーバー情報
  infoChannel(socket); //チャンネル情報の操作
  infoUser(socket); //自ユーザー情報
}