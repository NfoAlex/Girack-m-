//ロール情報保存
import { defineStore } from "pinia";

import type role from "~/types/role";

export const useRole = defineStore("role", {
  state: () => 
  ({
    _RoleLevel: 0,
    _Roles: {
      "MEMBER": {
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
        MessageAttatchFile: false
      },
      "HOST": {
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
        MessageAttatchFile: true
      }
    }
  } as {
    _RoleLevel: number,
    _Roles: {
      [key: string]: role
    }
  }),
  
  getters: {
    getRoleLevel:(state) => ():number => {
      return state._RoleLevel;
    },

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
          ChannelRename: false,
          ChannelViewPrivate: false,
          ChannelCreateAndDelete: false,
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

      this._RoleLevel = calcMyRole();
    },

    //単一ロールの設定
    bindRoleSingle(role:role) {
      this._Roles[role.roleId] = role;

      this._RoleLevel = calcMyRole();
    }
  }
});

//自分のロールレベルを計算
function calcMyRole() {
  const roleDataChecking:role = useRole().getRoleSingle("MEMBER");

  try {

    //権限をそれぞれ調べてレベルを返す
    if (roleDataChecking.ServerManage) {
      return 5;
    } else if (roleDataChecking.RoleManage) {
      return 4;
    } else if (
      roleDataChecking.ChannelViewPrivate
      ||
      roleDataChecking.UserManage
    ) {
      return 3;
    } else if (
      roleDataChecking.ChannelRename
      ||
      roleDataChecking.MessageDelete
    ) {
      return 2;
    }

    //2以下はもう1として返す
    return 1;

  } catch(e) {

    console.log("calcRole :: エラー ->", e);
    return 0;

  }
}
