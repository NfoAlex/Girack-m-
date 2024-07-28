//接続を検知、状態の設定

import type { Socket } from "socket.io-client"; //クラス識別用
import { useAppStatus } from "~/stores/AppStatus";
import { useUserIndex } from "~/stores/userindex";
import { useMyUserinfo } from "~/stores/userinfo";

export default function connect(socket: Socket): void {
  //接続状態更新用
  const { getAppStatus } = storeToRefs(useAppStatus());

  //最初のロードで既に接続中ならそう設定
  if (socket.connected) {
    getAppStatus.value.connected = true;
  }

  //WSへの接続を検知
  socket.on("connect", () => {
    console.log("connect :: 接続検知");

    //接続済みと設定
    getAppStatus.value.connected = true;

    //オンラインユーザーを初期化
    const { removeOnlineUsers } = useUserIndex();
    removeOnlineUsers();

    //セッション認証とオンラインユーザーリスト取得用
    const { getMyUserinfo, getSessionId } = storeToRefs(useMyUserinfo());

    //セッション認証用の結果受け取りハンドラ
    const tempSessionCheck = (dat: { result: string; data: boolean }) => {
      console.log(
        "socket(reconnect) :: tempSessionCheck : 再接続の認証->",
        dat,
      );
      if (dat.result !== "SUCCESS") window.location.reload();
      //このハンドラを解除
      socket.off("RESULT::authSession", tempSessionCheck);
    };
    socket.on("RESULT::authSession", tempSessionCheck);

    //Socketチャンネルへ参加するためのセッション認証
    socket.emit("authSession", {
      userId: getMyUserinfo.value.userId,
      sessionId: getSessionId.value,
    });
    //オンラインユーザーリストを取得
    socket.emit("fetchOnlineUsers", {
      RequestSender: {
        userId: getMyUserinfo.value.userId,
        sessionId: getSessionId.value,
      },
    });
  });
}
