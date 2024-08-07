//単一ロール情報受け取り用

import type { Socket } from "socket.io-client"; //クラス識別用
import { useRole } from "~/stores/role";
import type role from "~/types/role";

export default function fetchRoleSingle(socket: Socket): void {
  socket.on(
    "RESULT::fetchRoleSingle",
    (dat: {
      result: string;
      data: role;
    }) => {
      //console.log("fetchRoleSingle :: dat->", dat);

      //ロールセット用処理をインポート
      const { bindRoleSingle } = useRole();
      //格納
      bindRoleSingle(dat.data);
    },
  );
}
