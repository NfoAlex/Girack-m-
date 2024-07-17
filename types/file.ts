export interface file {
  id: string,
  userId: string,
  name: string,
  isPublic: boolean,
  size: number,
  uploadedDate: string
}

export interface folder {
  id: string,
  userId: string,
  name: string,
  positionedDirectoryId: string
}