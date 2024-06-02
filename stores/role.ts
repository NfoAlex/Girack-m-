//ロール情報保存
import { defineStore } from "pinia";
import { socket } from "~/socketHandlers/socketInit";
import { useMyUserinfo } from "./userinfo";

import type role from "~/types/role";

export const useRole = defineStore("role", {
  state: () => 
  ({
    _Roles: {
      "MEMBER": {
        roleId: "MEMBER",
        name: "Member",
        color: "#ffffff",
        ServerManage: false,
        RoleManage: false,
        ChannelManage: false,
        UserManage: false,
        MessageDelete: false,
        MessageAttatchFile: false
      },
      "HOST": {
        roleId: "HOST",
        name: "Host",
        color: "#7E097E",
        ServerManage: true,
        RoleManage: true,
        ChannelManage: true,
        UserManage: true,
        MessageDelete: true,
        MessageAttatchFile: true
      }
    }
  } as {
    _Roles: {
      [key: string]: role
    }
  }),
  
  getters: {
    //全ロールを取得
    getRoles:(state) => ():{[key: string]: role} => {
      return state._Roles;
    },

    //ロールを単体で返す
    getRoleSingle:(state) => (roleId:string):role => {
      if (state._Roles[roleId] !== undefined) {
        return state._Roles[roleId];
      } else {
        //ホルダーとしてデータ追加
        state._Roles[roleId] = {
          roleId: roleId,
          name: "ロール",
          color: "#f00",
          ServerManage: false,
          RoleManage: false,
          ChannelManage: false,
          UserManage: false,
          MessageDelete: false,
          MessageAttatchFile: false
        };

        //ロール情報を取得する
        //RequestSender用
        const { getMyUserinfo, getSessionId } = storeToRefs(useMyUserinfo());
        //取得
        socket.emit("fetchRoleSingle", {
          RequestSender: {
            userId: getMyUserinfo.value.userId,
            sessionId: getSessionId.value
          },
          roleId: roleId
        });

        //ホルダーデータを返す
        return state._Roles[roleId];
      }
    }
  },

  actions: {
    //ロール情報を格納する
    bindRoles(roles:any) {
      this._Roles = roles;
    },

    //単一ロールの設定
    bindRoleSingle(role:role) {
      this._Roles[role.roleId] = role;
    }
  }
});
