//自ユーザー情報の受け取り

import { Socket } from "socket.io-client"; //クラス識別用
import { useMyUserinfo } from "~/stores/userinfo";
import { useUserIndex } from "~/stores/userindex";
import { useAppStatus } from "~/stores/AppStatus";
import type { MyUserinfo } from "../types/user";

export default function fetchUserInfo(socket:Socket):void {
  //プロフィール情報の受け取り
  socket.on("RESULT::fetchUserInfo", (dat:{result:string, data:MyUserinfo}) => {
    //console.log("fetchUserInfo :: socketon(infoUser) : dat->", dat);

    //ユーザー情報を更新する
    const { setUserIndex } = useUserIndex();
    setUserIndex(dat.data);

    //自分のユーザー情報だったのならStoreを更新
    const { getMyUserinfo, getSessionId } = useMyUserinfo();
    if (getMyUserinfo.userId === dat.data.userId) {

      //最初の自情報ロードなら履歴を取得する
      const { getAppStatus } = storeToRefs(useAppStatus());
      if (!getAppStatus.value.profile.UserinfoLoaded) {
        //参加しているチャンネルの数分ループ
        for (let channelId of dat.data.channelJoined) {
          //履歴を取得
          socket.emit("fetchHistory", {
            RequestSender: {
              userId: getMyUserinfo.userId,
              sessionId: getSessionId
            },
            channelId: channelId,
            fetchingPosition: {
              positionMessageId: "", //最新からとるために空(将来的に既読時間からやるようにする)
              fetchDirection: "newer"
            }
          });
        }
      }

      //自ユーザー情報格納
      const MyUserinfo = useMyUserinfo();
      MyUserinfo.updateMyUserinfo(dat.data);

      //ユーザー情報をロードできたと設定
      getAppStatus.value.profile.UserinfoLoaded = true;
    }
  });
}
