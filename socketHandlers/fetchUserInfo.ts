//自ユーザー情報の受け取り

import { Socket } from "socket.io-client"; //クラス識別用
import { useMyUserinfo } from "../stores/userinfo";
import type { MyUserinfo } from "../types/user";

export default function fetchUserInfo(socket:Socket):void {
  //プロフィール情報の受け取り
  socket.on("RESULT::fetchUserInfo", (dat:{result:string, data:MyUserinfo}) => {
    console.log("fetchUserInfo :: socketon(infoUser) : dat->", dat);

    //自ユーザー情報格納
    const MyUserinfo = useMyUserinfo();
    MyUserinfo.updateMyUserinfo(dat.data);
  });
}
