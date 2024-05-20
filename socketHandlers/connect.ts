//接続を検知、状態の設定

import { Socket } from "socket.io-client"; //クラス識別用
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

    //オンラインユーザーリストを取得
    const { getMyUserinfo, getSessionId } = storeToRefs(useMyUserinfo());
    socket.emit("fetchOnlineUsers", {
      RequestSender: {
        userId: getMyUserinfo.value.userId,
        sessionId: getSessionId.value
      }
    });
  });
}
