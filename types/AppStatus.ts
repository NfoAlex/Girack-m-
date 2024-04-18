export default interface AppStatus {
  connected: boolean,
  fetchingHistory: boolean,
  hasMessageReadId: boolean,
  profile: {
    authDone: boolean,
    UserinfoLoaded: boolean
  }
}
