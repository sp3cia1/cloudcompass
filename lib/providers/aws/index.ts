import { CloudProvider } from '@/lib/store/applicationState';
import { 
  awsRegions, 
  getRegionById, 
  getRegionsByGeographicArea, 
  getDefaultRegionForArea,
  DEFAULT_REGION,
  AWSRegion
} from './regions';
import { 
  calculateCost, 
  calculateComponentCost, 
  generateArchitectureCostReport, 
  getOptimizationRecommendations, 
  compareArchitectureCosts 
} from './cost';
import { 
  awsServices, 
  getAwsServiceById, 
  getAwsServicesByCategory 
} from './services';

/**
 * AWS Provider implementation
 * 
 * This is the main entry point for AWS-specific functionality in CloudCompass.
 * It provides access to AWS regions, services, and cost calculations.
 */
export const awsProvider = {
  // Provider metadata
  id: 'aws' as CloudProvider,
  name: 'Amazon Web Services',
  description: 'A comprehensive cloud platform with global infrastructure and 200+ services',
  
  // Core data
  regions: awsRegions,
  services: awsServices,
  
  // Region functions
  getRegionById,
  getRegionsByGeographicArea,
  getDefaultRegionForArea,
  defaultRegion: DEFAULT_REGION,
  
  // Service functions
  getServiceById: getAwsServiceById,
  getServicesByCategory: getAwsServicesByCategory,
  
  // Cost functions
  calculateCost,
  calculateComponentCost,
  generateCostReport: generateArchitectureCostReport,
  getOptimizationRecommendations,
  compareArchitectureCosts,
};

/**
 * Namespaced AWS Regions API
 * Provides a focused interface for working with AWS regions
 */
export const awsRegionsApi = {
  all: awsRegions,
  getById: getRegionById,
  getByGeographicArea: getRegionsByGeographicArea,
  getDefaultForArea: getDefaultRegionForArea,
  default: DEFAULT_REGION,
};

/**
 * Namespaced AWS Services API
 * Provides a focused interface for working with AWS services
 */
export const awsServicesApi = {
  all: awsServices,
  getById: getAwsServiceById,
  getByCategory: getAwsServicesByCategory,
};

/**
 * Namespaced AWS Cost API
 * Provides a focused interface for cost calculations
 */
export const awsCostApi = {
  calculateArchitectureCost: calculateCost,
  calculateComponentCost,
  generateReport: generateArchitectureCostReport,
  getOptimizationRecommendations,
  compareArchitectures: compareArchitectureCosts,
};

// Export key types for external use
export type { AWSRegion };

// Default export for ease of use
export default awsProvider;