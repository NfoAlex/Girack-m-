export default interface AppStatus {
  connected: boolean,
  fetchingHistory: boolean,
  profile: {
    authDone: boolean,
    UserinfoLoaded: boolean
  }
}
