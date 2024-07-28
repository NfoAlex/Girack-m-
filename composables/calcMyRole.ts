//ロールのレベルを計算する
import type role from "~/types/role";
import getMyRolePower from "./getMyRolePower";

/*
//権限それぞれの持つレベル(数値)
const roleLevel:{
  [key:string]: number
} = {
  ServerManage: 5,
  RoleManage: 4,
  ChannelRename: 2,
  ChannelViewPrivate: 3,
  ChannelCreateAndDelete: 2,
  UserManage: 3,
  MessageDelete: 2,
  MessageAttatchFile: 1
};
*/

export default function calcMyRole() {
  try {
    //自分が持っている権限データ取得
    const roleDataChecking = getMyRolePower();

    //権限をそれぞれ調べてレベルを返す
    if (roleDataChecking.ServerManage) {
      return 5;
    }
    if (roleDataChecking.RoleManage) {
      return 4;
    }
    if (roleDataChecking.UserManage || roleDataChecking.ChannelManage) {
      return 3;
    }
    if (roleDataChecking.MessageDelete) {
      return 2;
    }

    //2以下はもう1として返す
    return 1;
  } catch (e) {
    console.log("calcRole :: エラー ->", e);
    return 0;
  }
}
