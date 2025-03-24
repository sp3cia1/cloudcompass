import { TrafficPattern, AvailabilityLevel } from "@/types";
import { ReactNode } from "react";

// Traffic pattern metadata interface
export interface TrafficPatternMetadata {
  value: TrafficPattern;
  label: string;
  description: string;
  icon: ReactNode;
  visualizationData: number[]; // 24 data points representing a day
  typicalMultiplierRange: [number, number];
  businessScenarios: string[];
  architecturalImplications: string[];
}

// Availability level metadata interface
export interface AvailabilityLevelMetadata {
  value: AvailabilityLevel;
  label: string;
  percentage: string;
  downtimePerYear: string;
  businessImpact: string;
  architecturalRequirements: string[];
  costImpact: "low" | "medium" | "high" | "very-high";
  appropriateFor: string[];
  icon: ReactNode;
}

// Concurrent users metadata interface
export interface ConcurrentUsersMetadata {
  min: number;
  max: number;
  defaultValue: number;
  logarithmicBase: number;
  markers: { value: number; label: string }[];
  infrastructureImplications: Record<string, string>;
}

// Latency metadata interface
export interface LatencyMetadata {
  min: number;
  max: number;
  step: number;
  markers: { value: number; label: string; perception: string }[];
  regionalImpact: Record<string, number>;

  architecturalImplications: Record<string, {
    description: string;
    recommendations: string[];
    suitableFor: string[];
  }>;
}