import { useRole } from "~/stores/role";
import { useMyUserinfo } from "~/stores/userinfo";
import type role from "~/types/role";

const { getMyUserinfo } = storeToRefs(useMyUserinfo());

export default function getMyRolePower():{
  ServerManage: boolean,
  RoleManage: boolean,
  ChannelRename: boolean,
  ChannelViewPrivate: boolean,
  ChannelCreateAndDelete: boolean,
  UserManage: boolean,
  MessageDelete: boolean,
  MessageAttatchFile: boolean
} {
  //持っている権限力
  let rolePower:any = {
    ServerManage: false,
    RoleManage: false,
    ChannelRename: false,
    ChannelViewPrivate: false,
    ChannelCreateAndDelete: false,
    UserManage: false,
    MessageDelete: false,
    MessageAttatchFile: false
  };
  //自分が持っているロールのID配列
  const myRoleArr:string[] = getMyUserinfo.value.role;
  //ロールIDの数分調べて権限割り当て
  for (let roleIdChecking of myRoleArr) {
    const rolePowerForThis = useRole().getRoleSingle(roleIdChecking);

    //JSON結合
    rolePower = Object.assign(rolePower, rolePowerForThis);
  }

  console.log("getMyRolePower :: 権限力->", rolePower);

  //名前とかも記録されるため必要じゃないものを削除
  delete rolePower.name;
  delete rolePower.color;
  delete rolePower.roleId;

  return rolePower;
}
