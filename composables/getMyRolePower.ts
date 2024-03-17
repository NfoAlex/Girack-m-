import { useRole } from "~/stores/role";
import { useMyUserinfo } from "~/stores/userinfo";

const { getRoleSingle } = storeToRefs(useRole());
const { getMyUserinfo } = storeToRefs(useMyUserinfo());

export default function getMyRolePower() {
  //持っている権限力
  let rolePower = {
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

  for (let roleId of myRoleArr) {
    rolePower = {
      ...rolePower, getRoleSingle(roleId)
    };
  }

  console.log("getMyRolePower :: 権限力->", rolePower);
  return rolePower;
}
