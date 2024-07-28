export interface MyUserinfo {
  userName: string; //名前
  role: string[]; //ロール
  userId: string; //ユーザーID
  banned: boolean; //BANされたかどうか
  channelJoined: string[]; //参加しているチャンネル
}

export interface GirakAuthInfo {
  result: boolean;
  userid: string;
  username: string;
  sessionid: string;
  role: string;
  channelJoined: [string];
}
