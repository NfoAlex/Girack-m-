//オンラインユーザーの切断を受信

import { Socket } from "socket.io-client"; //クラス識別用
import { useUserIndex } from "~/stores/userindex";

export default function removeOnlineUser(socket: Socket): void {
  socket.on("removeOnlineUser", (dat:{data:string}) => {
    console.log("socket(removeOnlineUser) :: dat->", dat);

    //オンラインユーザーリストからユーザーIdを削除
    const { removeOnlineUserSingle } = useUserIndex();
    removeOnlineUserSingle(dat.data);
  });
}
