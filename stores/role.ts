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
        state._Roles[roleId] = {
          roleId: roleId,
          name: "Loading...",
          color: "#ffffff",
          ServerManage: false,
          RoleManage: false,
          ChannelRename: false,
          ChannelViewPrivate: false,
          ChannelCreateAndDelete: false,
          UserManage: false,
          MessageDelete: false,
          MessageAttatchFile: false
        };
        return state._Roles[roleId];
      }
    }
  }
});
