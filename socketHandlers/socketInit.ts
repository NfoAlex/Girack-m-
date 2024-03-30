//一番最初に認識されて、いろんなSocketハンドラをまとめるところ

import { Socket, io } from "socket.io-client"; //ウェブソケット通信用
import connect from "./connect";
import disconnect from "./disconnect";
import infoServer from "./InfoServer";
import fetchChannelInfo from "./fetchChannelInfo";
import deleteChannel from "./deleteChannel";
import fetchUserInfo from "./fetchUserInfo";
import fetchUserConfig from "./fetchUserConfig";
import saveUserConfig from "./saveUserConfig";
import fetchRoles from "./fetchRoles";
import fetchRoleSingle from "./fetchRoleSingle";

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

  //サーバー情報取得する
  socket.emit("fetchServerInfoLimited");

  //情報受け取り周り
  connect(socket); //接続検知用
  disconnect(socket); //切断検知用
  infoServer(socket); //サーバー情報
  fetchChannelInfo(socket); //チャンネル情報の受け取り
  deleteChannel(socket); //チャンネル削除通知の受け取り
  fetchUserInfo(socket); //自ユーザー情報
  fetchUserConfig(socket); //設定データ
  saveUserConfig(socket); //設定データの保存結果
  fetchRoles(socket); //全ロール受け取り
  fetchRoleSingle(socket); //単一ロール受け取り
}
