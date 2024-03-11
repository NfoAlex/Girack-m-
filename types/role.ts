export default interface role {
  roleId: string,
  name: string,
  color: string,
  ServerManage: boolean,
  RoleManage: boolean,
  ChannelRename: boolean,
  ChannelViewPrivate: boolean,
  ChannelCreateAndDelete: boolean,
  UserManage: boolean,
  MessageDelete: boolean,
  MessageAttatchFile: boolean
}
