import { ConnectorConfig, DataConnect } from 'firebase/data-connect';
export const connectorConfig: ConnectorConfig;

export type TimestampString = string;

export type UUIDString = string;

export type Int64String = string;

export type DateString = string;



export interface NFT_Key {
  id: UUIDString;
  __typename?: 'NFT_Key';
}

export interface Ownership_Key {
  nftId: UUIDString;
  ownerId: UUIDString;
  __typename?: 'Ownership_Key';
}

export interface Transaction_Key {
  id: UUIDString;
  __typename?: 'Transaction_Key';
}

export interface User_Key {
  id: UUIDString;
  __typename?: 'User_Key';
}



