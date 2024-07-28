//個人設定情報の受け取り、適用

import type { Socket } from "socket.io-client"; //クラス識別用
import { useConfig } from "~/stores/config";

export default function saveUserConfig(socket: Socket): void {
	//サーバー(インスタンス)情報
	socket.on("RESULT::saveUserConfig", (dat: any) => {
		console.log("saveUserConfig :: 情報受け取り->", dat);
	});
}
