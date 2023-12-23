export default interface userInfo {
  userName: string;
}

export default interface GirakAuthInfo {
  result: boolean;
  userid: string;
  username: string;
  sessionid: string;
  role: string;
  channelJoined: [string];
}
