import { TrafficPattern } from "@/types";
import { TrafficPatternMetadata } from "./scaling";

// No direct imports of React components
// Instead, use a string identifier for icon type

// Modified interface to use string identifiers instead of React components
export type TrafficIconType = 'steady' | 'businessHours' | 'variable' | 'unpredictable' | 'eventDriven';

// Type that omits the React component from the metadata
export type TrafficPatternData = Omit<TrafficPatternMetadata, 'icon'> & {
  iconType: TrafficIconType;
};

export const TRAFFIC_PATTERNS: TrafficPatternData[] = [
  {
    value: TrafficPattern.STEADY,
    label: "Steady Traffic",
    description: "Consistent user load with minimal variation throughout the day",
    iconType: 'steady',
    visualizationData: [75, 72, 70, 68, 70, 73, 78, 82, 85, 87, 88, 87, 85, 84, 85, 86, 87, 85, 82, 80, 78, 75, 73, 74],
    typicalMultiplierRange: [1.2, 1.5],
    businessScenarios: [
      "Internal business applications with predictable usage patterns",
      "B2B platforms with contracted service levels",
      "Monitoring systems with consistent data collection rates",
      "Utility or infrastructure services with baseline demand"
    ],
    architecturalImplications: [
      "Predictable resource allocation with minimal scaling requirements",
      "Cost-effective reserved instance strategies",
      "Simplified capacity planning and infrastructure sizing",
      "Lower operational complexity for scaling operations"
    ]
  },
  {
    value: TrafficPattern.BUSINESS_HOURS,
    label: "Business Hours",
    description: "Higher traffic during working hours (9-5) with significantly lower traffic during evenings and weekends",
    iconType: 'businessHours',
    visualizationData: [15, 12, 10, 8, 12, 25, 60, 85, 95, 98, 97, 96, 98, 95, 92, 88, 75, 45, 30, 25, 22, 18, 15, 13],
    typicalMultiplierRange: [2.0, 3.0],
    businessScenarios: [
      "Corporate information systems and productivity tools",
      "Customer service and support platforms",
      "Financial and trading applications with market-hour peaks",
      "Administrative and operational business systems"
    ],
    architecturalImplications: [
      "Time-based auto-scaling policies for predictable usage patterns",
      "Resource hibernation or scaling-to-zero for off-hours",
      "Cost optimization through scheduled scaling events",
      "Different service tiers for business vs. non-business hours"
    ]
  },
  {
    value: TrafficPattern.VARIABLE,
    label: "Variable Traffic",
    description: "Fluctuating load patterns with semi-predictable peaks and valleys throughout the day",
    iconType: 'variable',
    visualizationData: [40, 35, 30, 25, 30, 45, 65, 80, 92, 85, 75, 65, 70, 85, 95, 88, 75, 85, 70, 55, 45, 40, 35, 38],
    typicalMultiplierRange: [2.5, 4.0],
    businessScenarios: [
      "E-commerce platforms with daily shopping patterns",
      "Content and media sites with engagement-driven traffic",
      "Social platforms with usage peaks around content publishing",
      "Public-facing services with consumer usage patterns"
    ],
    architecturalImplications: [
      "Dynamic auto-scaling based on load metrics rather than schedules",
      "Buffer capacity to handle rapid traffic changes",
      "CDN and caching strategies to absorb traffic variations",
      "Load balancing across multiple availability zones"
    ]
  },
  {
    value: TrafficPattern.UNPREDICTABLE,
    label: "Unpredictable Spikes",
    description: "Sudden, significant traffic surges that occur with limited warning or pattern",
    iconType: 'unpredictable',
    visualizationData: [20, 18, 15, 17, 22, 25, 20, 95, 35, 28, 25, 22, 18, 15, 100, 35, 30, 25, 20, 90, 28, 22, 18, 15],
    typicalMultiplierRange: [5.0, 10.0],
    businessScenarios: [
      "Event ticketing or registration systems with flash sales",
      "Viral content platforms where trends drive sudden interest",
      "News and media sites during breaking events",
      "Promotional campaigns with unpredictable consumer response"
    ],
    architecturalImplications: [
      "Serverless architecture to handle extreme elasticity requirements",
      "Queue-based load leveling to absorb traffic spikes",
      "Over-provisioning critical path components for burst capacity",
      "Circuit breaker patterns and graceful degradation strategies",
      "DDoS protection and request throttling mechanisms"
    ]
  },
  {
    value: TrafficPattern.EVENT_DRIVEN,
    label: "Event Driven",
    description: "Traffic triggered by specific scheduled or external events rather than continuous usage",
    iconType: 'eventDriven',
    visualizationData: [5, 3, 2, 3, 5, 10, 15, 20, 95, 100, 85, 40, 20, 10, 8, 5, 3, 4, 5, 3, 2, 3, 4, 5],
    typicalMultiplierRange: [10.0, 20.0],
    businessScenarios: [
      "Batch processing systems with scheduled execution windows",
      "IoT data processing with synchronized device reporting",
      "Financial systems with end-of-day processing requirements",
      "Data analytics platforms with scheduled ETL workflows"
    ],
    architecturalImplications: [
      "Event-driven architecture with decoupled processing components",
      "Serverless functions for cost-efficient processing of intermittent workloads",
      "Aggressive scaling policies with rapid response to triggers",
      "Queuing systems to manage processing backpressure",
      "Separate infrastructure for event processing vs. baseline operations"
    ]
  }
];