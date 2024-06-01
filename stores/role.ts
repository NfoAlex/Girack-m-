//ロール情報保存
import { defineStore } from "pinia";

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
        return {
          roleId: roleId,
          name: "エラー",
          color: "#f00",
          ServerManage: false,
          RoleManage: false,
          ChannelManage: false,
          UserManage: false,
          MessageDelete: false,
          MessageAttatchFile: false
        };
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
