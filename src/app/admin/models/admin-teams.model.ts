export interface TeamsModel {
  id: number,
  createdAt: Date,
  createdBy: number,
  updatedAt: Date,
  updatedBy: number,
  TFFClubCode: string,
  officialName: string,
  shortName: string,
  imagePath: string,
  imageAttachment: File,
  city: string,
  town: string,
  address: string,
  phoneNumber: string,
  faxNumber: string,
  stadiumId: number,
  presidentName: string,
  colorCodes: string,
  websiteURL: string,
  isASKFMember: boolean,
  isVisible: boolean,
  longitude: number,
  latitude: number,
  mapUrl: string
}
