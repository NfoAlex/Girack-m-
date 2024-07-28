//サーバー情報受け取り

import type { Socket } from "socket.io-client"; //クラス識別用
import type { Serverinfo } from "~/types/serverInfo";
import { useServerinfo } from "../stores/serverinfo";

export default function infoServer(socket: Socket): void {
	//サーバー(インスタンス)情報
	socket.on(
		"RESULT::fetchServerInfoLimited",
		(dat: {
			result: string;
			data: Serverinfo;
		}) => {
			console.log("infoServer :: dat->", dat);
			const Serverinfo = useServerinfo(); //piniaからインポート
			Serverinfo.updateInfo(dat.data); //サーバー情報へ適用
		},
	);
}
