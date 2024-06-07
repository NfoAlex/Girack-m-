export default interface message {
  messageId: string,
  channelId: string,
  userId: string,
  content: string,
  linkData: {
    [key: string]:
      {
        contentType: "text/html",
        mediaType: string,
        url: string,
        siteName: string,
        title: string,
        description: string,
        images: string[]
      }
        |
      {
        mediaType: "image"|"video",
        url: string,
        contentType: string,
        favicons: string[]
      }
  }|null,
  time: string,
  reaction: {
    [key: string]: {
      [key: string]: number
    }
  }
}
