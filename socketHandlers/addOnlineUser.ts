//オンラインユーザーの追加

import type { Socket } from "socket.io-client"; //クラス識別用
import { useUserIndex } from "~/stores/userindex";

export default function addOnlineUser(socket: Socket): void {
	socket.on("addOnlineUser", (dat: { data: string }) => {
		//console.log("socket(addOnlineUser) :: dat->", dat);

		//オンラインユーザーリストへユーザーId追加
		const { addOnlineUser } = useUserIndex();
		addOnlineUser(dat.data);
	});
}
