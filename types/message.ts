export default interface message {
  messageId: string,
  channelId: string,
  userId: string,
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
  time: string,
  reaction: {
    [key: string]: {
      [key: string]: number
    }
  }
}

export interface inbox {
  "mention": {
    [key: string]: {
      senderUserId: string,
    }
  },
  "event": {
    [key: string]: {
      senderUserId: string,
      channelId: string,
    }
  }
}