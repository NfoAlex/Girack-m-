//メッセージの削除

import type { Socket } from "socket.io-client"; //クラス識別用
import { useHistory } from "~/stores/history";

export default function deleteMessage(socket: Socket): void {
	//メッセ削除
	socket.on(
		"RESULT::deleteMessage",
		(dat: {
			result: string;
			data: {
				channelId: string;
				messageId: string;
			};
		}) => {
			//console.log("socket(deleteChannel) : 処理してる");

			//削除する
			const { deleteMessage } = useHistory();
			deleteMessage(dat.data.channelId, dat.data.messageId);
		},
	);
}
