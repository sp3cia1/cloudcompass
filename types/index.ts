// =========================================
// Enums for fixed options in questionnaire
// =========================================

// Application characteristics enums
export enum ApplicationType {
  WEB = 'web',
  MOBILE = 'mobile',
  API = 'api',
  ECOMMERCE = 'ecommerce',
  CONTENT = 'content',
  ANALYTICS = 'analytics',
  IOT = 'iot',
  OTHER = 'other'
}

export enum ComplexityLevel {
  SIMPLE = 'simple',
  MODERATE = 'moderate',
  COMPLEX = 'complex',
  ENTERPRISE = 'enterprise'
}

// Scaling & performance enums
export enum TrafficPattern {
  STEADY = 'steady',
  BUSINESS_HOURS = 'business-hours',
  VARIABLE = 'variable',
  UNPREDICTABLE = 'unpredictable',
  EVENT_DRIVEN = 'event-driven'
}

export enum AvailabilityLevel {
  STANDARD = 'standard', // 99.9% (8.76 hours/year downtime)
  ENHANCED = 'enhanced', // 99.95% (4.38 hours/year downtime)
  HIGH = 'high',         // 99.99% (52.6 minutes/year downtime)
  CRITICAL = 'critical'  // 99.999% (5.26 minutes/year downtime)
}

// Data management enums
export enum DataType {
  RELATIONAL = 'relational',
  DOCUMENT = 'document',
  KEY_VALUE = 'key-value',
  BLOB = 'blob',
  FILE = 'file',
  MULTIMEDIA = 'multimedia',
  TIME_SERIES = 'time-series',
  GRAPH = 'graph',        // Adding graph database type
  STREAM = 'stream'
}

export enum DataAccessPattern {
  READ_HEAVY = 'read-heavy',
  WRITE_HEAVY = 'write-heavy',
  BALANCED = 'balanced',
  BURSTY = 'bursty'
}

// Security & geographic enums
export enum SecurityLevel {
  BASIC = 'basic',
  ENHANCED = 'enhanced',
  HIGH = 'high'
}

export enum GeographicRegion {
  NORTH_AMERICA = 'north-america',
  SOUTH_AMERICA = 'south-america',
  EUROPE = 'europe',
  ASIA_PACIFIC = 'asia-pacific',
  MIDDLE_EAST = 'middle-east',
  AFRICA = 'africa'
}

export enum ComplianceType {
  NONE = 'none',
  HIPAA = 'hipaa',
  PCI = 'pci',
  GDPR = 'gdpr',
  SOX = 'sox',
  FEDRAMP = 'fedramp',
  OTHER = 'other'
}

// =========================================
// Interfaces for each questionnaire section
// =========================================

export interface ApplicationCharacteristics {
  applicationType: ApplicationType;
  complexityLevel: ComplexityLevel;
  hasAuthentication: boolean;
  hasFileUploads: boolean;
  hasPaymentProcessing: boolean;
  isRealTime: boolean;
  coreFeatures: string[];
}

export interface ScalingParameters {
  expectedConcurrentUsers: number;
  trafficPattern: TrafficPattern;
  peakTrafficMultiplier: number;
  availabilityLevel: AvailabilityLevel;
  maxAcceptableLatencyMs: number;
}

export interface DataManagementRequirements {
  dataTypes: DataType[];
  estimatedStorageGB: number;
  dataAccessPattern: DataAccessPattern;
  dataBackupNeeded: boolean;
  dataCachingNeeded: boolean;
  dataRetentionPeriodDays: number;
}

export interface GeographicRequirements {
  targetRegions: GeographicRegion[];
  primaryRegion: GeographicRegion;
  requiresMultiRegion: boolean;
  userDistribution: Record<GeographicRegion, number>; // Percentage of users in each region
}

export interface SecurityRequirements {
  securityLevel: SecurityLevel;
  complianceRequirements: ComplianceType[];
  additionalCapabilities: string[];
  requiresVPN: boolean;
  requiresWAF: boolean;
  requiresDataEncryption: boolean;
  requiresPrivateNetworking: boolean;
}

export interface BudgetRequirements {
  monthlyBudgetUSD: number;
  budgetFlexibilityPercent: number;
  prioritizeCostSavings: boolean;
  willConsiderReservedInstances: boolean;
}

// =========================================
// Complete questionnaire state interface
// =========================================

export interface QuestionnaireState {
  currentStep: number;
  application: ApplicationCharacteristics;
  scaling: ScalingParameters;
  data: DataManagementRequirements;
  geographic: GeographicRequirements;
  security: SecurityRequirements;
  budget: BudgetRequirements;
  isComplete: boolean;
}

// =========================================
// Default/initial values
// =========================================

export const defaultQuestionnaireState: QuestionnaireState = {
  currentStep: 0,
  application: {
    applicationType: ApplicationType.WEB,
    complexityLevel: ComplexityLevel.MODERATE,
    hasAuthentication: true,
    hasFileUploads: false,
    hasPaymentProcessing: false,
    isRealTime: false,
    coreFeatures: []
  },
  scaling: {
    expectedConcurrentUsers: 100,
    trafficPattern: TrafficPattern.STEADY,
    peakTrafficMultiplier: 2,
    availabilityLevel: AvailabilityLevel.STANDARD,
    maxAcceptableLatencyMs: 300
  },
  data: {
    dataTypes: [DataType.RELATIONAL],
    estimatedStorageGB: 10,
    dataAccessPattern: DataAccessPattern.BALANCED,
    dataBackupNeeded: true,
    dataCachingNeeded: false,
    dataRetentionPeriodDays: 365
  },
  geographic: {
    targetRegions: [GeographicRegion.NORTH_AMERICA],
    primaryRegion: GeographicRegion.NORTH_AMERICA,
    requiresMultiRegion: false,
    userDistribution: {
      [GeographicRegion.NORTH_AMERICA]: 100,
      [GeographicRegion.SOUTH_AMERICA]: 0,
      [GeographicRegion.EUROPE]: 0,
      [GeographicRegion.ASIA_PACIFIC]: 0,
      [GeographicRegion.MIDDLE_EAST]: 0,
      [GeographicRegion.AFRICA]: 0
    }
  },
  security: {
    securityLevel: SecurityLevel.BASIC,
    complianceRequirements: [ComplianceType.NONE],
    additionalCapabilities: [],
    requiresVPN: false,
    requiresWAF: false,
    requiresDataEncryption: true,
    requiresPrivateNetworking: false
  },
  budget: {
    monthlyBudgetUSD: 1000,
    budgetFlexibilityPercent: 10,
    prioritizeCostSavings: true,
    willConsiderReservedInstances: false
  },
  isComplete: false
}