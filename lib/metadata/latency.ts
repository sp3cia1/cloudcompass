import { LatencyMetadata } from "./scaling";

/**
 * Metadata for the application latency requirements component
 *
 * This provides configuration for a latency slider with meaningful markers
 * that map technical values (milliseconds) to user perception and 
 * architectural implications.
 */
export const LATENCY_METADATA: LatencyMetadata = {
  // Range boundaries for latency slider (50ms to 1000ms)
  min: 50,
  max: 1000,
  step: 50,
  
  // Markers with human perception descriptions
  markers: [
    { value: 50, label: "50ms ($$$$$)", perception: "Imperceptible delay" },
    { value: 100, label: "100ms ($$$$)", perception: "Slight delay" },
    { value: 300, label: "300ms ($$$)", perception: "Noticeable delay" },
    { value: 500, label: "500ms ($$)", perception: "Frustrating delay" },
    { value: 1000, label: "1000ms ($)", perception: "Unacceptable delay" }
  ],
  
  // Geographic/distribution factors
  regionalImpact: {
    "Same region": 1,          // Baseline multiplier
    "Adjacent region": 1.5,    // 50% increase in latency
    "Cross-continental": 2.5,  // 150% increase
    "Global": 3.5              // 250% increase
  },
  
  // Architectural implications for different latency targets
  architecturalImplications: {
    "50-100": {
      description: "Ultra-low latency requirements",
      recommendations: [
        "Edge computing deployment for global users",
        "In-memory data processing with minimal database access",
        "WebSocket or server-sent events for real-time updates",
        "Content pre-loading and aggressive client-side caching",
        "Premium tier cloud services with dedicated infrastructure"
      ],
      suitableFor: [
        "Real-time trading applications",
        "Online gaming",
        "Video conferencing",
        "Real-time collaborative editing"
      ]
    },
    "101-300": {
      description: "Low latency requirements",
      recommendations: [
        "Multi-region deployment with geographically distributed data",
        "CDN implementation for static assets",
        "Read replicas for database access",
        "Optimized network routes and premium connectivity",
        "Asynchronous processing for non-critical operations"
      ],
      suitableFor: [
        "Interactive web applications",
        "E-commerce platforms",
        "Social media applications",
        "Financial dashboards"
      ]
    },
    "301-500": {
      description: "Standard latency requirements",
      recommendations: [
        "Regional deployments optimized for primary user base",
        "Standard CDN configuration",
        "Caching strategies for frequently accessed data",
        "Background processing for intensive operations",
        "Optimized API design to minimize request chains"
      ],
      suitableFor: [
        "Content-focused websites",
        "Business applications",
        "Mobile application backends",
        "Administrative systems"
      ]
    },
    "501+": {
      description: "Relaxed latency requirements",
      recommendations: [
        "Centralized deployment in primary region",
        "Batch processing for data operations",
        "Cost-optimized infrastructure selection",
        "Asynchronous workflows and notifications",
        "Resource-sharing multi-tenant architecture"
      ],
      suitableFor: [
        "Reporting and analytics systems",
        "Background processing services",
        "Data warehousing applications",
        "Non-interactive administrative tools"
      ]
    }
  }
};