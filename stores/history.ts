//履歴保存、管理
import { defineStore } from "pinia";
import { useMessageReadTime } from "./messageReadTime";

import type message from "~/types/message";

//履歴の長さ格納用(外では使わない)
const historyLengths = new Map<string, number>();

/**
 * 履歴の総量が400以上あるなら多いものから削るように
 * @addingLength 追加する履歴の長さ
 * @excludingChannelId 勝手に削らせないための除外するチャンネルId
 */
const cleanHistory = (addingLength:number, excludingChannelId:string) => {
  let totalLength = addingLength; //履歴全体の総量
  let largestLength = 0; //一番長い履歴数
  let largestChannelId = ""; //一番長い履歴数を持つチャンネルId

  //ループして一番大きい履歴を調べる
  for (const lengthMap of historyLengths) {
    totalLength += lengthMap[1];
    //もし除外するチャンネルIdを調べているならスキップ
    if (lengthMap[0] === excludingChannelId) continue;
    //今の最大数変数より多きれば変数を更新
    if (lengthMap[1] > largestLength) {
      largestLength = lengthMap[1];
      largestChannelId = lengthMap[0];
    }
  }

  //console.log("history :: cleanHistory : 削るチャンネル->", {largestChannelId}, {largestLength}, {totalLength});

  //もし総量が400未満なら停止
  if (totalLength < 400) return;

  //履歴の末端取得状況などを修正しながら履歴を削る
  try {
    //もし履歴の長さが３より上なら履歴の最後を持たないと設定
    if (
      useHistory()._History[largestChannelId].length > 3
    ) {
      useHistory()._Availability[largestChannelId].atTop = false;
    }

    //削る
    useHistory()._History[largestChannelId].splice(3);
    //長さ更新
    historyLengths.set(largestChannelId, 3);

    console.log("削った", useHistory()._Availability[largestChannelId].atTop);
  } catch(e) {}
}

export const useHistory = defineStore("history", {
  state: () =>
    ({
      _History: {
        //履歴データ
        /*
      "0001": [
        {
          ...
        },
        {
          ...
        }
      ]
      */
      },
      _Availability: {
        //履歴の取得状態
        /*
      "0001": {
        atTop: false,
        atEnd: true
        latestFetchedHistoryLength: 13
      }
      */
      },
      _ThereIsNewMessage: false, //全体で新着が1つでもあるかどうか
      _HasNewMessage: {
        //新着があるかどうか状態
        /*
      "0001":false
      }
      */
      },
      _LatestMessage: {
        //それぞれのチャンネルの最新メッセージになるもの
        /*
      "0001": {
        messageId: "98172389",
        userId: "011198289",
        content: "asdf",
        ...
      }
      */
      },
    }) as {
      _History: {
        [key: string]: message[];
      };
      _Availability: {
        [key: string]: {
          atTop: boolean; //履歴の一番最初にいるかどうか
          atEnd: boolean; //履歴の一番最新にいるかどうか
          latestFetchedHistoryLength: number; //最後に取得した履歴の長さ
        };
      };
      _ThereIsNewMessage: boolean;
      _HasNewMessage: {
        [key: string]: boolean;
      };
      _LatestMessage: {
        [key: string]: message | null;
      };
    },

  getters: {
    //対象チャンネルの履歴を全部返す
    getHistoryFromChannel:
      (state) =>
      (channelId: string): message[] => {
        //もし特定のチャンネル用の履歴JSONが空なら作る
        if (state._History[channelId] === undefined) {
          state._History[channelId] = [];
          state._Availability[channelId] = {
            atTop: false,
            atEnd: false,
            latestFetchedHistoryLength: 0,
          };
        }

        return state._History[channelId];
      },

    //対象チャンネル用の履歴の位置データを返す
    getHistoryAvailability: (state) => (channelId: string) => {
      //そのチャンネル用の履歴位置データが無ければ作成
      if (state._Availability[channelId] === undefined) {
        state._Availability[channelId] = {
          atTop: false,
          atEnd: false,
          latestFetchedHistoryLength: 0,
        };
      }
      //返す
      return state._Availability[channelId];
    },

    //指定チャンネルの新着を取得
    getHasNewMessage: (state) => (channelId: string) => {
      return state._HasNewMessage[channelId];
    },

    //全体で新着があるかどうか
    getThereIsNewMessage: (state) => {
      return state._ThereIsNewMessage;
    },

    //対象チャンネルの最新のメッセージ取得、ないなら空データを返す
    getLatestMessage: (state) => (channelId: string) => {
      //参照して返す
      if (state._LatestMessage[channelId] !== undefined) {
        return state._LatestMessage[channelId];
      }

      //メッセージのデータホルダー
      const blankMessage: message = {
        messageId: "UNDEFINED",
        channelId: "UNDEFINED",
        userId: "UNDEFINED",
        content: "",
        linkData: {},
        time: "",
        reaction: {},
        isEdited: false,
        fileId: [],
        isSystemMessage: false
      };
      return blankMessage;
    },
  },

  actions: {
    //メッセージを履歴へ追加
    addMessage(message: message) {
      //もし特定のチャンネル用の履歴JSONが空なら作る
      if (this._History[message.channelId] === undefined) {
        return;
      }

      //最新メッセージを更新
      this._LatestMessage[message.channelId] = message;

      //履歴の最新にいるときのみ更新する
      if (this._Availability[message.channelId].atEnd) {
        //履歴が61以上あるなら古い方を1つ削除してトップにいないと設定
        if (this._History[message.channelId].length > 121) {
          //もし履歴の一番最後が最新既読と一緒なら停止
          try {
            const { getMessageReadTime } = useMessageReadTime();
            if (
              this._History[message.channelId][
                this._History[message.channelId].length - 1
              ].time === getMessageReadTime(message.channelId)
            ) {
              console.log("store(history) :: addMessage : 履歴追加を停止");
              return;
            }
          } catch (e) {}

          this._History[message.channelId].splice(60);
          this._Availability[message.channelId].atTop = false;
        }

        //メッセージ追加
        this._History[message.channelId].unshift(message);
      }
    },

    //メッセージを更新
    updateMessage(message: message) {
      //履歴分ループ
      for (const index in this._History[message.channelId]) {
        //IDが一致するメッセージを探して更新する
        if (
          this._History[message.channelId][index].messageId ===
          message.messageId
        ) {
          this._History[message.channelId][index] = message;
          break;
        }
      }
    },

    //履歴をまるごと上書きする
    setHistory(channelId: string, history: message[]) {
      //もし特定のチャンネル用の履歴JSONが空なら作る
      if (this._History[channelId] === undefined) {
        this._History[channelId] = [];
      }

      //メッセージを１個ずつ追加する
      for (const msg of history) {
        this._History[channelId].push(msg);
      }

      //履歴の長さ格納
      historyLengths.set(channelId, this._History[channelId].length);
      cleanHistory(history.length, channelId);
    },

    //履歴を挿入
    insertHistory(channelId: string, historyInserting: message[]) {
      //履歴の数を計算して見ていない部分を削る
      cleanHistory(historyInserting.length, channelId);

      //もし特定のチャンネル用の履歴JSONが空なら作ってそれを格納して終わる
      if (this._History[channelId] === undefined) {
        //空のを作る
        this._History[channelId] = [];
        //メッセージを１個ずつ追加する
        for (const msg of historyInserting) {
          this._History[channelId].push(msg);
        }

        //履歴の長さ格納
        historyLengths.set(channelId, this._History[channelId].length);

        return;
      }

      //挿入データ長が0ならここで停止
      if (historyInserting.length === 0) {
        return;
      }

      //もし挿入先が0からそのまま代入
      if (this._History[channelId].length === 0) {
        this._History[channelId] = historyInserting;
      }

      // console.log("history :: insertHistory : 時間の比較 履歴データ最新->", parseInt(this._History[channelId][0].time),
      //   " 挿入データの最後->", parseInt(historyInserting[1].time)
      // );

      //履歴の最新のメッセージ時間と取得した履歴の最後のメッセージ時間を比較して追加する場所を決める
      if (
        this._History[channelId][this._History[channelId].length - 1].time <=
        historyInserting[0].time
      ) {
        //取得データが履歴Storeより新しい
        //取得した履歴データが最新になるように配列をセット
        this._History[channelId] = [
          ...historyInserting,
          ...this._History[channelId],
        ];

        //console.log("history :: insertHistory : 新しいのを挿入した履歴の長さ->", this._History[channelId].length);

        //履歴データが120以上あるなら古い方を削る
        if (this._History[channelId].length >= 120) {
          this._History[channelId].splice(60);
          //削っているので最後にいるかどうかは必ずfalseになるはず
          this._Availability[channelId].atTop = false;
        }
      } else {
        //取得データが履歴Storeより古い
        //取得した履歴データが最後になるように配列をセット
        this._History[channelId] = [
          ...this._History[channelId],
          ...historyInserting,
        ];

        //console.log("history :: insertHistory : 古いのを挿入した履歴の長さ->", this._History[channelId].length);

        //履歴データが120以上あるなら新しい方を削る
        if (this._History[channelId].length >= 120) {
          this._History[channelId].splice(0, 30);
          //削っているので先頭にいるかどうかは必ずfalseになるはず
          this._Availability[channelId].atEnd = false;
        }
      }

      //履歴の長さ格納
      historyLengths.set(channelId, this._History[channelId].length);
    },

    //履歴の位置データを格納
    setAvailability(
      channelId: string,
      atData: {
        atTop: boolean;
        atEnd: boolean;
        latestFetchedHistoryLength: number;
      },
    ) {
      //そのチャンネル用の履歴位置データが無ければ作成
      if (this._Availability[channelId] === undefined) {
        this._Availability[channelId] = {
          atTop: false,
          atEnd: false,
          latestFetchedHistoryLength: 0,
        };
      }

      //格納
      this._Availability[channelId] = atData;
    },

    //新着があるかを設定
    setHasNewMessage(channelId: string, hasNewMessage: boolean) {
      this._HasNewMessage[channelId] = hasNewMessage;

      if (hasNewMessage) {
        useHead({
          titleTemplate: "[*]Girack",
        });
        this._ThereIsNewMessage = true;
        return;
      }

      //ループして新着アリならタブ名と状態更新
      for (const channelId in this._HasNewMessage) {
        if (this._HasNewMessage[channelId]) {
          //タイトル更新
          useHead({
            titleTemplate: "[*]Girack",
          });
          this._ThereIsNewMessage = true;
          return;
        }
      }

      useHead({
        titleTemplate: "Girack",
      });
      this._ThereIsNewMessage = false;
    },

    //最新メッセを更新する
    setLatestmessage(channelId: string, message: message) {
      this._LatestMessage[channelId] = message;
    },

    //指定のチャンネルのデータ削除
    deleteHistoryData(channelId: string) {
      delete this._History[channelId];
      delete this._Availability[channelId];
      delete this._HasNewMessage[channelId];
      delete this._LatestMessage[channelId];
    },

    //メッセージを削除
    deleteMessage(channelId: string, messageId: string) {
      //履歴分ループ
      for (const index in this._History[channelId]) {
        //IDが一致するメッセージを探して削除
        if (this._History[channelId][index].messageId === messageId) {
          this._History[channelId].splice(Number.parseInt(index), 1);

          //もし履歴が最後まであるなら新着状態を確認
          if (this._Availability[channelId].atEnd) {
            //時間比較
            const { getMessageReadTime } = useMessageReadTime();
            if (
              new Date(this._History[channelId][0]?.time || "").valueOf() <=
              new Date(getMessageReadTime(channelId)).valueOf()
            ) {
              useHead({
                titleTemplate: "Girack",
              });
              this.setHasNewMessage(channelId, false);
            }
          }

          return;
        }
      }
    },
  },
});
