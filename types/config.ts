export default interface Config {
  notification: {
    enabled: boolean,
    notifyAllMessages: boolean,
    notifyMention: boolean
  },
  theme: "dark"|"light",
  channel: {
    displayRole: boolean,
    displayAttatchmentSizeLimit: number,
  },
  sidebar: {
    ReadAllButtonEnabled: boolean,
    ReadAllButtonByShiftKey: boolean
  }
}
