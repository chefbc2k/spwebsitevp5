import { ConnectorConfig, DataConnect } from 'firebase/data-connect';
export const connectorConfig: ConnectorConfig;

export type TimestampString = string;

export type UUIDString = string;

export type Int64String = string;

export type DateString = string;



export interface ActivityLog_Key {
  id: UUIDString;
  __typename?: 'ActivityLog_Key';
}

export interface AnalyticsEvent_Key {
  id: UUIDString;
  __typename?: 'AnalyticsEvent_Key';
}

export interface Bid_Key {
  id: UUIDString;
  __typename?: 'Bid_Key';
}

export interface Category_Key {
  id: UUIDString;
  __typename?: 'Category_Key';
}

export interface CollectionNFT_Key {
  collectionId: UUIDString;
  nftId: UUIDString;
  __typename?: 'CollectionNFT_Key';
}

export interface Collection_Key {
  id: UUIDString;
  __typename?: 'Collection_Key';
}

export interface ContractNFT_Key {
  contractId: UUIDString;
  nftId: UUIDString;
  __typename?: 'ContractNFT_Key';
}

export interface ContractUser_Key {
  contractId: UUIDString;
  userId: UUIDString;
  __typename?: 'ContractUser_Key';
}

export interface ContractVoice_Key {
  contractId: UUIDString;
  voiceId: UUIDString;
  __typename?: 'ContractVoice_Key';
}

export interface Contract_Key {
  id: UUIDString;
  __typename?: 'Contract_Key';
}

export interface ExperienceLevel_Key {
  id: UUIDString;
  __typename?: 'ExperienceLevel_Key';
}

export interface Favorite_Key {
  userId: UUIDString;
  nftId: UUIDString;
  __typename?: 'Favorite_Key';
}

export interface Language_Key {
  id: UUIDString;
  __typename?: 'Language_Key';
}

export interface Listing_Key {
  id: UUIDString;
  __typename?: 'Listing_Key';
}

export interface Message_Key {
  id: UUIDString;
  __typename?: 'Message_Key';
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

export interface Notification_Key {
  id: UUIDString;
  __typename?: 'Notification_Key';
}

export interface Ownership_Key {
  nftId: UUIDString;
  ownerId: UUIDString;
  __typename?: 'Ownership_Key';
}

export interface PaymentMethod_Key {
  id: UUIDString;
  __typename?: 'PaymentMethod_Key';
}

export interface Permission_Key {
  id: UUIDString;
  __typename?: 'Permission_Key';
}

export interface ProductionQuality_Key {
  id: UUIDString;
  __typename?: 'ProductionQuality_Key';
}

export interface RegionalDialect_Key {
  id: UUIDString;
  __typename?: 'RegionalDialect_Key';
}

export interface Review_Key {
  id: UUIDString;
  __typename?: 'Review_Key';
}

export interface RolePermission_Key {
  roleId: UUIDString;
  permissionId: UUIDString;
  __typename?: 'RolePermission_Key';
}

export interface Role_Key {
  id: UUIDString;
  __typename?: 'Role_Key';
}

export interface Royalty_Key {
  id: UUIDString;
  __typename?: 'Royalty_Key';
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

export interface SupportTicket_Key {
  id: UUIDString;
  __typename?: 'SupportTicket_Key';
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

export interface UserCategory_Key {
  userId: UUIDString;
  categoryId: UUIDString;
  __typename?: 'UserCategory_Key';
}

export interface UserExperience_Key {
  userId: UUIDString;
  experienceLevelId: UUIDString;
  __typename?: 'UserExperience_Key';
}

export interface UserLanguage_Key {
  userId: UUIDString;
  languageId: UUIDString;
  __typename?: 'UserLanguage_Key';
}

export interface UserProductionQuality_Key {
  userId: UUIDString;
  productionQualityId: UUIDString;
  __typename?: 'UserProductionQuality_Key';
}

export interface UserRegionalDialect_Key {
  userId: UUIDString;
  regionalDialectId: UUIDString;
  __typename?: 'UserRegionalDialect_Key';
}

export interface UserRole_Key {
  userId: UUIDString;
  roleId: UUIDString;
  __typename?: 'UserRole_Key';
}

export interface UserSecondaryLanguage_Key {
  userId: UUIDString;
  secondaryLanguageId: UUIDString;
  __typename?: 'UserSecondaryLanguage_Key';
}

export interface UserStudioAvailability_Key {
  userId: UUIDString;
  studioAvailabilityId: UUIDString;
  __typename?: 'UserStudioAvailability_Key';
}

export interface UserStyleToneOption_Key {
  userId: UUIDString;
  styleToneOptionId: UUIDString;
  __typename?: 'UserStyleToneOption_Key';
}

export interface UserTechnicalSpecification_Key {
  userId: UUIDString;
  technicalSpecificationId: UUIDString;
  __typename?: 'UserTechnicalSpecification_Key';
}

export interface UserTimeZone_Key {
  userId: UUIDString;
  timeZoneId: UUIDString;
  __typename?: 'UserTimeZone_Key';
}

export interface UserVoiceTrait_Key {
  userId: UUIDString;
  voiceTraitId: UUIDString;
  __typename?: 'UserVoiceTrait_Key';
}

export interface User_Key {
  id: UUIDString;
  __typename?: 'User_Key';
}

export interface VoiceCategory_Key {
  voiceId: UUIDString;
  categoryId: UUIDString;
  __typename?: 'VoiceCategory_Key';
}

export interface VoiceExperience_Key {
  voiceId: UUIDString;
  experienceLevelId: UUIDString;
  __typename?: 'VoiceExperience_Key';
}

export interface VoiceLanguage_Key {
  voiceId: UUIDString;
  languageId: UUIDString;
  __typename?: 'VoiceLanguage_Key';
}

export interface VoiceProductionQuality_Key {
  voiceId: UUIDString;
  productionQualityId: UUIDString;
  __typename?: 'VoiceProductionQuality_Key';
}

export interface VoiceRegionalDialect_Key {
  voiceId: UUIDString;
  regionalDialectId: UUIDString;
  __typename?: 'VoiceRegionalDialect_Key';
}

export interface VoiceSecondaryLanguage_Key {
  voiceId: UUIDString;
  secondaryLanguageId: UUIDString;
  __typename?: 'VoiceSecondaryLanguage_Key';
}

export interface VoiceStudioAvailability_Key {
  voiceId: UUIDString;
  studioAvailabilityId: UUIDString;
  __typename?: 'VoiceStudioAvailability_Key';
}

export interface VoiceStyleToneOption_Key {
  voiceId: UUIDString;
  styleToneOptionId: UUIDString;
  __typename?: 'VoiceStyleToneOption_Key';
}

export interface VoiceTechnicalSpecification_Key {
  voiceId: UUIDString;
  technicalSpecificationId: UUIDString;
  __typename?: 'VoiceTechnicalSpecification_Key';
}

export interface VoiceTimeZone_Key {
  voiceId: UUIDString;
  timeZoneId: UUIDString;
  __typename?: 'VoiceTimeZone_Key';
}

export interface VoiceTrait_Key {
  id: UUIDString;
  __typename?: 'VoiceTrait_Key';
}

export interface VoiceVoiceTrait_Key {
  voiceId: UUIDString;
  voiceTraitId: UUIDString;
  __typename?: 'VoiceVoiceTrait_Key';
}

export interface Voice_Key {
  id: UUIDString;
  __typename?: 'Voice_Key';
}



