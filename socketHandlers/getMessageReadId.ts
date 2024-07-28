//最新既読Id受信用

import type { Socket } from "socket.io-client"; //クラス識別用
import { useAppStatus } from "~/stores/AppStatus";
import { useMessageReadId } from "~/stores/messageReadId";
import { useMyUserinfo } from "~/stores/userinfo";

export default function getMessageReadId(socket: Socket): void {
	socket.on(
		"RESULT::getMessageReadId",
		(dat: {
			result: string;
			data: {
				[key: string]: string;
			};
		}) => {
			console.log("getMessageReadId :: dat->", dat);

			const { setMessageReadId } = useMessageReadId();
			const { getAppStatus } = storeToRefs(useAppStatus());

			//最新のメッセージ既読Idを格納
			setMessageReadId(dat.data);

			//もし初回の受信なら履歴を取得
			if (!getAppStatus.value.hasMessageReadId) {
				//参加しているチャンネルの数分ループして取得
				const { getMyUserinfo, getSessionId } = storeToRefs(useMyUserinfo());
				for (const channelId of getMyUserinfo.value.channelJoined) {
					//履歴を取得
					socket.emit("fetchHistory", {
						RequestSender: {
							userId: getMyUserinfo.value.userId,
							sessionId: getSessionId.value,
						},
						channelId: channelId,
						fetchingPosition: {
							positionMessageId:
								dat.data[channelId] === undefined ? "" : dat.data[channelId],
							includeThisPosition: true,
							fetchDirection: "older",
						},
					});
				}
			}

			//最新既読Idを持っていると設定
			getAppStatus.value.hasMessageReadId = true;
		},
	);
}
