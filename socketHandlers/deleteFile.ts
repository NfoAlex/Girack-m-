//ファイルの削除を受け取る

import type { Socket } from "socket.io-client"; //クラス識別用
import { deleteBlobUrl } from "~/composables/manageBlobUrl";
import { useFileInfo } from "~/stores/FileInfo";

export default function deleteFile(socket: Socket): void {
  socket.on(
    "RESULT::deleteFile",
    (dat: {
      result: string;
      data: string; //ファイルId
    }) => {
      console.log("deleteFile :: 削除するファイルId用データ->", dat);

      const { deleteFileInfo } = useFileInfo();
      if (dat.result === "SUCCESS") {
        //ファイルデータが削除されたと設定する
        deleteFileInfo(dat.data);
        //指定のBlobURLを削除する
        deleteBlobUrl(dat.data);
      }
    },
  );
}
