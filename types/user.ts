export interface MyUserinfo {
  username: string, //名前
  role: string,
  userid: string, //ユーザーID
  loggedin: boolean, //ログイン状態
  sessionid: string, //セッションID
  channelJoined: [string], //参加しているチャンネル
}

export interface GirakAuthInfo {
  result: boolean;
  userid: string;
  username: string;
  sessionid: string;
  role: string;
  channelJoined: [string];
}
