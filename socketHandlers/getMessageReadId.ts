//最新既読Id受信用

import { Socket } from "socket.io-client"; //クラス識別用
import { useAppStatus } from "~/stores/AppStatus";
import { useMessageReadId } from "~/stores/messageReadId";

export default function getMessageReadId(socket: Socket): void {
  socket.on("RESULT::getMessageReadId", (dat:{
    result: string,
    data: any
  }) => {
    console.log("getMessageReadId :: dat->", dat);

   const { setMessageReadId } = useMessageReadId();
   const { getAppStatus } = storeToRefs(useAppStatus());

   //最新のメッセージ既読Idを格納
   setMessageReadId(dat.data);
    //最新既読Idを持っていると設定
   getAppStatus.value.hasMessageReadId = true;
  });
}
