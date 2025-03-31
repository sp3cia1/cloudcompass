import { CloudProvider } from "@/lib/store/applicationState";
import { GeographicRegion, QuestionnaireState } from "./index";

// Core types for the architecture model
export type ComplexityPreference = 'simple' | 'balanced' | 'advanced';
export type ProviderStrategy = 'single' | 'best-of-breed';

/**
 * Complete cloud architecture with all components and their relationships
 */
export interface CloudArchitecture {
  id: string;
  name: string;
  description: string;
  provider: CloudProvider | 'multi';
  components: ArchitectureComponent[];
  connections: ComponentConnection[];
  regions: Region[];
  estimatedCost: CostEstimate;
  complexityLevel: ComplexityPreference;
  tags: string[];
  generatedAt: Date;
  lastUpdated: Date;
}

/**
 * Types of architecture components
 */
export enum ComponentType {
  // Compute
  VM = 'virtual-machine',
  CONTAINER = 'container',
  FUNCTION = 'serverless-function',
  KUBERNETES = 'kubernetes',
  
  // Storage
  OBJECT_STORAGE = 'object-storage',
  FILE_STORAGE = 'file-storage',
  BLOCK_STORAGE = 'block-storage',
  
  // Database
  RELATIONAL_DB = 'relational-database',
  DOCUMENT_DB = 'document-database',
  KEY_VALUE_DB = 'key-value-database',
  GRAPH_DB = 'graph-database',
  TIME_SERIES_DB = 'time-series-database',
  CACHE = 'cache',
  
  // Networking
  LOAD_BALANCER = 'load-balancer',
  CDN = 'content-delivery-network',
  VPC = 'virtual-private-cloud',
  VPN = 'virtual-private-network',
  DNS = 'domain-name-system',
  API_GATEWAY = 'api-gateway',
  
  // Security
  FIREWALL = 'firewall',
  WAF = 'web-application-firewall',
  IAM = 'identity-access-management',
  
  // Integration
  QUEUE = 'message-queue',
  EVENT_BUS = 'event-bus',
  STREAM = 'data-stream',
  
  // Monitoring
  MONITORING = 'monitoring',
  LOGGING = 'logging',
  ALERTING = 'alerting',
  
  // ML/AI
  ML_INFERENCE = 'machine-learning-inference',
  ML_TRAINING = 'machine-learning-training',
  
  // Other
  SEARCH = 'search-service',
  EMAIL = 'email-service',
  NOTIFICATION = 'notification-service',
  AUTH = 'authentication-service'
}

/**
 * Core building block of a cloud architecture
 */
export interface ArchitectureComponent {
  id: string;
  name: string;
  type: ComponentType;
  provider: CloudProvider;
  region: string;
  tier: string;
  specs: ComponentSpecs;
  configuration: Record<string, any>;
  estimatedCost: CostEstimate;
  tags: string[];
  description?: string;
  position?: Position; // For visualization
}

/**
 * Relationship between architecture components
 */
export interface ComponentConnection {
  id: string;
  sourceId: string;
  targetId: string;
  type: ConnectionType;
  configuration: Record<string, any>;
  dataFlowRate?: {
    average: number;
    unit: 'kbps' | 'mbps' | 'gbps' | 'rps'; // Rate per second
  };
  description?: string;
}


/**
 * Types of connections between components
 */
export enum ConnectionType {
  NETWORK = 'network',
  DEPENDENCY = 'dependency',
  DATA_FLOW = 'data-flow',
  EVENT = 'event',
  AUTHENTICATION = 'authentication'
}

/**
 * Cost estimate for a component or entire architecture
 */
export interface CostEstimate {
  monthlyCost: {
    amount: number;
    currency: string;
    confidence: 'low' | 'medium' | 'high';
  };
  breakdown: CostBreakdownItem[];
  assumptions: string[];
  optimizationSuggestions?: string[];
}

export interface CostBreakdownItem {
  name: string;
  monthlyCost: number;
  details: string;
  serviceType?: string;
}

/**
 * Provider-specific service implementation
 */
export interface ProviderServiceMapping {
  provider: CloudProvider;
  componentType: ComponentType;
  services: ProviderService[];
}

export interface ProviderService {
  id: string;
  name: string;
  description: string;
  tier: 'basic' | 'standard' | 'premium' | 'enterprise';
  minComplexityLevel: ComplexityPreference;
  capabilities: string[];
  limitations: string[];
  pricing: PricingModel[];
  regions: string[];
  documentation?: string;
}

/**
 * Pricing model for cloud services
 */
export interface PricingModel {
  type: 'on-demand' | 'reserved' | 'spot' | 'free-tier';
  unit: 'hour' | 'month' | 'request' | 'gb' | 'user';
  pricePerUnit: number;
  currency: string;
  minimumUnits?: number;
  freeUnits?: number;
  conditions?: string[];
}

/**
 * Cloud provider region
 */
export interface Region {
  id: string;
  name: string;
  provider: CloudProvider;
  continent: GeographicRegion;
  latitude: number;
  longitude: number;
  services: string[]; // Available services in this region
  tier?: 'primary' | 'secondary' | 'disaster-recovery';
}

/**
 * Component position for visualization
 */
export interface Position {
  x: number;
  y: number;
  z?: number; // For 3D visualizations
  width?: number;
  height?: number;
}

/**
 * Component specifications - union type for different component categories
 */
export type ComponentSpecs = 
  ComputeSpecs | 
  StorageSpecs | 
  DatabaseSpecs | 
  NetworkSpecs | 
  SecuritySpecs |
  IntegrationSpecs;

/**
 * Compute service specifications
 */
export interface ComputeSpecs {
  type: 'compute';
  cpu: {
    cores: number;
    architecture?: string;
  };
  memory: {
    amount: number;
    unit: 'MB' | 'GB';
  };
  operatingSystem?: string;
  scalingPolicy?: {
    min: number;
    max: number;
    targetCpuUtilization?: number;
  };
}



/**
 * Storage service specifications
 */
export interface StorageSpecs {
  type: 'storage';
  capacity: {
    amount: number;
    unit: 'GB' | 'TB';
  };
  throughput?: {
    read: number;
    write: number;
    unit: 'MBps' | 'GBps';
  };
  redundancy?: 'local' | 'zone' | 'region' | 'multi-region';
  backupPolicy?: {
    frequency: 'hourly' | 'daily' | 'weekly' | 'monthly';
    retention: number; // In days
  };
}

/**
 * Database service specifications
 */
export interface DatabaseSpecs {
  type: 'database';
  engine: string;
  version: string;
  storage: {
    amount: number;
    unit: 'GB' | 'TB';
  };
  replicas?: number;
  backupEnabled?: boolean;
  encryptionEnabled?: boolean;
  highAvailability?: boolean;
  readReplicas?: number;
}

/**
 * Network service specifications
 */
export interface NetworkSpecs {
  type: 'network';
  bandwidth?: {
    amount: number;
    unit: 'Mbps' | 'Gbps';
  };
  publicAccess?: boolean;
  encryption?: boolean;
  protocol?: string;
}

/**
 * Security service specifications
 */
export interface SecuritySpecs {
  type: 'security';
  encryptionAtRest?: boolean;
  encryptionInTransit?: boolean;
  complianceCertifications?: string[];
  authenticationMethod?: string;
  networkIsolation?: boolean;
}

/**
 * Integration service specifications
 */
export interface IntegrationSpecs {
  type: 'integration';
  messageSize?: {
    max: number;
    unit: 'KB' | 'MB';
  };
  throughput?: {
    amount: number;
    unit: 'msg/s' | 'req/s';
  };
  retentionPeriod?: {
    amount: number;
    unit: 'hours' | 'days';
  };
}

/**
 * Complete architecture recommendation result
 */
export interface ArchitectureRecommendation {
  primaryArchitecture: CloudArchitecture;
  alternativeArchitectures: CloudArchitecture[];
  explanations: {
    general: string;
    componentChoices: Record<string, string>;
    costConsiderations: string;
    scalabilityConsiderations: string;
    securityConsiderations: string;
  };
  userRequirements: {
    questionnaire: QuestionnaireState;
    complexity: ComplexityPreference;
    providerStrategy: ProviderStrategy;
    primaryProvider?: CloudProvider;
  };
}

/**
 * Template for common architecture patterns
 */
export interface ArchitectureTemplate {
  id: string;
  name: string;
  description: string;
  applicableApplicationTypes: string[];
  minimumComplexity: ComplexityPreference;
  components: TemplateComponent[];
  connections: TemplateConnection[];
  diagram?: string; // SVG or image URL
}

/**
 * Template component - similar to regular component but with less required fields
 */
export interface TemplateComponent {
  id: string;
  type: ComponentType;
  name: string;
  required: boolean;
  conditionalOn?: {
    feature: string;
    value: any;
  };
  position?: Position;
}

/**
 * Template connection between components
 */
export interface TemplateConnection {
  sourceId: string;
  targetId: string;
  type: ConnectionType;
  required: boolean;
}