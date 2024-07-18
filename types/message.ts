export default interface message {
  messageId: string,
  channelId: string,
  userId: string,
  isEdited: boolean,
  content: string,
  linkData: {
    [key: string]:
      {
        contentType: "text/html"|"video",
        mediaType: string,
        url: string,
        siteName?: string,
        title?: string,
        description?: string,
        favicon: string,
        images?: {url:string, type:string}[]
      }
      |
      {
        contentType: "image",
        mediaType: "image",
        url: string
      }
  },
  fileId: string[],
  time: string,
  reaction: {
    [key: string]: {
      [key: string]: number
    }
  }
}

export interface inbox {
  "mention": {
    [key: string]: string[] //ここでのkeyはチャンネルId
  },
  "event": {
    [key: string]: string[] //ここでのkeyはチャンネルId
  }
}