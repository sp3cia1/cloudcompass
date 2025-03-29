import React from 'react';

/**
 * Budget Range Icons
 * Visual representations of different budget tiers
 */
export const MinimalBudgetIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
    {/* Single coin representing minimal budget */}
    <circle cx="12" cy="12" r="8" />
    <path d="M12 8v8" />
    <path d="M9 12h6" />
  </svg>
);

export const SmallBudgetIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
    {/* Small stack of coins */}
    <circle cx="8" cy="16" r="5" />
    <circle cx="12" cy="12" r="5" />
    <circle cx="16" cy="8" r="5" />
    <path d="M8 13v6" />
    <path d="M12 9v6" />
    <path d="M16 5v6" />
  </svg>
);

export const MediumBudgetIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
    {/* Money bag */}
    <path d="M12 3L8 6H6C4.89543 6 4 6.89543 4 8V9C4 9 4 11 12 11C20 11 20 9 20 9V8C20 6.89543 19.1046 6 18 6H16L12 3Z" />
    <path d="M4 9V16C4 17.1046 4.89543 18 6 18H18C19.1046 18 20 17.1046 20 16V9" />
    <path d="M12 9V15" />
    <path d="M9 12h6" />
  </svg>
);

export const LargeBudgetIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
    {/* Briefcase with money */}
    <rect x="3" y="7" width="18" height="14" rx="2" />
    <path d="M8 7V5c0-1.1.9-2 2-2h4a2 2 0 0 1 2 2v2" />
    <path d="M12 12v3" />
    <path d="M9 15h6" />
    <path d="M8 11h8" />
  </svg>
);

export const EnterpriseBudgetIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
    {/* Bank/enterprise building with money */}
    <path d="M3 21h18" />
    <path d="M5 21V7l7-4 7 4v14" />
    <path d="M4 7h16" />
    {/* Columns */}
    <path d="M7 21V11" />
    <path d="M12 21V11" />
    <path d="M17 21V11" />
    {/* Pediment */}
    <path d="M12 5v2" />
  </svg>
);

/**
 * Budget Flexibility Icons
 * Visual representations of different flexibility levels
 */
export const FixedBudgetIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
    {/* Locked budget box */}
    <rect x="3" y="11" width="18" height="10" rx="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    <circle cx="12" cy="16" r="1" fill="currentColor" />
  </svg>
);

export const FlexibleBudgetIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
    {/* Elastic/flexible budget */}
    <path d="M18 7c1.1 0 2 .9 2 2v9c0 1.1-.9 2-2 2H6c-1.1 0-2-.9-2-2V9c0-1.1.9-2 2-2" />
    <path d="M18 7V5c0-1.1-.9-2-2-2H8c-1.1 0-2 .9-2 2v2" />
    <path d="M12 12v-2" strokeDasharray="2 2" />
    <path d="M12 16v-2" strokeDasharray="2 2" />
    <path d="M8 12h8" strokeDasharray="2 2" />
  </svg>
);

/**
 * Cost Optimization Strategy Icons
 * Visual representations of different cost optimization approaches
 */
export const ReservedInstancesIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
    {/* Calendar with clock for reserved instances */}
    <rect x="3" y="4" width="18" height="16" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
    <circle cx="12" cy="15" r="3" />
    <path d="M12 13v2h2" />
  </svg>
);

export const SpotInstancesIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
    {/* Lightning bolt for spot/preemptible instances */}
    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
  </svg>
);

export const AutoScalingIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
    {/* Auto-scaling visualization */}
    <path d="M5 16h3a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2H5" />
    <path d="M19 16h-3a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h3" />
    <path d="M5 12h14" />
    <path d="M5 7v10" />
    <path d="M19 7v10" />
    <path d="M2 14l3 3 3-3" />
    <path d="M22 10l-3-3-3 3" />
  </svg>
);

export const RightSizingIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
    {/* Right-sizing visualization */}
    <rect x="3" y="3" width="6" height="6" rx="1" />
    <rect x="15" y="3" width="6" height="6" rx="1" />
    <rect x="3" y="15" width="6" height="6" rx="1" />
    <rect x="15" y="15" width="6" height="6" rx="1" />
    <path d="M12 6h-1" />
    <path d="M15 6h-1" />
    <path d="M6 12v1" />
    <path d="M6 15v1" />
    <path d="M12 18h1" />
    <path d="M15 18h1" />
    <path d="M18 12v-1" />
    <path d="M18 9v-1" />
  </svg>
);

export const StorageTieringIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
    {/* Storage tiers visualization */}
    <ellipse cx="12" cy="5" rx="9" ry="3" />
    <path d="M21 5v6" />
    <path d="M3 5v6" />
    <ellipse cx="12" cy="11" rx="9" ry="3" />
    <path d="M21 11v6" />
    <path d="M3 11v6" />
    <ellipse cx="12" cy="17" rx="9" ry="3" />
    <path d="M9 5v12" strokeOpacity="0.5" strokeDasharray="2 2" />
    <path d="M15 5v12" strokeOpacity="0.5" strokeDasharray="2 2" />
  </svg>
);

export const ServerlessIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
    {/* Serverless architecture (cloud functions) */}
    <path d="M17 6.1H3v9.8c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V6.1z" />
    <path d="M13 6.1v-2c0-1.1-.9-2-2-2H7c-1.1 0-2 .9-2 2v2" />
    <path d="M21 12L17 8v8l4-4z" />
    <path d="M9 12h5" />
    <path d="M7 16l4-8" />
  </svg>
);

/**
 * Budget Quality Impact Icons
 * Visual representations of budget impact on quality attributes
 */
export const PerformanceIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
    {/* Speed/performance visualization */}
    <path d="M12 2v4" />
    <path d="M12 18v4" />
    <path d="M4.93 4.93l2.83 2.83" />
    <path d="M16.24 16.24l2.83 2.83" />
    <path d="M2 12h4" />
    <path d="M18 12h4" />
    <path d="M4.93 19.07l2.83-2.83" />
    <path d="M16.24 7.76l2.83-2.83" />
    <circle cx="12" cy="12" r="5" />
    <path d="M12 9l1.5 3" />
  </svg>
);

export const ReliabilityIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
    {/* Shield check for reliability */}
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="M9 12l2 2 4-4" />
  </svg>
);

export const ScalabilityIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
    {/* Growth/scalability visualization */}
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <line x1="3" y1="9" x2="21" y2="9" />
    <line x1="3" y1="15" x2="21" y2="15" />
    <line x1="9" y1="3" x2="9" y2="21" />
    <line x1="15" y1="3" x2="15" y2="21" />
    <circle cx="9" cy="9" r="1" fill="currentColor" />
    <circle cx="15" cy="9" r="1" fill="currentColor" />
    <circle cx="9" cy="15" r="1" fill="currentColor" />
    <circle cx="15" cy="15" r="1" fill="currentColor" />
    <path d="M15 9l3 3" strokeDasharray="2 2" />
  </svg>
);

export const SecurityBudgetIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
    {/* Lock for security budget */}
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    <circle cx="12" cy="16" r="1" fill="currentColor" />
  </svg>
);

/**
 * General Budget Visualization Icons
 */
export const BudgetOptimizationIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
    {/* Budget optimization with arrows */}
    <circle cx="12" cy="12" r="8" />
    <path d="M12 8v8" />
    <path d="M9 12h6" />
    <path d="M 16 8 l 4 -4" />
    <path d="M 20 8 l 0 -4 h -4" />
    <path d="M 8 16 l -4 4" />
    <path d="M 4 16 l 0 4 h 4" />
  </svg>
);

export const BudgetConstraintIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
    {/* Budget constraint visualization */}
    <circle cx="12" cy="12" r="10" />
    <path d="M16 8l-8 8" />
    <path d="M12 7v.01" />
    <path d="M12 17v.01" />
    <path d="M7 12h.01" />
    <path d="M17 12h.01" />
  </svg>
);

export const CostSavingsIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
    {/* Piggy bank for cost savings */}
    <path d="M19 6c-2-2-6-2-8 0M6.5 7C4.5 7 3 8.5 3 10.5S4.5 14 6.5 14h10v4" />
    <path d="M14 16c0 1 1 2 2 2s2-1 2-2-1-2-2-2" />
    <path d="M9 10c0-1 1-2 2-2s2 1 2 2-1 2-2 2" />
    <path d="M7 8h-.5C5.5 8 5 8.5 5 9.5V10c0 .5.5 1 1.5 1H7" />
    <path d="M5 14v4c0 1 1 2 2 2h5" />
  </svg>
);