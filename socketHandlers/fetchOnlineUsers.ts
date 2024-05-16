//オンラインユーザーの取得

import { Socket } from "socket.io-client"; //クラス識別用

export default function fetchOnlineUsers(socket: Socket): void {
  socket.on("fetchOnlineUsers", (dat:{result:string, data:any[]}) => {
    console.log("socket(fetchOnlineUsers) :: dat->", dat);
  });
}
