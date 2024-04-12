//自ユーザー情報の受け取り

import { Socket } from "socket.io-client"; //クラス識別用
import { useHistory } from "~/stores/history";
import { useAppStatus } from '~/stores/AppStatus';
import type message from "~/types/message";

export default function fetchHistory(socket:Socket):void {
  //履歴データの受け取り
  socket.on("RESULT::fetchHistory", (
    dat: {
      result:string,
      data: {
        channelId: string,
        historyData: {
          history: message[],
          atTop: boolean,
          atEnd: boolean
        }
      }
    }
  ) => {
    console.log("fetchHistory :: socketon(fetchHistory) : dat->", dat);

    const { getHistoryAvailability, insertHistory, setAvailability } = useHistory(); //piniaのActionsインポート

    //もし履歴データがnullならホルダーだけ作って終わり
    if (dat.data.historyData === null) {
      insertHistory(dat.data.channelId, []);
      setAvailability(dat.data.channelId, //履歴の位置データ
        {
          atTop: true,
          atEnd: true,
          latestFetchedHistoryLength: 0
        }
      );
    }
    
    //履歴をStoreへ格納
    insertHistory(dat.data.channelId, dat.data.historyData.history); //履歴データ

    //履歴取得中であることを無効化
    const { getAppStatus } = storeToRefs(useAppStatus());
    getAppStatus.value.fetchingHistory = false;

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
  });
}
