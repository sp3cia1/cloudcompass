import { ConcurrentUsersMetadata } from "./scaling";

/**
 * Metadata for the concurrent users component
 * 
 * This metadata drives a logarithmic slider that lets users select
 * concurrent user counts across multiple orders of magnitude.
 * Each range of user counts has specific infrastructure implications.
 */
export const CONCURRENT_USERS_METADATA: ConcurrentUsersMetadata = {
  // Range boundaries (10 to 1 million users)
  min: 10,
  max: 1000000,
  defaultValue: 100,
  
  // Base for logarithmic calculations
  logarithmicBase: 10,
  
  // Markers for the slider representing orders of magnitude
  markers: [
    { value: 10, label: "10" },
    { value: 100, label: "100" },
    { value: 1000, label: "1K" },
    { value: 10000, label: "10K" },
    { value: 100000, label: "100K" },
    { value: 1000000, label: "1M" }
  ],
  
  // Infrastructure implications for different user count ranges
  infrastructureImplications: {
    "10-100": "Simple single-instance deployment with standard resources. Suitable for MVPs, internal tools, and applications with limited user base.",
    
    "101-1000": "Load-balanced multi-instance deployment with basic auto-scaling. Requires horizontal scaling capabilities and application state management.",
    
    "1001-10000": "Distributed architecture with caching layer, optimized database access patterns, and regional deployment. Requires careful capacity planning and performance optimization.",
    
    "10001-100000": "Multi-tier architecture with database sharding, distributed caching, and traffic management systems. Requires sophisticated scaling strategies, data partitioning, and monitoring.",
    
    "100001+": "Global-scale architecture with edge computing, custom scaling solutions, and specialized infrastructure. Requires advanced distributed systems expertise, multi-region strategies, and complex observability systems."
  }
};