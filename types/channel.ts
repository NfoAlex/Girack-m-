export interface getchannelList {
  name: string;
  id: string;
}

export interface channel {
  channelId: string,
  channelName: string,
  createdBy: string,
  description: string,
  isPrivate: boolean,
  speakableRole: string[]
};
