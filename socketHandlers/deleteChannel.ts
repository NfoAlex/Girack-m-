//チャンネル削除したっていう情報受け取り、処理

import type { Socket } from "socket.io-client"; //クラス識別用
import { useMyUserinfo } from "~/stores/userinfo";

export default function deleteChannel(socket: Socket): void {
	const { getMyUserinfo, getSessionId } = storeToRefs(useMyUserinfo());

	//チャンネル削除通知
	socket.on(
		"RESULT::deleteChannel",
		(dat: { result: string; data: string }) => {
			//console.log("socket(deleteChannel) : 処理してる");

			//チャンネル脱退処理をする
			socket.emit("leaveChannel", {
				RequestSender: {
					userId: getMyUserinfo.value.userId,
					sessionId: getSessionId.value,
				},
				channelId: dat.data,
			});
		},
	);
}
