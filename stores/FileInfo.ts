import { defineStore } from "pinia";
//ファイル情報のキャッシュ
import { socket } from "~/socketHandlers/socketInit";
import { useMyUserinfo } from "~/stores/userinfo";
import type { file } from "~/types/file";

export const useFileInfo = defineStore("fileinfo", {
  state: () =>
    ({
      _FileInfo: {},
    }) as {
      _FileInfo: {
        [key: string]: file;
      };
    },

  getters: {
    getFileInfos: (state) => {
      return state._FileInfo;
    },

    //ファイルデータを取得する、無いなら空データを返して後から更新する
    getFileInfoSingle:
      (state) =>
      (fileId: string): file => {
        //もしファイル情報があるなら返す
        if (state._FileInfo[fileId] !== undefined) {
          return state._FileInfo[fileId];
        }

        //空データを割り当てる
        state._FileInfo[fileId] = {
          id: fileId,
          userId: "",
          name: "Loading...",
          isPublic: false,
          size: 0,
          type: "*/*",
          directory: "",
          uploadedDate: "",
          isDelete: false
        };

        //ファイル情報を取得
        const { getMyUserinfo, getSessionId } = storeToRefs(useMyUserinfo());
        socket.emit("fetchFileInfo", {
          RequestSender: {
            userId: getMyUserinfo.value.userId,
            sessionId: getSessionId.value,
          },
          fileId: fileId,
        });

        //空データを返す
        return state._FileInfo[fileId];
      },
  },

  actions: {
    //ファイルデータを格納
    updateFileInfo(data: file) {
      this._FileInfo[data.id] = data;
    },

    //指定のファイルデータを削除されたと設定
    deleteFileInfo(fileId: string) {
      this._FileInfo[fileId] = {
        id: fileId,
        userId: "",
        name: "",
        isPublic: false,
        size: 0,
        type: "*/*",
        directory: "",
        uploadedDate: "",
        isDelete: true
      };
    }
  },
});
