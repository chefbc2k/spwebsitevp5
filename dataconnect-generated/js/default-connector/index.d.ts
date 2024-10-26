import { ConnectorConfig, DataConnect } from 'firebase/data-connect';
export const connectorConfig: ConnectorConfig;

export type TimestampString = string;

export type UUIDString = string;

export type Int64String = string;

export type DateString = string;



export interface Category_Key {
  id: UUIDString;
  __typename?: 'Category_Key';
}

export interface ExperienceLevel_Key {
  id: UUIDString;
  __typename?: 'ExperienceLevel_Key';
}

export interface Language_Key {
  id: UUIDString;
  __typename?: 'Language_Key';
}

export interface NFTCategory_Key {
  nftId: UUIDString;
  categoryId: UUIDString;
  __typename?: 'NFTCategory_Key';
}

export interface NFTLanguage_Key {
  nftId: UUIDString;
  languageId: UUIDString;
  __typename?: 'NFTLanguage_Key';
}

export interface NFTProductionQuality_Key {
  nftId: UUIDString;
  productionQualityId: UUIDString;
  __typename?: 'NFTProductionQuality_Key';
}

export interface NFTRegionalDialect_Key {
  nftId: UUIDString;
  regionalDialectId: UUIDString;
  __typename?: 'NFTRegionalDialect_Key';
}

export interface NFTSecondaryLanguage_Key {
  nftId: UUIDString;
  secondaryLanguageId: UUIDString;
  __typename?: 'NFTSecondaryLanguage_Key';
}

export interface NFTStudioAvailability_Key {
  nftId: UUIDString;
  studioAvailabilityId: UUIDString;
  __typename?: 'NFTStudioAvailability_Key';
}

export interface NFTStyleToneOption_Key {
  nftId: UUIDString;
  styleToneOptionId: UUIDString;
  __typename?: 'NFTStyleToneOption_Key';
}

export interface NFTTechnicalSpecification_Key {
  nftId: UUIDString;
  technicalSpecificationId: UUIDString;
  __typename?: 'NFTTechnicalSpecification_Key';
}

export interface NFTTimeZone_Key {
  nftId: UUIDString;
  timeZoneId: UUIDString;
  __typename?: 'NFTTimeZone_Key';
}

export interface NFTVoiceTrait_Key {
  nftId: UUIDString;
  voiceTraitId: UUIDString;
  __typename?: 'NFTVoiceTrait_Key';
}

export interface NFT_Key {
  id: UUIDString;
  __typename?: 'NFT_Key';
}

export interface Ownership_Key {
  nftId: UUIDString;
  ownerId: UUIDString;
  __typename?: 'Ownership_Key';
}

export interface ProductionQuality_Key {
  id: UUIDString;
  __typename?: 'ProductionQuality_Key';
}

export interface RegionalDialect_Key {
  id: UUIDString;
  __typename?: 'RegionalDialect_Key';
}

export interface SecondaryLanguage_Key {
  id: UUIDString;
  __typename?: 'SecondaryLanguage_Key';
}

export interface StudioAvailability_Key {
  id: UUIDString;
  __typename?: 'StudioAvailability_Key';
}

export interface StyleToneCategory_Key {
  id: UUIDString;
  __typename?: 'StyleToneCategory_Key';
}

export interface StyleToneOption_Key {
  id: UUIDString;
  __typename?: 'StyleToneOption_Key';
}

export interface TechnicalSpecification_Key {
  id: UUIDString;
  __typename?: 'TechnicalSpecification_Key';
}

export interface TimeZone_Key {
  id: UUIDString;
  __typename?: 'TimeZone_Key';
}

export interface Transaction_Key {
  id: UUIDString;
  __typename?: 'Transaction_Key';
}

export interface UserExperience_Key {
  userId: UUIDString;
  experienceLevelId: UUIDString;
  __typename?: 'UserExperience_Key';
}

export interface User_Key {
  id: UUIDString;
  __typename?: 'User_Key';
}

export interface VoiceTrait_Key {
  id: UUIDString;
  __typename?: 'VoiceTrait_Key';
}



