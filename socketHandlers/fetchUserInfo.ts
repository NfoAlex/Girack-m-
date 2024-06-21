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

      //もし初回の自情報ロードなら最新既読Idを取得
      if (!getAppStatus.value.profile.UserinfoLoaded) {
        socket.emit("getMessageReadTime", {
          RequestSender: {
            userId: dat.data.userId,
            sessionId: getSessionId
          }
        });
      }

      //自ユーザー情報格納
      const MyUserinfo = useMyUserinfo();
      MyUserinfo.updateMyUserinfo(dat.data);

      //ユーザー情報をロードできたと設定
      getAppStatus.value.profile.UserinfoLoaded = true;
    }
  });
}
