//自ユーザー情報の受け取り

import { Socket } from "socket.io-client"; //クラス識別用
import { useHistory } from "~/stores/history";
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

    //もし履歴データが無効なら終わり
    if (dat.data.historyData === null) return;

    //履歴をStoreへ格納
    const { setHistory, setAvailability } = useHistory(); //piniaのActionsインポート
    setHistory(dat.data.channelId, dat.data.historyData.history); //履歴データ
    setAvailability(dat.data.channelId, //履歴の位置データ
      {
        atTop: dat.data.historyData.atTop,
        atEnd: dat.data.historyData.atEnd
      }
    );
  });
}
