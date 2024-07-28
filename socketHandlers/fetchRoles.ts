//全ロール情報受け取り用

import type { Socket } from "socket.io-client"; //クラス識別用
import { useRole } from "~/stores/role";
import type role from "~/types/role";

export default function fetchRoles(socket: Socket): void {
  //サーバー(インスタンス)情報
  socket.on(
    "RESULT::fetchRoles",
    (dat: {
      result: string;
      data: role[];
    }) => {
      //console.log("fetchRoles :: dat->", dat);

      //ロールパス用
      const roleParsed: {
        [key: string]: role;
      } = {
        MEMBER: {
          roleId: "MEMBER",
          name: "Member",
          color: "#ffffff",
          ServerManage: false,
          RoleManage: false,
          ChannelRename: false,
          ChannelViewPrivate: false,
          ChannelCreateAndDelete: false,
          UserManage: false,
          MessageDelete: false,
          MessageAttatchFile: false,
        },
        HOST: {
          roleId: "HOST",
          name: "Host",
          color: "#7E097E",
          ServerManage: true,
          RoleManage: true,
          ChannelRename: true,
          ChannelViewPrivate: true,
          ChannelCreateAndDelete: true,
          UserManage: true,
          MessageDelete: true,
          MessageAttatchFile: true,
        },
      };
      //JSONで扱える形式へパース
      for (const role of dat.data) {
        roleParsed[role.roleId] = role;
      }

      //ロール可能用処理をインポート
      const { bindRoles } = useRole();
      //格納
      bindRoles(roleParsed);
    },
  );
}
