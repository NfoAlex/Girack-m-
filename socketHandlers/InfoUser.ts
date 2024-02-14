//自ユーザー情報の受け取り

import { Socket } from "socket.io-client"; //クラス識別用
import { useMyUserinfo } from "../stores/userinfo";
import type { MyUserinfo } from "../types/user";

export default function infoUser(socket:Socket):void {
  //プロフィール情報の受け取り
  socket.on("infoUser", (dat:MyUserinfo) => {
    console.log("InfoUser :: socketon(infoUser) : dat->", dat);

    //自ユーザー情報格納
    const MyUserinfo = useMyUserinfo();
    MyUserinfo.updateMyUserinfo(dat);
  });
}
