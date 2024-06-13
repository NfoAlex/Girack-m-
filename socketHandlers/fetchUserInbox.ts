//通知Inboxの受け取り

import { Socket } from "socket.io-client";
import { useInbox } from "~/stores/inbox";
import type { inbox } from "~/types/message";

export default function fetchUserInbox(socket: Socket): void {
  socket.on("RESULT::fetchUserInbox", (dat:{
    result: string,
    data: inbox
  }) => {
    console.log("fetchUserInbox :: dat->", dat);

    //Inbox格納
    const { bindInbox } = useInbox();
    bindInbox(dat.data);
  });
}
