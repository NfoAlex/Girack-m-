export interface IAPIClientInfo {
  apiClientId: string,
  apiKey: string,
  clientName: string,
  description: string,
  latestUsedTime: string,
  createdBy: string,
  isEnabled: boolean,
  approvedStatus: "WAITING" | "APPROVED" | "BANNED"
}