export type Jurisdiction = {
  jurisdictionClass: string;
  jurisdictionName: string;
  jurisdictionNameAbbr: string;
  FcClass: string;
};

export type Store = {
  jurisdictionClass: string;
  jurisdictionName: string;
  companyCode: string;
  companyName: string;
  storeCode: string;
  storeName: string;
  zipCode?: string;
  address1?: string;
  address2?: string;
  addressDetail?: string;
  tel?: string;
  fax?: string;
  mapId: string;
  versionSize: number;
};
