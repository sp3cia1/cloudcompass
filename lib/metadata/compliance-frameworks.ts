import { SecurityLevel, ComplianceType, GeographicRegion } from "@/types";
import { SecurityCapability, getSecurityCapability } from "./security-levels";

/**
 * Compliance framework metadata interface
 * 
 * Defines the structure for regulatory and industry compliance standards
 * with their specific security requirements and business impacts
 */
export interface ComplianceFrameworkMetadata {
  value: ComplianceType;
  label: string;
  fullName: string;
  description: string;
  applicableIndustries: string[];
  geographicRelevance: GeographicRegion[];
  requiredCapabilities: string[]; // IDs of capabilities required by this framework
  requiredSecurityLevel: SecurityLevel;
  estimatedImplementationTimeMonths: number;
  visualProperties: {
    icon: string;
    color: string;
  };
}

/**
 * Comprehensive compliance framework data
 */
export const COMPLIANCE_FRAMEWORKS: ComplianceFrameworkMetadata[] = [
  {
    value: ComplianceType.NONE,
    label: "No Specific Compliance",
    fullName: "No Specific Compliance Requirements",
    description: "Standard security best practices without specific regulatory framework requirements",
    applicableIndustries: ["General Business", "Small Business", "Non-regulated sectors"],
    geographicRelevance: [
      GeographicRegion.NORTH_AMERICA,
      GeographicRegion.SOUTH_AMERICA,
      GeographicRegion.EUROPE,
      GeographicRegion.ASIA_PACIFIC,
      GeographicRegion.MIDDLE_EAST,
      GeographicRegion.AFRICA
    ],
    requiredCapabilities: [
      "iam-basic",
      "network-basic",
      "encryption-rest",
      "basic-logging"
    ],
    requiredSecurityLevel: SecurityLevel.BASIC,
    estimatedImplementationTimeMonths: 1,
    visualProperties: {
      icon: "shield",
      color: "#6b7280" // Gray
    }
  },
  {
    value: ComplianceType.HIPAA,
    label: "HIPAA",
    fullName: "Health Insurance Portability and Accountability Act",
    description: "U.S. regulations for protecting sensitive patient health information",
    applicableIndustries: ["Healthcare", "Health Insurance", "Healthcare SaaS", "Medical Devices"],
    geographicRelevance: [GeographicRegion.NORTH_AMERICA],
    requiredCapabilities: [
      "iam-basic",
      "mfa",
      "privileged-access",
      "network-basic",
      "encryption-rest",
      "encryption-transit",
      "basic-logging",
      "intrusion-detection",
      "security-policies",
      "compliance-monitoring"
    ],
    requiredSecurityLevel: SecurityLevel.HIGH,
    estimatedImplementationTimeMonths: 6,
    visualProperties: {
      icon: "heart-pulse",
      color: "#ef4444" // Red
    }
  },
  {
    value: ComplianceType.PCI,
    label: "PCI DSS",
    fullName: "Payment Card Industry Data Security Standard",
    description: "Security standards for organizations that handle credit card data",
    applicableIndustries: ["E-commerce", "Retail", "Financial Services", "Payment Processing"],
    geographicRelevance: [
      GeographicRegion.NORTH_AMERICA,
      GeographicRegion.SOUTH_AMERICA,
      GeographicRegion.EUROPE,
      GeographicRegion.ASIA_PACIFIC,
      GeographicRegion.MIDDLE_EAST,
      GeographicRegion.AFRICA
    ],
    requiredCapabilities: [
      "iam-basic",
      "mfa",
      "network-basic",
      "waf",
      "encryption-rest",
      "encryption-transit",
      "basic-logging",
      "intrusion-detection",
      "vulnerability-scanning",
      "security-policies",
      "compliance-monitoring"
    ],
    requiredSecurityLevel: SecurityLevel.HIGH,
    estimatedImplementationTimeMonths: 4,
    visualProperties: {
      icon: "credit-card",
      color: "#f59e0b" // Amber
    }
  },
  {
    value: ComplianceType.GDPR,
    label: "GDPR",
    fullName: "General Data Protection Regulation",
    description: "EU regulations for data protection and privacy",
    applicableIndustries: ["All industries processing EU citizen data"],
    geographicRelevance: [
      GeographicRegion.EUROPE,
      // Also relevant for organizations serving European customers
      GeographicRegion.NORTH_AMERICA,
      GeographicRegion.ASIA_PACIFIC,
      GeographicRegion.MIDDLE_EAST,
      GeographicRegion.SOUTH_AMERICA,
      GeographicRegion.AFRICA
    ],
    requiredCapabilities: [
      "iam-basic",
      "encryption-rest",
      "encryption-transit",
      "basic-logging",
      "security-policies",
      "data-loss-prevention"
    ],
    requiredSecurityLevel: SecurityLevel.ENHANCED,
    estimatedImplementationTimeMonths: 8,
    visualProperties: {
      icon: "eu",
      color: "#3b82f6" // Blue
    }
  },
  {
    value: ComplianceType.SOX,
    label: "SOX",
    fullName: "Sarbanes-Oxley Act",
    description: "U.S. regulations for public company financial reporting",
    applicableIndustries: ["Public Companies", "Financial Services"],
    geographicRelevance: [GeographicRegion.NORTH_AMERICA],
    requiredCapabilities: [
      "iam-basic",
      "privileged-access",
      "basic-logging",
      "security-policies",
      "compliance-monitoring"
    ],
    requiredSecurityLevel: SecurityLevel.ENHANCED,
    estimatedImplementationTimeMonths: 6,
    visualProperties: {
      icon: "file-spreadsheet",
      color: "#10b981" // Emerald
    }
  },
  {
    value: ComplianceType.FEDRAMP,
    label: "FedRAMP",
    fullName: "Federal Risk and Authorization Management Program",
    description: "U.S. government security assessment framework for cloud services",
    applicableIndustries: ["Government Contractors", "Federal Agencies", "Government SaaS"],
    geographicRelevance: [GeographicRegion.NORTH_AMERICA],
    requiredCapabilities: [
      "iam-basic",
      "mfa",
      "privileged-access",
      "network-basic",
      "network-advanced",
      "waf",
      "ddos-protection",
      "encryption-rest",
      "encryption-transit",
      "key-management",
      "intrusion-detection",
      "basic-logging",
      "vulnerability-scanning",
      "threat-intelligence",
      "security-policies",
      "compliance-monitoring",
      "secure-cicd"
    ],
    requiredSecurityLevel: SecurityLevel.HIGH,
    estimatedImplementationTimeMonths: 12,
    visualProperties: {
      icon: "landmark",
      color: "#4f46e5" // Indigo
    }
  },
  {
    value: ComplianceType.OTHER,
    label: "Other Compliance",
    fullName: "Other Regulatory or Industry Compliance",
    description: "Custom or specific compliance requirements not listed",
    applicableIndustries: ["Various"],
    geographicRelevance: [
      GeographicRegion.NORTH_AMERICA,
      GeographicRegion.SOUTH_AMERICA,
      GeographicRegion.EUROPE,
      GeographicRegion.ASIA_PACIFIC,
      GeographicRegion.MIDDLE_EAST,
      GeographicRegion.AFRICA
    ],
    requiredCapabilities: [
      "iam-basic", 
      "network-basic", 
      "encryption-rest", 
      "basic-logging",
      "security-policies"
    ],
    requiredSecurityLevel: SecurityLevel.ENHANCED,
    estimatedImplementationTimeMonths: 6,
    visualProperties: {
      icon: "file-certificate",
      color: "#8b5cf6" // Violet
    }
  }
];

/**
 * Helper function to retrieve compliance framework metadata by value
 */
export function getComplianceFrameworkInfo(complianceType: ComplianceType): ComplianceFrameworkMetadata | undefined {
  return COMPLIANCE_FRAMEWORKS.find(framework => framework.value === complianceType);
}

/**
 * Get all compliance frameworks applicable to a specific industry
 */
export function getComplianceFrameworksByIndustry(industry: string): ComplianceFrameworkMetadata[] {
  return COMPLIANCE_FRAMEWORKS.filter(framework => 
    framework.applicableIndustries.some(
      applicableIndustry => applicableIndustry.toLowerCase().includes(industry.toLowerCase())
    )
  );
}

/**
 * Get all compliance frameworks relevant to a specific geographic region
 */
export function getComplianceFrameworksByRegion(region: GeographicRegion): ComplianceFrameworkMetadata[] {
  return COMPLIANCE_FRAMEWORKS.filter(framework => 
    framework.geographicRelevance.includes(region)
  );
}

/**
 * Get security capabilities required by a specific compliance framework
 */
export function getCapabilitiesForComplianceFramework(complianceType: ComplianceType): SecurityCapability[] {
  const framework = getComplianceFrameworkInfo(complianceType);
  if (!framework) return [];
  
  return framework.requiredCapabilities
    .map(id => getSecurityCapability(id))
    .filter((cap): cap is SecurityCapability => cap !== undefined);
}

/**
 * Calculate implementation effort (in person-months) for multiple compliance frameworks
 */
export function calculateComplianceImplementationTime(complianceTypes: ComplianceType[]): number {
  if (!complianceTypes.length || 
      (complianceTypes.length === 1 && complianceTypes[0] === ComplianceType.NONE)) {
    return 0;
  }
  
  // Get all unique required capabilities across all selected frameworks
  const allRequiredCapabilities = new Set<string>();
  
  complianceTypes.forEach(complianceType => {
    const framework = getComplianceFrameworkInfo(complianceType);
    if (framework) {
      framework.requiredCapabilities.forEach(capId => 
        allRequiredCapabilities.add(capId)
      );
    }
  });
  
  // Base time is the maximum time among selected frameworks
  const baseTime = Math.max(
    ...complianceTypes.map(type => {
      const framework = getComplianceFrameworkInfo(type);
      return framework ? framework.estimatedImplementationTimeMonths : 0;
    })
  );
  
  // Add 20% efficiency gain for overlapping requirements
  // The more overlap in capabilities, the more efficient implementation becomes
  const totalCapabilities = allRequiredCapabilities.size;
  const sumOfIndividualCapabilities = complianceTypes.reduce((sum, type) => {
    const framework = getComplianceFrameworkInfo(type);
    return sum + (framework ? framework.requiredCapabilities.length : 0);
  }, 0);
  
  // Calculate overlap ratio (0 to 1)
  const overlapRatio = sumOfIndividualCapabilities > 0 
    ? 1 - (totalCapabilities / sumOfIndividualCapabilities) 
    : 0;
  
  // Apply efficiency factor (20% reduction for complete overlap)
  const efficiencyFactor = 1 - (overlapRatio * 0.2);
  
  // Calculate total implementation time
  const totalTime = baseTime * (1 + (0.3 * (complianceTypes.length - 1) * efficiencyFactor));
  
  return parseFloat(totalTime.toFixed(1));
}

/**
 * Group compliance frameworks by industry category
 */
export function groupComplianceFrameworksByIndustry(): Record<string, ComplianceFrameworkMetadata[]> {
  const industryGroups: Record<string, ComplianceFrameworkMetadata[]> = {};
  
  // Extract all unique industries
  const allIndustries = new Set<string>();
  COMPLIANCE_FRAMEWORKS.forEach(framework => {
    framework.applicableIndustries.forEach(industry => {
      allIndustries.add(industry);
    });
  });
  
  // Group frameworks by industry
  [...allIndustries].forEach(industry => {
    industryGroups[industry] = COMPLIANCE_FRAMEWORKS.filter(framework => 
      framework.applicableIndustries.includes(industry)
    );
  });
  
  return industryGroups;
}