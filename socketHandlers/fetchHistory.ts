//自ユーザー情報の受け取り

import type { Socket } from "socket.io-client"; //クラス識別用
import { useAppStatus } from "~/stores/AppStatus";
import { useHistory } from "~/stores/history";
//import { useMessageReadId } from "~/stores/messageReadId";
import { useMyUserinfo } from "~/stores/userinfo";
import type message from "~/types/message";

//履歴の初期だけの取得状態
const mapHistoryInitStatus = new Map<string, "LOADED_FIRST"|"DONE">();

export default function fetchHistory(socket: Socket): void {
  //履歴データの受け取り
  socket.on(
    "RESULT::fetchHistory",
    (dat: {
      result: string;
      data: {
        channelId: string;
        historyData: {
          history: message[];
          atTop: boolean;
          atEnd: boolean;
        };
      };
    }) => {
      console.log("fetchHistory :: socketon(fetchHistory) : dat->", dat);

      const {
        getHistoryAvailability,
        getLatestMessage,
        insertHistory,
        setAvailability,
        setLatestmessage,
      } = useHistory(); //piniaのActionsインポート

      //もし履歴データがnullならホルダーだけ作って終わり
      if (dat.data.historyData === null) {
        insertHistory(dat.data.channelId, []);
        setAvailability(
          dat.data.channelId, //履歴の位置データ
          {
            atTop: true,
            atEnd: true,
            latestFetchedHistoryLength: 0,
          },
        );

        /*
      //履歴を一番下から再取得する
      const { getMyUserinfo, getSessionId } = storeToRefs(useMyUserinfo());
      socket.emit("fetchHistory", {
        RequestSender: {
          userId: getMyUserinfo.value.userId,
          sessionId: getSessionId.value
        },
        channelId: dat.data.channelId,
        fetchingPosition: {
          positionMessageId: "",
          fetchDirection: "older"
        }
      });
      */

        return;
      }

      /*
    //履歴の位置データ保存
    setAvailability(dat.data.channelId,
      { //falseの時のみ変更を適用する
        atTop: !getHistoryAvailability(dat.data.channelId).atTop
          ? dat.data.historyData.atTop : true,
        atEnd: !getHistoryAvailability(dat.data.channelId).atTop
          ? dat.data.historyData.atEnd : true,
        latestFetchedHistoryLength: dat.data.historyData.history.length
      }
    );
    */

      //今の履歴データの可用性取得
      const historyAtTop = getHistoryAvailability(dat.data.channelId).atTop;
      const historyAtEnd = getHistoryAvailability(dat.data.channelId).atEnd;
      //履歴の位置データ保存
      setAvailability(dat.data.channelId, {
        //falseの時のみ変更を適用する
        atTop:
          historyAtTop === false ? dat.data.historyData.atTop : historyAtTop,
        atEnd:
          historyAtEnd === false ? dat.data.historyData.atEnd : historyAtEnd,
        latestFetchedHistoryLength: dat.data.historyData.history.length,
      });

      //履歴をStoreへ格納
      insertHistory(dat.data.channelId, dat.data.historyData.history); //履歴データ
      //この履歴が一番最新のものなら最新メッセージを更新
      if (
        dat.data.historyData.atEnd &&
        dat.data.historyData.history[0] !== undefined
      ) {
        setLatestmessage(dat.data.channelId, dat.data.historyData.history[0]);
      }

      //履歴取得中であることを無効化
      const { getAppStatus } = storeToRefs(useAppStatus());
      getAppStatus.value.fetchingHistory = false;

      //最新既読Idと最後のメッセージ比較して新着を設定
      const { setHasNewMessage, getHistoryFromChannel } = useHistory();
      //const { getMessageReadId } = useMessageReadId();
      const { getMessageReadTime } = useMessageReadTime();
      if (
        getHistoryAvailability(dat.data.channelId).atEnd &&
        getHistoryFromChannel(dat.data.channelId).length !== 0
      ) {
        //既読時間と比較して新着にする
        if (
          new Date(getLatestMessage(dat.data.channelId)?.time || "").valueOf() >
          new Date(getMessageReadTime(dat.data.channelId)).valueOf()
        ) {
          setHasNewMessage(dat.data.channelId, true);
        }
      } else if (
        //履歴取得時にこれが最初の格納で、最新でないなら新着と設定
        !getHistoryAvailability(dat.data.channelId).atEnd &&
        getLatestMessage(dat.data.channelId)?.messageId === "UNDEFINED"
      ) {
        setHasNewMessage(dat.data.channelId, true);
      }
    },
  );
}
