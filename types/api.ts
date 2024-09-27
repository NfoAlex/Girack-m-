export interface IAPIClientInfo {
  apiClientId: string;
  apiKey: string;
  clientName: string;
  description: string;
  latestUsedTime: string;
  createdUserId: string;
  isEnabled: boolean;
  approvedStatus: "WAITING" | "APPROVED" | "BANNED";
}
