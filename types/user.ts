export interface MyUserinfo {
  username: string, //名前
  role: string[], //ロール
  userid: string, //ユーザーID
  banned: boolean, //BANされたかどうか
  sessionid: string, //セッションID
  channelJoined: string[], //参加しているチャンネル
}

export interface GirakAuthInfo {
  result: boolean;
  userid: string;
  username: string;
  sessionid: string;
  role: string;
  channelJoined: [string];
}
