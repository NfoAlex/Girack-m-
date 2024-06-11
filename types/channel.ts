export interface getchannelList {
  name: string;
  id: string;
}

export interface channelOrder {
  channelId: string,
  isThread: boolean,
  isFolder: boolean,
  child?: any[]
};

export interface channel {
  channelId: string,
  channelName: string,
  createdBy: string,
  description: string,
  isPrivate: boolean,
  speakableRole: string[]
};
