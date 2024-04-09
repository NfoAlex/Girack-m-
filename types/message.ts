export default interface message {
  messageId: string,
  channelId: string,
  userId: string,
  content: string,
  time: string,
  reaction: {
    [key: string]: {
      [key: string]: number
    }
  }
}
