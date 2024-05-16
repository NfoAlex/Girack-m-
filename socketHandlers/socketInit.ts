//一番最初に認識されて、いろんなSocketハンドラをまとめるところ

import { Socket, io } from "socket.io-client"; //ウェブソケット通信用
import connect from "./connect";
import disconnect from "./disconnect";

import fetchOnlineUsers from "./fetchOnlineUsers";

import infoServer from "./InfoServer";

import fetchChannelInfo from "./fetchChannelInfo";
import deleteChannel from "./deleteChannel";

import receiveMessage from "./receiveMessage";
import fetchHistory from "./fetchHistory";
import updateMessage from "./updateMessage";
import deleteMessage from "./deleteMessage";

import fetchUserInfo from "./fetchUserInfo";
import fetchUserConfig from "./fetchUserConfig";
import saveUserConfig from "./saveUserConfig";
import getMessageReadId from "./getMessageReadId";

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

  connect(socket); //接続検知用
  disconnect(socket); //切断検知用

  fetchOnlineUsers(socket); //オンラインユーザーの受け取り

  infoServer(socket); //サーバー情報

  fetchChannelInfo(socket); //チャンネル情報の受け取り
  deleteChannel(socket); //チャンネル削除通知の受け取り

  receiveMessage(socket); //メッセージの受信
  fetchHistory(socket); //履歴の受信
  updateMessage(socket); //メッセージ更新の受信
  deleteMessage(socket); //メッセージの削除

  fetchUserInfo(socket); //自ユーザー情報
  fetchUserConfig(socket); //設定データ
  saveUserConfig(socket); //設定データの保存結果
  getMessageReadId(socket); //最新既読Id取得

  fetchRoles(socket); //全ロール受け取り
  fetchRoleSingle(socket); //単一ロール受け取り
}
