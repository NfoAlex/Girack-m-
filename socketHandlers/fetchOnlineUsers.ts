//オンラインユーザーの取得

import { Socket } from "socket.io-client"; //クラス識別用
import { useUserIndex } from "~/stores/userindex";

export default function fetchOnlineUsers(socket: Socket): void {
  socket.on("RESULT::fetchOnlineUsers", (dat:{result:string, data:any[]}) => {
    //console.log("socket(fetchOnlineUsers) :: dat->", dat);

    //オンラインユーザーリストをStoreへ格納
    const { bindOnlineUsers } = useUserIndex();
    bindOnlineUsers(dat.data);
  });
}
