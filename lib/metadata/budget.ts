import { ApplicationType, ComplexityLevel, SecurityLevel, AvailabilityLevel, TrafficPattern } from "@/types";

/**
 * Interface for budget range configuration
 */
export interface BudgetRangeMetadata {
  min: number;
  max: number;
  logarithmicBase: number;
  step: number;
  markers: {
    value: number;
    label: string;
    description: string;
  }[];
  infrastructureImplications: Record<string, string>;
}

/**
 * Interface for budget flexibility options
 */
export interface BudgetFlexibilityOption {
  value: number; // Percentage
  label: string;
  description: string;
}

/**
 * Interface for cost optimization strategies
 */
export interface CostOptimizationStrategy {
  id: string;
  name: string;
  description: string;
  typicalSavings: number; // Percentage
  implementationComplexity: 'low' | 'medium' | 'high';
  businessImpact: string;
  bestFor: string[];
  visualProperties: {
    icon: string;
    color: string;
  };
}

/**
 * Budget range metadata for the logarithmic slider
 */
export const BUDGET_RANGE_METADATA: BudgetRangeMetadata = {
  min: 100,
  max: 100000,
  logarithmicBase: 10,
  step: 100,
  markers: [
    { value: 100, label: "$100", description: "Minimal starter budget" },
    { value: 1000, label: "$1K", description: "Small business budget" },
    { value: 10000, label: "$10K", description: "Mid-sized business budget" },
    { value: 50000, label: "$50K", description: "Enterprise budget" },
    { value: 100000, label: "$100K", description: "Large enterprise budget" }
  ],
  infrastructureImplications: {
    "100-500": "Minimal infrastructure with limited scaling capabilities. Consider serverless architecture for cost efficiency.",
    "501-2000": "Basic business infrastructure with some redundancy. Balance between managed services and self-managed components.",
    "2001-10000": "Comprehensive business infrastructure with good scaling capabilities. Can support multi-tier architecture with specialized components.",
    "10001-50000": "Enterprise-grade infrastructure with high availability. Supports advanced scaling strategies and multi-region deployments.",
    "50001+": "Premium enterprise infrastructure with maximum resilience and performance. Supports global-scale architecture with specialized optimization."
  }
};

/**
 * Budget flexibility options with business context
 */
export const BUDGET_FLEXIBILITY_OPTIONS: BudgetFlexibilityOption[] = [
  { value: 0, label: "Fixed Budget", description: "No flexibility, strict budget constraints" },
  { value: 10, label: "Minimal Flexibility", description: "Up to 10% over budget if necessary" },
  { value: 20, label: "Standard Flexibility", description: "Up to 20% over budget for important capabilities" },
  { value: 30, label: "High Flexibility", description: "Up to 30% over budget for optimal architecture" },
  { value: 50, label: "Maximum Flexibility", description: "Up to 50% over budget for best-in-class solutions" }
];

/**
 * Cost optimization strategies with savings estimates
 */
export const COST_OPTIMIZATION_STRATEGIES: CostOptimizationStrategy[] = [
  {
    id: "reserved-instances",
    name: "Reserved Instances",
    description: "Commit to 1-3 year terms for significant discounts",
    typicalSavings: 40,
    implementationComplexity: 'low',
    businessImpact: "Requires upfront commitment but provides substantial savings for predictable workloads",
    bestFor: [
      "Stable, predictable workloads",
      "Core infrastructure components",
      "Long-term projects",
      "Baseline capacity requirements"
    ],
    visualProperties: {
      icon: "calendar-clock",
      color: "#3b82f6" // Blue
    }
  },
  {
    id: "spot-instances",
    name: "Spot/Preemptible Instances",
    description: "Use spare capacity at steep discounts with potential interruptions",
    typicalSavings: 70,
    implementationComplexity: 'high',
    businessImpact: "Significant savings but requires fault-tolerant architecture to handle instance termination",
    bestFor: [
      "Batch processing jobs",
      "Stateless components",
      "Fault-tolerant systems",
      "Background processing"
    ],
    visualProperties: {
      icon: "bolt",
      color: "#f59e0b" // Amber
    }
  },
  {
    id: "auto-scaling",
    name: "Auto-Scaling",
    description: "Automatically adjust capacity based on demand",
    typicalSavings: 25,
    implementationComplexity: 'medium',
    businessImpact: "Balances cost and performance by matching resources to actual demand",
    bestFor: [
      "Variable traffic patterns",
      "Applications with predictable peaks",
      "Cost-sensitive production workloads",
      "Systems with changing workloads"
    ],
    visualProperties: {
      icon: "trending-up",
      color: "#8b5cf6" // Purple
    }
  },
  {
    id: "right-sizing",
    name: "Resource Right-Sizing",
    description: "Optimize instance types and sizes based on actual usage",
    typicalSavings: 30,
    implementationComplexity: 'medium',
    businessImpact: "Eliminates waste from over-provisioned resources",
    bestFor: [
      "Established applications with usage data",
      "Over-provisioned environments",
      "Systems with evolving requirements",
      "Cost optimization initiatives"
    ],
    visualProperties: {
      icon: "ruler",
      color: "#10b981" // Green
    }
  },
  {
    id: "storage-tiering",
    name: "Storage Tiering",
    description: "Move infrequently accessed data to cheaper storage tiers",
    typicalSavings: 50,
    implementationComplexity: 'medium',
    businessImpact: "Reduces storage costs while maintaining accessibility",
    bestFor: [
      "Applications with large data volumes",
      "Systems with varying data access patterns",
      "Archive and backup solutions",
      "Media and content repositories"
    ],
    visualProperties: {
      icon: "database",
      color: "#0891b2" // Cyan
    }
  },
  {
    id: "serverless",
    name: "Serverless Architecture",
    description: "Pay only for actual execution time with no idle costs",
    typicalSavings: 60,
    implementationComplexity: 'high',
    businessImpact: "Eliminates idle infrastructure costs but may require architectural changes",
    bestFor: [
      "Irregular or unpredictable workloads",
      "APIs with variable traffic",
      "Event-driven processing",
      "New application development"
    ],
    visualProperties: {
      icon: "zap",
      color: "#ec4899" // Pink
    }
  }
];

/**
 * Reserved instance commitment options
 */
export const RESERVED_INSTANCE_OPTIONS = [
  { term: 1, upfrontPayment: "none", discount: 20 },
  { term: 1, upfrontPayment: "partial", discount: 30 },
  { term: 1, upfrontPayment: "full", discount: 40 },
  { term: 3, upfrontPayment: "none", discount: 35 },
  { term: 3, upfrontPayment: "partial", discount: 50 },
  { term: 3, upfrontPayment: "full", discount: 60 }
];

/**
 * Constants for budget quality trade-off visualization
 */
export const BUDGET_QUALITY_IMPACT = {
  performance: { min: 50, ideal: 90 },
  reliability: { min: 60, ideal: 95 },
  scalability: { min: 40, ideal: 85 },
  security: { min: 70, ideal: 90 }
};

/**
 * Calculate potential cost savings based on selected optimization strategies and application characteristics
 */
export function calculatePotentialSavings(
  monthlyBudget: number,
  selectedStrategies: string[],
  trafficPattern: TrafficPattern,
  securityLevel: SecurityLevel,
  expectedConcurrentUsers: number
): { 
  totalSavingsPercentage: number;
  totalSavingsAmount: number;
  breakdownByStrategy: { strategyId: string; savingsAmount: number }[];
} {
  // Default savings if no strategies selected
  if (selectedStrategies.length === 0) {
    return {
      totalSavingsPercentage: 0,
      totalSavingsAmount: 0,
      breakdownByStrategy: []
    };
  }
  
  // Find the selected strategy objects
  const strategies = COST_OPTIMIZATION_STRATEGIES.filter(
    strategy => selectedStrategies.includes(strategy.id)
  );
  
  // Calculate savings and adjustments based on application characteristics
  const breakdownByStrategy = strategies.map(strategy => {
    let adjustedSavingsPercentage = strategy.typicalSavings;
    
    // Adjust based on traffic pattern
    if (strategy.id === "auto-scaling") {
      // Auto-scaling is more effective for variable traffic
      if (trafficPattern === TrafficPattern.STEADY) {
        adjustedSavingsPercentage *= 0.5; // Only 50% as effective for steady traffic
      } else if (trafficPattern === TrafficPattern.UNPREDICTABLE || 
                trafficPattern === TrafficPattern.EVENT_DRIVEN) {
        adjustedSavingsPercentage *= 1.2; // 20% more effective for unpredictable traffic
      }
    }
    
    // Adjust based on security level
    if (strategy.id === "spot-instances" && securityLevel === SecurityLevel.HIGH) {
      adjustedSavingsPercentage *= 0.7; // Less effective with high security due to constraints
    }
    
    // Adjust based on scale
    if (strategy.id === "reserved-instances" && expectedConcurrentUsers < 100) {
      adjustedSavingsPercentage *= 0.8; // Less effective at small scale
    }
    
    // Calculate savings amount
    const savingsAmount = (monthlyBudget * (adjustedSavingsPercentage / 100));
    
    return {
      strategyId: strategy.id,
      savingsAmount: parseFloat(savingsAmount.toFixed(2))
    };
  });
  
  // Calculate total savings
  // Note: Savings may overlap, so we use a diminishing returns approach
  let totalSavingsPercentage = 0;
  breakdownByStrategy.forEach(({ strategyId }, index) => {
    const strategy = COST_OPTIMIZATION_STRATEGIES.find(s => s.id === strategyId);
    if (strategy) {
      // Each additional strategy has diminishing returns
      const effectivePercentage = strategy.typicalSavings * Math.pow(0.8, index);
      totalSavingsPercentage += effectivePercentage;
    }
  });
  
  // Cap at 80% - impossible to save more in practice
  totalSavingsPercentage = Math.min(totalSavingsPercentage, 80);
  
  // Calculate final amount
  const totalSavingsAmount = (monthlyBudget * (totalSavingsPercentage / 100));
  
  return {
    totalSavingsPercentage: parseFloat(totalSavingsPercentage.toFixed(1)),
    totalSavingsAmount: parseFloat(totalSavingsAmount.toFixed(2)),
    breakdownByStrategy
  };
}

/**
 * Calculate the budget impact on architecture quality
 */
export function calculateBudgetQualityImpact(
  monthlyBudget: number,
  applicationComplexity: ComplexityLevel,
  applicationType: ApplicationType,
  concurrentUsers: number
): {
  performance: number;
  reliability: number;
  scalability: number;
  security: number;
  overall: number;
} {
  // Calculate baseline budget requirements based on application characteristics
  const complexityMultipliers = {
    [ComplexityLevel.SIMPLE]: 1,
    [ComplexityLevel.MODERATE]: 2,
    [ComplexityLevel.COMPLEX]: 4,
    [ComplexityLevel.ENTERPRISE]: 8
  };
  
  const applicationTypeMultipliers = {
    [ApplicationType.WEB]: 1,
    [ApplicationType.MOBILE]: 1,
    [ApplicationType.API]: 0.8,
    [ApplicationType.ECOMMERCE]: 1.5,
    [ApplicationType.CONTENT]: 0.9,
    [ApplicationType.ANALYTICS]: 1.3,
    [ApplicationType.IOT]: 1.4,
    [ApplicationType.OTHER]: 1
  };
  
  // Calculate users scaling factor (logarithmic)
  const userScalingFactor = Math.log10(Math.max(concurrentUsers, 10)) / Math.log10(100);
  
  // Calculate ideal budget based on complexity, type, and scale
  const complexityFactor = complexityMultipliers[applicationComplexity] || 1;
  const typeFactor = applicationTypeMultipliers[applicationType] || 1;
  const idealBudget = 1000 * complexityFactor * typeFactor * userScalingFactor;
  
  // Calculate budget adequacy (capped between 0.2 and 1.5)
  const budgetAdequacy = Math.min(Math.max(monthlyBudget / idealBudget, 0.2), 1.5);
  
  // Calculate quality metrics based on budget adequacy
  // Each aspect has different sensitivity to budget constraints
  const calculateMetric = (minScore: number, idealScore: number): number => {
    const range = idealScore - minScore;
    const score = minScore + (range * budgetAdequacy);
    return Math.min(Math.round(score), 100);
  };
  
  const performance = calculateMetric(BUDGET_QUALITY_IMPACT.performance.min, BUDGET_QUALITY_IMPACT.performance.ideal);
  const reliability = calculateMetric(BUDGET_QUALITY_IMPACT.reliability.min, BUDGET_QUALITY_IMPACT.reliability.ideal);
  const scalability = calculateMetric(BUDGET_QUALITY_IMPACT.scalability.min, BUDGET_QUALITY_IMPACT.scalability.ideal);
  const security = calculateMetric(BUDGET_QUALITY_IMPACT.security.min, BUDGET_QUALITY_IMPACT.security.ideal);
  
  // Calculate overall score (weighted average)
  const overall = Math.round(
    (performance * 0.25) +
    (reliability * 0.3) +
    (scalability * 0.25) +
    (security * 0.2)
  );
  
  return {
    performance,
    reliability,
    scalability,
    security,
    overall
  };
}

/**
 * Get cost-saving recommendations based on application characteristics
 */
export function getRecommendedCostStrategies(
  trafficPattern: TrafficPattern,
  availabilityLevel: AvailabilityLevel,
  securityLevel: SecurityLevel,
  concurrentUsers: number
): string[] {
  const recommended: string[] = [];
  
  // Reserved Instances are good for steady workloads
  if (trafficPattern === TrafficPattern.STEADY || 
      trafficPattern === TrafficPattern.BUSINESS_HOURS) {
    recommended.push("reserved-instances");
  }
  
  // Auto-scaling is great for variable workloads
  if (trafficPattern === TrafficPattern.VARIABLE || 
      trafficPattern === TrafficPattern.UNPREDICTABLE || 
      trafficPattern === TrafficPattern.EVENT_DRIVEN) {
    recommended.push("auto-scaling");
  }
  
  // Spot instances work well for fault-tolerant systems with lower availability requirements
  if (availabilityLevel !== AvailabilityLevel.CRITICAL && 
      securityLevel !== SecurityLevel.HIGH) {
    recommended.push("spot-instances");
  }
  
  // Right-sizing is good for established applications
  if (concurrentUsers > 100) {
    recommended.push("right-sizing");
  }
  
  // Storage tiering is beneficial for larger applications
  if (concurrentUsers > 1000) {
    recommended.push("storage-tiering");
  }
  
  // Serverless can be good for smaller applications or event-driven patterns
  if ((concurrentUsers < 500 || trafficPattern === TrafficPattern.EVENT_DRIVEN) && 
      securityLevel !== SecurityLevel.HIGH) {
    recommended.push("serverless");
  }
  
  return recommended;
}