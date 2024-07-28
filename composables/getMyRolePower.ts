import { useRole } from "~/stores/role";
import { useMyUserinfo } from "~/stores/userinfo";

interface onlyRolePower {
  name?: string;
  color?: string;
  roleId?: string;
  ServerManage: boolean;
  RoleManage: boolean;
  ChannelManage: boolean;
  UserManage: boolean;
  MessageDelete: boolean;
  MessageAttatchFile: boolean;
}

export default function getMyRolePower(): onlyRolePower {
  //持っている権限力
  let rolePower: onlyRolePower = {
    ServerManage: false,
    RoleManage: false,
    ChannelManage: false,
    UserManage: false,
    MessageDelete: false,
    MessageAttatchFile: false,
  };
  //自分が持っているロールのID配列
  const { getMyUserinfo } = storeToRefs(useMyUserinfo());
  const myRoleArr: string[] = getMyUserinfo.value.role;

  //ロールIDの数分調べて権限割り当て
  for (const roleIdChecking of myRoleArr) {
    const rolePowerForThis = useRole().getRoleSingle(roleIdChecking);

    //trueならtrueにする、falseなら変更無し
    rolePower = {
      ServerManage: rolePowerForThis.ServerManage
        ? true
        : rolePower.ServerManage,
      RoleManage: rolePowerForThis.RoleManage ? true : rolePower.RoleManage,
      ChannelManage: rolePowerForThis.ChannelManage
        ? true
        : rolePower.ChannelManage,
      UserManage: rolePowerForThis.UserManage ? true : rolePower.UserManage,
      MessageDelete: rolePowerForThis.MessageDelete
        ? true
        : rolePower.MessageDelete,
      MessageAttatchFile: rolePowerForThis.MessageAttatchFile
        ? true
        : rolePower.MessageAttatchFile,
    };
  }

  //名前とかも記録されるため必要じゃないものを削除
  delete rolePower.name;
  delete rolePower.color;
  delete rolePower.roleId;

  return rolePower;
}
