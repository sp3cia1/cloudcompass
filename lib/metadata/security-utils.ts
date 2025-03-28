import { SecurityLevel, ComplianceType } from "@/types";
import { 
  SecurityCapability, 
  getSecurityCapability, 
  getCapabilitiesForSecurityLevel,
  getSecurityLevelOrdinal
} from "./security-levels";
import { 
  getComplianceFrameworkInfo
} from "./compliance-frameworks";

/**
 * Get additional security capabilities required for compliance frameworks
 * that aren't already covered by the current security level
 */
export function getAdditionalCapabilitiesForCompliance(
  complianceTypes: ComplianceType[],
  currentSecurityLevel: SecurityLevel
): SecurityCapability[] {
  // Get capabilities already covered by the current security level
  const currentCapabilities = getCapabilitiesForSecurityLevel(currentSecurityLevel)
    .map(cap => cap.id);
  
  // Get all capabilities required by selected compliance frameworks
  const complianceCapabilityIds = new Set<string>();
  
  complianceTypes.forEach(complianceType => {
    if (complianceType === ComplianceType.NONE) return;
    
    const frameworkInfo = getComplianceFrameworkInfo(complianceType);
    if (frameworkInfo && frameworkInfo.requiredCapabilities) {
      frameworkInfo.requiredCapabilities.forEach(capId => 
        complianceCapabilityIds.add(capId)
      );
    }
  });
  
  // Filter for capabilities not already covered by security level
  const additionalCapabilityIds = [...complianceCapabilityIds].filter(
    capId => !currentCapabilities.includes(capId)
  );
  
  // Map back to full capability objects
  return additionalCapabilityIds
    .map(id => getSecurityCapability(id))
    .filter((cap): cap is SecurityCapability => cap !== undefined);
}

/**
 * Calculate the minimum required security level based on compliance requirements
 */
export function getRequiredSecurityLevel(complianceTypes: ComplianceType[]): SecurityLevel {
  // Default to basic if no compliance requirements
  if (!complianceTypes.length || 
      (complianceTypes.length === 1 && complianceTypes[0] === ComplianceType.NONE)) {
    return SecurityLevel.BASIC;
  }
  
  // Find the highest required security level among all compliance frameworks
  let highestLevel = SecurityLevel.BASIC;
  
  complianceTypes.forEach(complianceType => {
    const framework = getComplianceFrameworkInfo(complianceType);
    if (framework) {
      // Compare required security levels and take the highest
      const requiredLevel = framework.requiredSecurityLevel;
      if (getSecurityLevelOrdinal(requiredLevel) > getSecurityLevelOrdinal(highestLevel)) {
        highestLevel = requiredLevel;
      }
    }
  });
  
  return highestLevel;
}

/**
 * Calculate security score (0-100) based on security requirements
 */
export function calculateSecurityScore(requirements: {
  securityLevel: SecurityLevel;
  complianceRequirements: ComplianceType[];
  enabledCapabilities: string[];
}): number {
  // Import getSecurityLevelInfo to avoid circular dependency
  const { getSecurityLevelInfo } = require("./security-levels");
  
  // Base score from security level
  const levelInfo = getSecurityLevelInfo(requirements.securityLevel);
  let score = levelInfo ? levelInfo.securityScore : 0;
  
  // All possible capabilities for context
  const { SECURITY_CAPABILITIES } = require("./security-levels");
  const totalCapabilitiesCount = SECURITY_CAPABILITIES.length;
  
  // Calculate percentage of all capabilities that are enabled
  const enabledPercentage = requirements.enabledCapabilities.length / totalCapabilitiesCount;
  
  // Additional score based on enabled capabilities (up to 20 points)
  const capabilityScore = Math.min(20, Math.round(enabledPercentage * 20));
  
  // Compliance impact on score (up to 10 points)
  const complianceScore = requirements.complianceRequirements.reduce((total, compliance) => {
    if (compliance === ComplianceType.NONE) return total;
    // Each compliance framework (except NONE) adds value
    return total + 2;
  }, 0);
  
  score += capabilityScore + Math.min(10, complianceScore);
  
  // Ensure score is capped at 100
  return Math.min(100, score);
}