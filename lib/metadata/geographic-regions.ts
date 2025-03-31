import { GeographicRegion } from "@/types";

/**
 * Metadata interface for geographic regions
 * 
 * Contains comprehensive information about each cloud region
 * to support visualization, selection, and business logic requirements.
 */
export interface RegionMetadata {
  id: GeographicRegion;
  name: string;
  description: string;
  svgPath: string;  // SVG path data for map rendering
  centerPoint: [number, number]; // [longitude, latitude] for centering
  availabilityZones: number; // Typical number of AZs
  costTier: 1 | 2 | 3 | 4 | 5; // Relative cost indicator (1=lowest, 5=highest)
  complianceCertifications: string[];
  latencyFromOtherRegions: Record<GeographicRegion, number>; // Typical latency in ms
  recommendedForWorkloads: string[];
}

/**
 * Comprehensive region data for the world map component
 * 
 * SVG paths are simplified placeholders - in a production environment,
 * these would be precise continent/region paths from a GIS system.
 */
export const GEOGRAPHIC_REGIONS: RegionMetadata[] = [
  {
    id: GeographicRegion.NORTH_AMERICA,
    name: "North America",
    description: "US and Canada regions with extensive service availability",
    svgPath: "M130,120 L200,120 L220,160 L240,160 L260,180 L240,220 L220,240 L180,240 L170,230 L150,230 L140,220 L130,200 L120,180 L110,160 Z", // Simplified
    centerPoint: [-100, 40],
    availabilityZones: 6,
    costTier: 3,
    complianceCertifications: ["SOC 1/2/3", "PCI DSS", "HIPAA", "FedRAMP"],
    latencyFromOtherRegions: {
      [GeographicRegion.NORTH_AMERICA]: 0,
      [GeographicRegion.SOUTH_AMERICA]: 120,
      [GeographicRegion.EUROPE]: 90,
      [GeographicRegion.ASIA_PACIFIC]: 150,
      [GeographicRegion.MIDDLE_EAST]: 140,
      [GeographicRegion.AFRICA]: 130,
    },
    recommendedForWorkloads: [
      "Enterprise applications",
      "Media streaming",
      "Financial services"
    ]
  },
  {
    id: GeographicRegion.SOUTH_AMERICA,
    name: "South America",
    description: "Regions in Brazil and surrounding areas with growing service availability",
    svgPath: "M170,240 L210,240 L230,290 L210,350 L190,370 L170,350 L150,320 L150,290 L160,260 Z", // Simplified
    centerPoint: [-60, 260],
    availabilityZones: 3,
    costTier: 3,
    complianceCertifications: ["SOC 1/2", "PCI DSS"],
    latencyFromOtherRegions: {
      [GeographicRegion.NORTH_AMERICA]: 120,
      [GeographicRegion.SOUTH_AMERICA]: 0,
      [GeographicRegion.EUROPE]: 110,
      [GeographicRegion.ASIA_PACIFIC]: 200,
      [GeographicRegion.MIDDLE_EAST]: 180,
      [GeographicRegion.AFRICA]: 140,
    },
    recommendedForWorkloads: [
      "Content delivery",
      "Gaming",
      "Regional business applications"
    ]
  },
  {
    id: GeographicRegion.EUROPE,
    name: "Europe",
    description: "Extensive regions across Western and Central Europe with strong compliance frameworks",
    svgPath: "M230,120 L270,120 L280,130 L290,140 L300,130 L320,140 L310,160 L280,170 L260,180 L240,170 Z", // Simplified
    centerPoint: [15, 50],
    availabilityZones: 5,
    costTier: 4,
    complianceCertifications: ["SOC 1/2/3", "PCI DSS", "GDPR", "ISO 27001"],
    latencyFromOtherRegions: {
      [GeographicRegion.NORTH_AMERICA]: 90,
      [GeographicRegion.SOUTH_AMERICA]: 110,
      [GeographicRegion.EUROPE]: 0,
      [GeographicRegion.ASIA_PACIFIC]: 120,
      [GeographicRegion.MIDDLE_EAST]: 80,
      [GeographicRegion.AFRICA]: 70,
    },
    recommendedForWorkloads: [
      "GDPR-compliant applications",
      "Financial services",
      "Enterprise applications",
      "Government workloads"
    ]
  },
  {
    id: GeographicRegion.ASIA_PACIFIC,
    name: "Asia Pacific",
    description: "Diverse regions across East Asia, Southeast Asia, and Oceania",
    svgPath: "M320,140 L380,140 L390,160 L400,170 L410,160 L420,170 L430,190 L440,210 L420,230 L380,230 L350,220 L340,200 L320,190 L310,170 Z", // Simplified
    centerPoint: [130, 25],
    availabilityZones: 4,
    costTier: 3,
    complianceCertifications: ["SOC 1/2", "PCI DSS", "ISO 27001"],
    latencyFromOtherRegions: {
      [GeographicRegion.NORTH_AMERICA]: 150,
      [GeographicRegion.SOUTH_AMERICA]: 200,
      [GeographicRegion.EUROPE]: 120,
      [GeographicRegion.ASIA_PACIFIC]: 0,
      [GeographicRegion.MIDDLE_EAST]: 100,
      [GeographicRegion.AFRICA]: 130,
    },
    recommendedForWorkloads: [
      "Gaming",
      "E-commerce",
      "Mobile applications",
      "Media services"
    ]
  },
  {
    id: GeographicRegion.MIDDLE_EAST,
    name: "Middle East",
    description: "Growing cloud regions with specialized compliance for Middle Eastern markets",
    svgPath: "M290,170 L330,170 L340,190 L330,210 L310,200 L300,190 L290,180 Z", // Simplified
    centerPoint: [45, 25],
    availabilityZones: 3,
    costTier: 4,
    complianceCertifications: ["SOC 1/2", "PCI DSS", "ISO 27001"],
    latencyFromOtherRegions: {
      [GeographicRegion.NORTH_AMERICA]: 140,
      [GeographicRegion.SOUTH_AMERICA]: 180,
      [GeographicRegion.EUROPE]: 80,
      [GeographicRegion.ASIA_PACIFIC]: 100,
      [GeographicRegion.MIDDLE_EAST]: 0,
      [GeographicRegion.AFRICA]: 60,
    },
    recommendedForWorkloads: [
      "Regional business applications",
      "Content delivery",
      "Financial services"
    ]
  },
  {
    id: GeographicRegion.AFRICA,
    name: "Africa",
    description: "Emerging cloud regions in Africa with growing service offerings",
    svgPath: "M250,180 L290,180 L320,200 L330,230 L320,270 L290,300 L270,290 L250,270 L240,230 L230,200 Z", // Simplified
    centerPoint: [20, 10],
    availabilityZones: 2,
    costTier: 3,
    complianceCertifications: ["SOC 1/2", "PCI DSS"],
    latencyFromOtherRegions: {
      [GeographicRegion.NORTH_AMERICA]: 130,
      [GeographicRegion.SOUTH_AMERICA]: 140,
      [GeographicRegion.EUROPE]: 70,
      [GeographicRegion.ASIA_PACIFIC]: 130,
      [GeographicRegion.MIDDLE_EAST]: 60,
      [GeographicRegion.AFRICA]: 0,
    },
    recommendedForWorkloads: [
      "Content delivery",
      "Mobile applications",
      "Regional business applications"
    ]
  }
];

/**
 * Latency perception thresholds in milliseconds
 * These values determine how latency is visualized in the UI
 */
export const LATENCY_THRESHOLDS = {
  excellent: 50,   // ms
  good: 100,       // ms
  fair: 200,       // ms
  poor: 300        // ms
};

/**
 * Color scheme for region visualization states
 * Follows the application's color palette for consistency
 */
export const REGION_COLORS = {
  unselected: "#e5e7eb",
  selected: "#93c5fd",
  primary: "#3b82f6",
  hovered: "#bfdbfe",
  disabled: "#d1d5db"
};

/**
 * Helper function to retrieve region metadata by ID
 */
export function getRegionInfo(regionId: GeographicRegion): RegionMetadata | undefined {
  return GEOGRAPHIC_REGIONS.find(region => region.id === regionId);
}

/**
 * Calculate estimated latency between two regions
 */
export function getLatencyBetweenRegions(
  sourceRegion: GeographicRegion,
  targetRegion: GeographicRegion
): number {
  const source = getRegionInfo(sourceRegion);
  return source?.latencyFromOtherRegions[targetRegion] ?? 0;
}

/**
 * Impact metrics for multi-region deployments
 */
export interface RegionDeploymentImpact {
  latencyImprovement: number;   // Percentage improvement in global latency
  costIncrease: number;         // Percentage increase in infrastructure costs
  reliabilityImprovement: number; // Percentage improvement in overall availability
  complexityIncrease: number;   // Relative increase in operational complexity
}

/**
 * Calculate the impact of a multi-region deployment strategy
 * 
 * @param regions Selected geographic regions
 * @param userDistribution Percentage of users in each region
 * @returns Impact metrics for the selected deployment strategy
 */
export function calculateMultiRegionImpact(
  regions: GeographicRegion[],
  userDistribution: Record<GeographicRegion, number>
): RegionDeploymentImpact {
  // Single region baseline
  if (regions.length <= 1) {
    return {
      latencyImprovement: 0,
      costIncrease: 0,
      reliabilityImprovement: 0,
      complexityIncrease: 0
    };
  }
  
  // Calculate cost factor based on selected regions' cost tiers
  const costFactor = regions.reduce((sum, regionId) => {
    const region = getRegionInfo(regionId);
    return sum + (region?.costTier || 3);
  }, 0) / regions.length;
  
  // Calculate latency improvement based on user distribution
  const latencyImprovement = 30 * (regions.length - 1); // Simplified calculation
  
  // More regions = better reliability but higher complexity
  return {
    latencyImprovement: Math.min(80, latencyImprovement), // Cap at 80%
    costIncrease: (regions.length - 1) * costFactor * 20, // Each additional region adds ~20-80% cost
    reliabilityImprovement: Math.min(99.9, (regions.length - 1) * 30), // Diminishing returns
    complexityIncrease: (regions.length - 1) * 35 // Linear increase in complexity
  };
}