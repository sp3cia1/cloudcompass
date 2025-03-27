import { SecurityLevel } from "@/types";

/**
 * Security capability category representing different security domains
 */
export enum SecurityCapabilityCategory {
  IDENTITY = 'identity',
  DATA = 'data',
  NETWORK = 'network',
  THREAT = 'threat',
  MONITORING = 'monitoring',
  GOVERNANCE = 'governance',
  COMPLIANCE = 'compliance'
}

/**
 * Core security capability interface representing fundamental
 * security functions independent of provider implementation
 */
export interface SecurityCapability {
  id: string;
  name: string;
  description: string;
  category: SecurityCapabilityCategory;
  importance: 'critical' | 'high' | 'medium' | 'low';
  businessImpact: string;
  implementationComplexity: 'low' | 'medium' | 'high';
  technicalConsiderations: string[];
  visualProperties: {
    icon: string;
    color: string;
  };
}

/**
 * Security level metadata interface
 * 
 * Contains comprehensive information about each security level,
 * defined by required and optional capabilities
 */
export interface SecurityLevelMetadata {
  value: SecurityLevel;
  label: string;
  description: string;
  securityScore: number; // 0-100 scale for visualization
  businessImpact: string;
  recommendedFor: string[];
  requiredCapabilities: string[]; // IDs of required capabilities
  optionalCapabilities: string[]; // IDs of optional/recommended capabilities
  costImpact: 'low' | 'medium' | 'high';
  visualProperties: {
    color: string;
    iconType: string;
    patternClass: string;
  };
}

/**
 * Comprehensive catalog of security capabilities
 */
export const SECURITY_CAPABILITIES: SecurityCapability[] = [
  // Identity & Access Management
  {
    id: "iam-basic",
    name: "Basic Identity Management",
    description: "Core identity and access management functionality with user management and role-based access control",
    category: SecurityCapabilityCategory.IDENTITY,
    importance: "critical",
    businessImpact: "Enables secure user authentication and authorization",
    implementationComplexity: "low",
    technicalConsiderations: [
      "User lifecycle management",
      "Password policies",
      "Basic role-based access control"
    ],
    visualProperties: {
      icon: "user-circle",
      color: "#3b82f6"
    }
  },
  {
    id: "mfa",
    name: "Multi-Factor Authentication",
    description: "Additional authentication mechanisms beyond passwords",
    category: SecurityCapabilityCategory.IDENTITY,
    importance: "high",
    businessImpact: "Significantly reduces account compromise risk",
    implementationComplexity: "medium",
    technicalConsiderations: [
      "SMS, app-based, or hardware token options",
      "Selective enforcement based on risk",
      "User experience considerations"
    ],
    visualProperties: {
      icon: "shield-check",
      color: "#3b82f6"
    }
  },
  {
    id: "privileged-access",
    name: "Privileged Access Management",
    description: "Enhanced controls for administrative and high-privilege accounts",
    category: SecurityCapabilityCategory.IDENTITY,
    importance: "high",
    businessImpact: "Prevents misuse of administrative access and reduces insider threat risk",
    implementationComplexity: "high",
    technicalConsiderations: [
      "Just-in-time access elevation",
      "Session recording",
      "Approval workflows",
      "Segregation of duties"
    ],
    visualProperties: {
      icon: "key",
      color: "#3b82f6"
    }
  },
  
  // Network Security
  {
    id: "network-basic",
    name: "Basic Network Security",
    description: "Fundamental network traffic filtering and segmentation",
    category: SecurityCapabilityCategory.NETWORK,
    importance: "critical",
    businessImpact: "Provides essential protection against unauthorized network access",
    implementationComplexity: "low",
    technicalConsiderations: [
      "Security groups",
      "Network ACLs",
      "Basic traffic filtering"
    ],
    visualProperties: {
      icon: "network",
      color: "#f59e0b"
    }
  },
  {
    id: "waf",
    name: "Web Application Firewall",
    description: "Specialized protection for web applications against common attacks",
    category: SecurityCapabilityCategory.NETWORK,
    importance: "high",
    businessImpact: "Protects web applications from OWASP Top 10 vulnerabilities",
    implementationComplexity: "medium",
    technicalConsiderations: [
      "Rule customization",
      "False positive management",
      "Integration with CI/CD"
    ],
    visualProperties: {
      icon: "shield",
      color: "#f59e0b"
    }
  },
  {
    id: "ddos-protection",
    name: "DDoS Protection",
    description: "Mitigation of distributed denial of service attacks",
    category: SecurityCapabilityCategory.NETWORK,
    importance: "high",
    businessImpact: "Maintains availability during targeted attacks",
    implementationComplexity: "medium",
    technicalConsiderations: [
      "Volumetric attack protection",
      "Application layer protection",
      "Traffic analysis"
    ],
    visualProperties: {
      icon: "shield-alert",
      color: "#f59e0b"
    }
  },
  {
    id: "network-advanced",
    name: "Advanced Network Segmentation",
    description: "Sophisticated network isolation and micro-segmentation",
    category: SecurityCapabilityCategory.NETWORK,
    importance: "high",
    businessImpact: "Limits lateral movement in case of breach and isolates sensitive systems",
    implementationComplexity: "high",
    technicalConsiderations: [
      "Micro-segmentation",
      "Service mesh",
      "Zero-trust network architecture"
    ],
    visualProperties: {
      icon: "layers",
      color: "#f59e0b"
    }
  },
  
  // Data Protection
  {
    id: "encryption-rest",
    name: "Encryption at Rest",
    description: "Encryption of stored data",
    category: SecurityCapabilityCategory.DATA,
    importance: "high",
    businessImpact: "Protects data if storage is compromised",
    implementationComplexity: "low",
    technicalConsiderations: [
      "Key management",
      "Performance impact",
      "Legacy system compatibility"
    ],
    visualProperties: {
      icon: "database",
      color: "#059669"
    }
  },
  {
    id: "encryption-transit",
    name: "Encryption in Transit",
    description: "Encryption of data during network transmission",
    category: SecurityCapabilityCategory.DATA,
    importance: "high",
    businessImpact: "Protects data from interception during transmission",
    implementationComplexity: "medium",
    technicalConsiderations: [
      "TLS configuration",
      "Certificate management",
      "Protocol compatibility"
    ],
    visualProperties: {
      icon: "lock",
      color: "#059669"
    }
  },
  {
    id: "key-management",
    name: "Advanced Key Management",
    description: "Specialized systems for cryptographic key management",
    category: SecurityCapabilityCategory.DATA,
    importance: "high",
    businessImpact: "Ensures proper handling of encryption keys for maximum protection",
    implementationComplexity: "high",
    technicalConsiderations: [
      "Hardware security modules",
      "Key rotation",
      "Access controls for keys"
    ],
    visualProperties: {
      icon: "key-round",
      color: "#059669"
    }
  },
  {
    id: "data-loss-prevention",
    name: "Data Loss Prevention",
    description: "Controls to prevent unauthorized data exfiltration",
    category: SecurityCapabilityCategory.DATA,
    importance: "high",
    businessImpact: "Prevents sensitive data leakage across network boundaries",
    implementationComplexity: "high",
    technicalConsiderations: [
      "Content inspection",
      "Policy enforcement",
      "User education"
    ],
    visualProperties: {
      icon: "eye-off",
      color: "#059669"
    }
  },
  
  // Threat Protection
  {
    id: "basic-logging",
    name: "Basic Logging",
    description: "Standard activity logging for troubleshooting and basic auditing",
    category: SecurityCapabilityCategory.MONITORING,
    importance: "medium",
    businessImpact: "Provides visibility into system activities and basic audit trail",
    implementationComplexity: "low",
    technicalConsiderations: [
      "Log retention",
      "Storage requirements",
      "Performance impact"
    ],
    visualProperties: {
      icon: "file-text",
      color: "#8b5cf6"
    }
  },
  {
    id: "intrusion-detection",
    name: "Intrusion Detection",
    description: "Monitoring for suspicious activities and potential security incidents",
    category: SecurityCapabilityCategory.THREAT,
    importance: "high",
    businessImpact: "Enables early detection of potential security breaches",
    implementationComplexity: "medium",
    technicalConsiderations: [
      "Alert tuning",
      "False positive management",
      "Response workflows"
    ],
    visualProperties: {
      icon: "bell-ring",
      color: "#dc2626"
    }
  },
  {
    id: "vulnerability-scanning",
    name: "Vulnerability Scanning",
    description: "Regular automated security testing of infrastructure and applications",
    category: SecurityCapabilityCategory.THREAT,
    importance: "high",
    businessImpact: "Proactively identifies security weaknesses before they can be exploited",
    implementationComplexity: "medium",
    technicalConsiderations: [
      "Scan frequency",
      "Coverage of assets",
      "Remediation processes"
    ],
    visualProperties: {
      icon: "search",
      color: "#dc2626"
    }
  },
  {
    id: "threat-intelligence",
    name: "Threat Intelligence",
    description: "Integration of external threat data to enhance security monitoring",
    category: SecurityCapabilityCategory.THREAT,
    importance: "medium",
    businessImpact: "Improves detection capabilities with current threat information",
    implementationComplexity: "high",
    technicalConsiderations: [
      "Intelligence sources",
      "Integration with detection systems",
      "Contextual analysis"
    ],
    visualProperties: {
      icon: "brain",
      color: "#dc2626"
    }
  },
  
  // Governance
  {
    id: "security-policies",
    name: "Security Policies",
    description: "Defined security requirements and policies",
    category: SecurityCapabilityCategory.GOVERNANCE,
    importance: "medium",
    businessImpact: "Establishes security standards and expectations",
    implementationComplexity: "low",
    technicalConsiderations: [
      "Policy documentation",
      "Distribution and awareness",
      "Version control"
    ],
    visualProperties: {
      icon: "file",
      color: "#6366f1"
    }
  },
  {
    id: "compliance-monitoring",
    name: "Compliance Monitoring",
    description: "Continuous assessment of compliance with security policies",
    category: SecurityCapabilityCategory.COMPLIANCE,
    importance: "high",
    businessImpact: "Ensures ongoing adherence to security requirements",
    implementationComplexity: "medium",
    technicalConsiderations: [
      "Automated compliance checks",
      "Remediation workflows",
      "Reporting"
    ],
    visualProperties: {
      icon: "check-circle",
      color: "#0891b2"
    }
  },
  {
    id: "secure-cicd",
    name: "Secure CI/CD Pipeline",
    description: "Security integrated throughout development and deployment process",
    category: SecurityCapabilityCategory.GOVERNANCE,
    importance: "high",
    businessImpact: "Prevents security issues from being introduced during software development",
    implementationComplexity: "high",
    technicalConsiderations: [
      "Code scanning",
      "Dependency checking",
      "Image scanning",
      "Infrastructure as code validation"
    ],
    visualProperties: {
      icon: "git-merge",
      color: "#6366f1"
    }
  }
];

/**
 * Comprehensive security level data
 */
export const SECURITY_LEVELS: SecurityLevelMetadata[] = [
  {
    value: SecurityLevel.BASIC,
    label: "Basic Security",
    description: "Essential security controls for standard applications with minimal sensitive data",
    securityScore: 40,
    businessImpact: "Provides fundamental protection while minimizing complexity and cost",
    recommendedFor: [
      "Public information websites",
      "Basic content management systems",
      "Development and test environments",
      "Internal tools with minimal sensitive data"
    ],
    requiredCapabilities: [
      "iam-basic",
      "network-basic",
      "encryption-rest",
      "basic-logging"
    ],
    optionalCapabilities: [
      "security-policies",
      "encryption-transit"
    ],
    costImpact: "low",
    visualProperties: {
      color: "#3b82f6", // Blue
      iconType: "shield-basic",
      patternClass: "basic-pattern"
    }
  },
  {
    value: SecurityLevel.ENHANCED,
    label: "Enhanced Security",
    description: "Comprehensive security controls for applications with sensitive data or compliance needs",
    securityScore: 70,
    businessImpact: "Balances strong security protections with practical implementation requirements",
    recommendedFor: [
      "E-commerce applications",
      "Healthcare systems (non-critical)",
      "Financial services applications",
      "Business applications with sensitive data",
      "Customer-facing SaaS products"
    ],
    requiredCapabilities: [
      "iam-basic",
      "mfa",
      "network-basic",
      "waf",
      "encryption-rest",
      "encryption-transit",
      "intrusion-detection",
      "basic-logging",
      "vulnerability-scanning",
      "security-policies"
    ],
    optionalCapabilities: [
      "ddos-protection",
      "compliance-monitoring",
      "threat-intelligence",
      "secure-cicd"
    ],
    costImpact: "medium",
    visualProperties: {
      color: "#7c3aed", // Purple
      iconType: "shield-enhanced",
      patternClass: "enhanced-pattern"
    }
  },
  {
    value: SecurityLevel.HIGH,
    label: "High Security",
    description: "Advanced security controls for applications with highly sensitive data or strict compliance requirements",
    securityScore: 90,
    businessImpact: "Provides maximum protection for critical systems and sensitive data with higher implementation cost and complexity",
    recommendedFor: [
      "Healthcare systems with protected health information",
      "Financial systems handling payment data",
      "Government applications with sensitive information",
      "Critical infrastructure systems",
      "Applications requiring high compliance standards"
    ],
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
      "secure-cicd",
      "data-loss-prevention"
    ],
    optionalCapabilities: [],
    costImpact: "high",
    visualProperties: {
      color: "#059669", // Green
      iconType: "shield-high",
      patternClass: "high-pattern"
    }
  }
];

/**
 * Helper function to retrieve security level metadata by value
 */
export function getSecurityLevelInfo(securityLevel: SecurityLevel): SecurityLevelMetadata | undefined {
  return SECURITY_LEVELS.find(level => level.value === securityLevel);
}

/**
 * Helper function to retrieve security capability by ID
 */
export function getSecurityCapability(capabilityId: string): SecurityCapability | undefined {
  return SECURITY_CAPABILITIES.find(capability => capability.id === capabilityId);
}

/**
 * Get all security capabilities for a specific security level
 */
export function getCapabilitiesForSecurityLevel(securityLevel: SecurityLevel): SecurityCapability[] {
  const levelInfo = getSecurityLevelInfo(securityLevel);
  if (!levelInfo) return [];
  
  const requiredCapabilityIds = levelInfo.requiredCapabilities || [];
  
  return SECURITY_CAPABILITIES.filter(capability => 
    requiredCapabilityIds.includes(capability.id)
  );
}

/**
 * Helper function to convert security level to numerical value for comparison
 */
export function getSecurityLevelOrdinal(level: SecurityLevel): number {
  switch (level) {
    case SecurityLevel.BASIC:
      return 1;
    case SecurityLevel.ENHANCED:
      return 2;
    case SecurityLevel.HIGH:
      return 3;
    default:
      return 0;
  }
}

/**
 * Get recommended additional security capabilities based on application characteristics
 */
export function getRecommendedSecurityCapabilities(
  securityLevel: SecurityLevel,
  hasPaymentProcessing: boolean,
  hasFileUploads: boolean,
  isRealTime: boolean
): string[] {
  const recommendedCapabilityIds: string[] = [];
  
  // Recommendations based on application characteristics
  if (hasPaymentProcessing) {
    recommendedCapabilityIds.push("waf", "encryption-transit", "key-management");
  }
  
  if (hasFileUploads) {
    recommendedCapabilityIds.push("waf", "vulnerability-scanning");
  }
  
  if (isRealTime) {
    recommendedCapabilityIds.push("ddos-protection");
  }
  
  // Get capabilities already included in the selected security level
  const levelCapabilities = getCapabilitiesForSecurityLevel(securityLevel)
    .map(cap => cap.id);
  
  // Return only capabilities not already included in the security level
  return recommendedCapabilityIds.filter(id => !levelCapabilities.includes(id));
}

/**
 * Estimate additional monthly cost impact for security features
 */
export function estimateSecurityCostImpact(securityLevel: SecurityLevel, appComplexity: string): number {
  const levelInfo = getSecurityLevelInfo(securityLevel);
  if (!levelInfo) return 0;
  
  // Base cost multipliers for each security level
  const costMultipliers = {
    [SecurityLevel.BASIC]: 0.05, // 5% of base infrastructure cost
    [SecurityLevel.ENHANCED]: 0.15, // 15% of base infrastructure cost
    [SecurityLevel.HIGH]: 0.30 // 30% of base infrastructure cost
  };
  
  // Complexity multipliers
  const complexityMultipliers = {
    "simple": 0.8,
    "moderate": 1.0,
    "complex": 1.2,
    "enterprise": 1.5
  };
  
  // Calculate based on security level and application complexity
  const complexityFactor = complexityMultipliers[appComplexity as keyof typeof complexityMultipliers] || 1.0;
  const securityFactor = costMultipliers[securityLevel] || 0.05;
  
  return securityFactor * complexityFactor;
}