export interface Serverinfo {
  servername: string,
  registration: {
    available: boolean,
    invite: {
      inviteOnly: boolean,
    },
  },
  config: {
    PROFILE: {
      iconMaxSize: number,
      usernameMaxLength: number
    },
    CHANNEL: {
      channelIdAnnounceRegistration: string,
      defaultJoinOnRegister: string[],
    },
    MESSAGE: {
      TxtMaxLength: number,
      FileMaxSize: number,
    },
  }
}
