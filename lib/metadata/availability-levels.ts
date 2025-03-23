import { AvailabilityLevel } from "@/types";
import { AvailabilityLevelMetadata } from "./scaling";

export type AvailabilityIconType = 'standard' | 'enhanced' | 'high' | 'critical';

export type AvailabilityLevelData = Omit<AvailabilityLevelMetadata, 'icon'> & {
  iconType: AvailabilityIconType;
};

export const AVAILABILITY_LEVELS: AvailabilityLevelData[] = [
  {
    value: AvailabilityLevel.STANDARD,
    label: "Standard Availability",
    percentage: "99.9%",
    downtimePerYear: "8.76 hours",
    iconType: 'standard',
    businessImpact: "Suitable for non-critical applications where occasional downtime is acceptable",
    architecturalRequirements: [
      "Single-region deployment",
      "Basic monitoring and alerting",
      "Manual recovery procedures",
      "Regular backups",
      "No advanced redundancy requirements"
    ],
    costImpact: "low",
    appropriateFor: [
      "Internal tools and administrative systems",
      "Content websites and blogs",
      "Development and testing environments",
      "Batch processing systems with flexible timing",
      "Non-critical data analysis applications"
    ]
  },
  {
    value: AvailabilityLevel.ENHANCED,
    label: "Enhanced Availability",
    percentage: "99.95%",
    downtimePerYear: "4.38 hours",
    iconType: 'enhanced',
    businessImpact: "Appropriate for business applications where downtime has moderate operational or revenue impact",
    architecturalRequirements: [
      "Single-region with multi-zone redundancy",
      "Automated health checks and basic self-healing",
      "Basic disaster recovery plan",
      "Load balancing across instances",
      "Regular testing of recovery procedures"
    ],
    costImpact: "medium",
    appropriateFor: [
      "Business applications with moderate usage requirements",
      "E-commerce sites with predictable traffic patterns",
      "Customer-facing portals and dashboards",
      "Content management systems",
      "Department-level business applications"
    ]
  },
  {
    value: AvailabilityLevel.HIGH,
    label: "High Availability",
    percentage: "99.99%",
    downtimePerYear: "52.6 minutes",
    iconType: 'high',
    businessImpact: "For critical business applications where downtime directly results in significant revenue loss or business disruption",
    architecturalRequirements: [
      "Multi-availability zone deployment with redundancy",
      "Automated failover capabilities",
      "Comprehensive monitoring and alerting",
      "Advanced load balancing with health checks",
      "Read replicas for database tier",
      "Horizontal scaling for application tier",
      "Regular disaster recovery testing"
    ],
    costImpact: "high",
    appropriateFor: [
      "Financial systems and payment processing",
      "High-traffic e-commerce platforms",
      "Business-critical SaaS applications",
      "Customer relationship management systems",
      "Enterprise resource planning systems",
      "Systems with regulatory uptime requirements"
    ]
  },
  {
    value: AvailabilityLevel.CRITICAL,
    label: "Mission Critical",
    percentage: "99.999%",
    downtimePerYear: "5.26 minutes",
    iconType: 'critical',
    businessImpact: "For mission-critical systems where even minutes of downtime could have severe consequences for business operations, safety, or compliance",
    architecturalRequirements: [
      "Multi-region active-active deployment",
      "Global load balancing with automatic failover",
      "Real-time replication across regions",
      "Advanced health monitoring and self-healing systems",
      "Zero-downtime deployment capabilities",
      "Chaos engineering practices to ensure resilience",
      "Comprehensive disaster recovery automation",
      "Multi-level redundancy for all system components"
    ],
    costImpact: "very-high",
    appropriateFor: [
      "Healthcare and emergency response systems",
      "Financial trading platforms",
      "Critical infrastructure control systems",
      "Global payment networks",
      "High-profile public services",
      "Systems where downtime impacts safety or security",
      "Applications with strict regulatory compliance requirements"
    ]
  }
];