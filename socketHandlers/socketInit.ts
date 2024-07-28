//一番最初に認識されて、いろんなSocketハンドラをまとめるところ

import { type Socket, io } from "socket.io-client"; //ウェブソケット通信用
import connect from "./connect";
import disconnect from "./disconnect";

import addOnlineUser from "./addOnlineUser";
import fetchOnlineUsers from "./fetchOnlineUsers";
import removeOnlineUser from "./removeOnlineUser";

import infoServer from "./InfoServer";

import deleteChannel from "./deleteChannel";
import fetchChannelInfo from "./fetchChannelInfo";
import fetchUserChannelOrder from "./fetchUserChannelOrder";

import deleteMessage from "./deleteMessage";
import fetchHistory from "./fetchHistory";
import newNotification from "./newNotification";
import receiveMessage from "./receiveMessage";
import updateMessage from "./updateMessage";

import fetchUserConfig from "./fetchUserConfig";
import fetchUserInbox from "./fetchUserInbox";
import fetchUserInfo from "./fetchUserInfo";
//import getMessageReadId from "./getMessageReadId";
import getMessageReadTime from "./getMessageReadTime";
import removeFromUserInbox from "./removeFromUserInbox";
import saveUserConfig from "./saveUserConfig";

import fetchRoleSingle from "./fetchRoleSingle";
import fetchRoles from "./fetchRoles";

import fetchFileInfo from "./fetchFileInfo";

import EventEmitter from "node:events";
EventEmitter.defaultMaxListeners = 25; // 新しいリスナーの上限を25に設定

console.log("socketInit :: INITIALIZED");

//Socket接続
export const socket: Socket = io({
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
  removeOnlineUser(socket); //オンラインユーザーによる切断者と受け取り
  addOnlineUser(socket); //オンラインユーザーの追加

  infoServer(socket); //サーバー情報

  fetchChannelInfo(socket); //チャンネル情報の受け取り
  deleteChannel(socket); //チャンネル削除通知の受け取り
  fetchUserChannelOrder(socket); //チャンネル順序の受け取り

  receiveMessage(socket); //メッセージの受信
  fetchHistory(socket); //履歴の受信
  updateMessage(socket); //メッセージ更新の受信
  deleteMessage(socket); //メッセージの削除
  newNotification(socket); //通知の受け取り
  removeFromUserInbox(socket); //新着削除結果の受け取り

  fetchUserInfo(socket); //自ユーザー情報
  fetchUserConfig(socket); //設定データ
  saveUserConfig(socket); //設定データの保存結果
  //getMessageReadId(socket); //最新既読Id取得
  getMessageReadTime(socket); //最新既読時間取得
  fetchUserInbox(socket); //通知Inbox受信

  fetchRoles(socket); //全ロール受け取り
  fetchRoleSingle(socket); //単一ロール受け取り

  fetchFileInfo(socket); //ファイルデータの受け取り
}
