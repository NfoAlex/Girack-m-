//ファイル情報の受け取り

import type { Socket } from "socket.io-client"; //クラス識別用
import { useFileInfo } from "~/stores/FileInfo";
import type { file } from "~/types/file";

export default function fetchFileInfo(socket: Socket): void {
  socket.on(
    "RESULT::fetchFileInfo",
    (dat: {
      result: string;
      data: {
        fileId: string;
        fileInfo: file | null;
      };
    }) => {
      console.log("fetchFileInfo :: データ->", dat);

      const { updateFileInfo } = useFileInfo();
      //データがあるなら更新する
      if (dat.data.fileInfo !== null) {
        updateFileInfo(dat.data.fileInfo);
      } else {
        updateFileInfo({
          id: dat.data.fileId,
          userId: "",
          name: "Deleted...",
          isPublic: false,
          size: 0,
          type: "*/*",
          directory: "",
          uploadedDate: "",
          isDelete: true
        });
      }
    },
  );
}
