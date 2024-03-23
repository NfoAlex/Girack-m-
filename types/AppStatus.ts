export default interface AppStatus {
  connected: boolean,
  profile: {
    authDone: boolean,
    UserinfoLoaded: boolean
  }
}
