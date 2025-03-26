import { DataType, DataAccessPattern } from "@/types";

// Enhanced type definitions for business-friendly metadata
export interface DataTypeMetadata {
  value: DataType;
  label: string;
  description: string;
  businessUseCase: string;
  costIndicator: number; // 1-5 scale for $ symbols
  scalingConsideration: string;
  iconType: string;
  
  // Business-oriented decision factors
  idealFor: string[];      // Business scenarios where this excels
  advantages: string[];    // Business benefits
  limitations: string[];   // Challenges in business terms
}

export interface DataAccessPatternMetadata {
  value: DataAccessPattern;
  label: string;
  description: string;
  businessScenarios: string[];
  costImplications: number; // 1-5 scale
  performanceNote: string;
  visualType: string;
}

// Data types with business-friendly descriptions
export const DATA_TYPES: DataTypeMetadata[] = [
  {
    value: DataType.RELATIONAL,
    label: "Structured Data",
    description: "Information organized in tables with relationships, like interconnected spreadsheets",
    businessUseCase: "Customer records, orders, inventory, financial data",
    costIndicator: 3, // $$$
    scalingConsideration: "Requires more planning as your business grows",
    iconType: "relational",
    
    idealFor: [
      "Financial systems",
      "Order management",
      "Inventory tracking",
      "Customer relationship management"
    ],
    advantages: [
      "Excellent for data that follows consistent patterns",
      "Strong reliability for financial transactions",
      "Powerful reporting and business intelligence",
      "Well-established technology with proven reliability"
    ],
    limitations: [
      "Requires planning your data structure in advance",
      "Less flexible when business needs change rapidly",
      "May become more expensive as data volume grows",
      "Can be complex to scale for very high traffic"
    ]
  },
  
  {
    value: DataType.DOCUMENT,
    label: "Flexible Documents",
    description: "Free-form information that can vary between entries, like customizable forms",
    businessUseCase: "User profiles, content management, product catalogs",
    costIndicator: 2, // $$
    scalingConsideration: "Adapts easily to changing business requirements",
    iconType: "document",
    
    idealFor: [
      "Content management systems",
      "User profiles and personalization",
      "Product catalogs with varying attributes",
      "Applications that need to evolve quickly"
    ],
    advantages: [
      "Adapts quickly to changing business requirements",
      "No rigid structure - each entry can have different fields",
      "Easier to get started without extensive planning",
      "Good performance for most business applications"
    ],
    limitations: [
      "Less efficient for complex reporting across many records",
      "May require additional work for data consistency",
      "Can be harder to enforce business rules across records",
      "Not ideal for transactions that span multiple records"
    ]
  },
  
  {
    value: DataType.KEY_VALUE,
    label: "Simple Lookups",
    description: "Fast key-based retrieval for straightforward information pairs",
    businessUseCase: "Configuration settings, session data, feature flags",
    costIndicator: 1, // $
    scalingConsideration: "Extremely scalable for simple lookup operations",
    iconType: "keyValue",
    
    idealFor: [
      "Website settings and preferences",
      "User sessions and shopping carts",
      "Feature flags and toggles",
      "High-traffic applications needing fast lookups"
    ],
    advantages: [
      "Extremely fast for simple lookups",
      "Very cost-effective for high-volume traffic",
      "Easily scales to massive usage levels",
      "Simple to implement and maintain"
    ],
    limitations: [
      "Limited to simple data structures",
      "Not suitable for complex relationships between data",
      "Limited querying capabilities",
      "Not designed for reporting or analytics"
    ]
  },
  
  {
    value: DataType.GRAPH,
    label: "Connected Networks",
    description: "Information where relationships between items are the primary focus",
    businessUseCase: "Social networks, recommendation engines, knowledge graphs",
    costIndicator: 4, // $$$$
    scalingConsideration: "Specialized for complex relationship-based data",
    iconType: "graph",
    
    idealFor: [
      "Social networks and connections",
      "Recommendation engines",
      "Complex dependency tracking",
      "Knowledge graphs and relationship mapping"
    ],
    advantages: [
      "Exceptional for analyzing connections between data points",
      "Powerful for recommendation systems",
      "Natural fit for relationship-heavy information",
      "Enables complex network analysis"
    ],
    limitations: [
      "Higher cost than traditional databases",
      "Steeper learning curve for implementation",
      "Specialized skills required for maintenance",
      "Not ideal for simple data storage needs"
    ]
  },
  
  {
    value: DataType.TIME_SERIES,
    label: "Time-Based Metrics",
    description: "Data points collected sequentially over time, like trend information",
    businessUseCase: "IoT sensors, application metrics, financial analytics",
    costIndicator: 3, // $$$
    scalingConsideration: "Optimized for time-based analysis and retention",
    iconType: "timeSeries",
    
    idealFor: [
      "Monitoring systems and dashboards",
      "Financial market analysis",
      "IoT and sensor data collection",
      "Performance tracking over time"
    ],
    advantages: [
      "Optimized for time-based queries and analysis",
      "Excellent for trend visualization and forecasting",
      "Efficient storage for chronological measurements",
      "Good performance for time-window queries"
    ],
    limitations: [
      "Specialized for time-based data only",
      "Less suitable for general-purpose applications",
      "Can be complex to integrate with other data types",
      "May require data retention policies to manage costs"
    ]
  },
  
  {
    value: DataType.BLOB,
    label: "Binary Storage",
    description: "Storage for raw binary data like files and large objects",
    businessUseCase: "Raw data storage, backups, archives",
    costIndicator: 2, // $$
    scalingConsideration: "Scales well for large object storage",
    iconType: "blob",
    
    idealFor: [
      "Large file storage",
      "Data backups",
      "Archive solutions",
      "Raw data repositories"
    ],
    advantages: [
      "Efficient storage of large binary objects",
      "Cost-effective for archival needs",
      "Simple upload/download operations",
      "Good for infrequently accessed large data"
    ],
    limitations: [
      "Limited search capabilities",
      "Not suitable for structured data",
      "Can be costly for frequent access patterns",
      "Limited processing capabilities"
    ]
  },

  {
    value: DataType.FILE,
    label: "File Storage",
    description: "Storage for organized files and documents with metadata",
    businessUseCase: "Documents, images, videos, user uploads",
    costIndicator: 2, // $$
    scalingConsideration: "Scales well but requires planning for access patterns",
    iconType: "file",
    
    idealFor: [
      "Document management systems",
      "Media libraries (images, videos, audio)",
      "User file uploads and downloads",
      "Shared file access scenarios"
    ],
    advantages: [
      "Perfect for storing files in their original format",
      "Support for folder structures and organization",
      "Built-in permission and sharing models",
      "Simple integration with end-user applications"
    ],
    limitations: [
      "Not suitable for highly structured data",
      "Limited query capabilities compared to databases",
      "Access patterns need careful planning",
      "Can become costly for frequently accessed large files"
    ]
  },
  
  {
    value: DataType.MULTIMEDIA,
    label: "Media Content",
    description: "Specialized storage for audio, video, and image content",
    businessUseCase: "Media streaming, content delivery, image processing",
    costIndicator: 4, // $$$$
    scalingConsideration: "Requires specialized infrastructure for efficient delivery",
    iconType: "multimedia",
    
    idealFor: [
      "Media streaming services",
      "Video hosting platforms",
      "Image-heavy applications",
      "Content delivery networks"
    ],
    advantages: [
      "Optimized for media delivery performance",
      "Support for streaming protocols",
      "Built-in transcoding and format conversion",
      "Efficient caching and delivery options"
    ],
    limitations: [
      "Higher cost than general storage",
      "Complex infrastructure requirements",
      "Bandwidth costs can be significant",
      "Requires specialized knowledge to implement well"
    ]
  },
  
  {
    value: DataType.STREAM,
    label: "Real-Time Data Flow",
    description: "Continuous stream of events processed as they happen",
    businessUseCase: "Real-time analytics, event logging, activity feeds",
    costIndicator: 4, // $$$$
    scalingConsideration: "Designed for high-throughput continuous processing",
    iconType: "stream",
    
    idealFor: [
      "Real-time analytics dashboards",
      "Live user notifications",
      "Event-driven applications",
      "IoT data processing"
    ],
    advantages: [
      "Processes data immediately as it arrives",
      "Enables instant insights and alerts",
      "Minimizes delays for time-sensitive operations",
      "Supports real-time decision making"
    ],
    limitations: [
      "More complex to implement than traditional databases",
      "Higher infrastructure costs for continuous processing",
      "Requires careful error handling and recovery mechanisms",
      "Can be challenging to debug and monitor"
    ]
  }
];

// Data access patterns with business context
export const DATA_ACCESS_PATTERNS: DataAccessPatternMetadata[] = [
  {
    value: DataAccessPattern.READ_HEAVY,
    label: "Mostly Reading",
    description: "Your application primarily retrieves information with occasional updates",
    businessScenarios: ["Content websites", "Product catalogs", "Knowledge bases"],
    costImplications: 2, // $$
    performanceNote: "Can be optimized with caching for excellent performance",
    visualType: "readHeavy"
  },
  {
    value: DataAccessPattern.WRITE_HEAVY,
    label: "Mostly Writing",
    description: "Your application frequently creates or updates information",
    businessScenarios: ["Logging systems", "Data collection", "Telemetry"],
    costImplications: 3, // $$$
    performanceNote: "May require specialized storage for write optimization",
    visualType: "writeHeavy"
  },
  {
    value: DataAccessPattern.BALANCED,
    label: "Balanced Reading & Writing",
    description: "Your application has similar amounts of reading and writing operations",
    businessScenarios: ["E-commerce platforms", "Social media", "Collaboration tools"],
    costImplications: 3, // $$$
    performanceNote: "Requires balanced architecture that handles both well",
    visualType: "balanced"
  },
  {
    value: DataAccessPattern.BURSTY,
    label: "Periodic Spikes",
    description: "Your application experiences sudden bursts of activity followed by quiet periods",
    businessScenarios: ["Flash sales", "Event registrations", "Reporting systems"],
    costImplications: 3, // $$$
    performanceNote: "Requires architecture that can scale quickly during peak times",
    visualType: "bursty"
  }
];

// Storage size configuration for logarithmic slider
export const STORAGE_SIZE_METADATA = {
  min: 1,
  max: 10000,
  logarithmicBase: 10,
  step: 1,
  markers: [
    { value: 1, label: "1 GB", description: "Minimal storage for small applications" },
    { value: 10, label: "10 GB", description: "Typical for small business applications" },
    { value: 100, label: "100 GB", description: "Medium-sized business data" },
    { value: 1000, label: "1 TB", description: "Large enterprise datasets" },
    { value: 10000, label: "10 TB", description: "Data-intensive enterprise applications" }
  ],
  infrastructureImplications: {
    "1-10": "Small application storage needs, suitable for serverless and minimal infrastructure",
    "11-100": "Medium storage requirements, typical for standard business applications",
    "101-1000": "Large dataset with significant storage requirements",
    "1001+": "Enterprise-scale data volumes requiring specialized storage architecture"
  }
};

// Data retention periods with business context
export const DATA_RETENTION_PERIODS = [
  { value: 30, label: "30 days", description: "Short-term storage for temporary data", costIndicator: 1 },
  { value: 90, label: "3 months", description: "Quarterly business cycle", costIndicator: 2 },
  { value: 365, label: "1 year", description: "Annual business cycle", costIndicator: 3 },
  { value: 730, label: "2 years", description: "Extended business analysis", costIndicator: 4 },
  { value: 1825, label: "5 years", description: "Regulatory compliance for many industries", costIndicator: 5 },
  { value: 3650, label: "10 years", description: "Long-term archival and compliance", costIndicator: 5 }
];