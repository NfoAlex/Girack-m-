//自ユーザー情報の受け取り

import { Socket } from "socket.io-client"; //クラス識別用
import type message from "~/types/message";

export default function fetchHistory(socket:Socket):void {
  //履歴データの受け取り
  socket.on("RESULT::fetchHistory", (dat:{result:string, data:{channelId:string, history:message[]}}) => {
    console.log("fetchHistory :: socketon(fetchHistory) : dat->", dat);
  });
}
