/**
 * Metadata API Layer
 * 
 * This file serves as the centralized access point for all scaling metadata,
 * implementing the Repository pattern to decouple consumers from implementation details.
 * It also provides derived metadata calculations that combine multiple metadata sources.
 */

// Base metadata exports
export * from './traffic-patterns';
export * from './availability-levels';
export * from './concurrent-users';
export * from './latency';

// Import types needed for calculations
import { TrafficPattern, AvailabilityLevel } from "@/types";
import { TRAFFIC_PATTERNS } from './traffic-patterns';
import { AVAILABILITY_LEVELS } from './availability-levels';

/**
 * Calculates the recommended peak multiplier based on traffic pattern
 * 
 * @param pattern The selected traffic pattern
 * @returns The recommended peak multiplier value
 */
export const getRecommendedPeakMultiplier = (pattern: TrafficPattern): number => {
  const patternData = TRAFFIC_PATTERNS.find(p => p.value === pattern);
  if (!patternData) return 1.5; // Default fallback
  
  // Return middle of typical range as recommendation
  const [min, max] = patternData.typicalMultiplierRange;
  return (min + max) / 2;
};

/**
 * Determines if the selected availability level is appropriate for the traffic pattern
 * 
 * @param availability The selected availability level
 * @param pattern The selected traffic pattern
 * @returns Whether the combination is architecturally sound
 */
export const isAvailabilityAppropriateForTraffic = (
  availability: AvailabilityLevel,
  pattern: TrafficPattern
): boolean => {
  // Business logic to determine appropriate combinations
  // For example: Event-driven traffic with unpredictable spikes should have
  // at least Enhanced availability
  if (
    (pattern === TrafficPattern.UNPREDICTABLE || pattern === TrafficPattern.EVENT_DRIVEN) && 
    availability === AvailabilityLevel.STANDARD
  ) {
    return false;
  }

  
  
  return true;
};

/**
 * Calculates infrastructure tier based on concurrent users and availability level
 * 
 * @param concurrentUsers Number of concurrent users
 * @param availability Selected availability level
 * @returns The recommended infrastructure tier name
 */
export const calculateInfrastructureTier = (
  concurrentUsers: number,
  availability: AvailabilityLevel
): string => {
  // Logic that combines user scale and availability to recommend
  // specific infrastructure patterns
  
  // Example simplified logic
  let tier = "Standard";
  
  if (concurrentUsers > 10000 || availability === AvailabilityLevel.CRITICAL) {
    tier = "Enterprise";
  } else if (concurrentUsers > 1000 || availability === AvailabilityLevel.HIGH) {
    tier = "Business";
  } else if (concurrentUsers > 100 || availability === AvailabilityLevel.ENHANCED) {
    tier = "Professional";
  }
  
  return tier;
};