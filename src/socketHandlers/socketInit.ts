//一番最初に認識されて、いろんなSocketハンドラをまとめるところ

import { io } from "socket.io-client"; //ウェブソケット通信用

//Socket接続
export const socket = io(location.origin, {
  transports: ["websocket"],
  reconnection: true,
  reconnectionDelay: 100,
  reconnectionDelayMax: 1000,
});

socket.on("connect", () => {
  console.log("socketInit :: connect : 接続しました");
});