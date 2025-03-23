import React from 'react';

export const StandardAvailabilityIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
    {/* Single server with basic protection */}
    <rect x="8" y="8" width="8" height="12" rx="1" />
    <path d="M6 20h12" />
    <path d="M12 4v4" />
  </svg>
);

export const EnhancedAvailabilityIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
    {/* Multiple servers in single region */}
    <rect x="5" y="8" width="6" height="12" rx="1" />
    <rect x="13" y="8" width="6" height="12" rx="1" />
    <path d="M4 20h16" />
    <path d="M9 4v4" />
    <path d="M15 4v4" />
    <path d="M7 12h10" />
    <path d="M7 16h10" />
  </svg>
);

export const HighAvailabilityIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
    {/* Redundant servers with load balancer */}
    <rect x="4" y="10" width="5" height="10" rx="1" />
    <rect x="10" y="10" width="5" height="10" rx="1" />
    <rect x="16" y="10" width="5" height="10" rx="1" />
    <path d="M3 20h19" />
    <path d="M12 2v3" />
    <path d="M9 5h6" />
    <ellipse cx="12" cy="8" rx="6" ry="2" />
    <path d="M6 8v2" />
    <path d="M18 8v2" />
  </svg>
);

export const CriticalAvailabilityIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
    {/* Multi-region with global load balancing */}
    <circle cx="12" cy="12" r="10" />
    <path d="M2 12h4" />
    <path d="M18 12h4" />
    <path d="M12 2v4" />
    <path d="M12 18v4" />
    <rect x="7" y="7" width="4" height="4" rx="1" />
    <rect x="13" y="7" width="4" height="4" rx="1" />
    <rect x="7" y="13" width="4" height="4" rx="1" />
    <rect x="13" y="13" width="4" height="4" rx="1" />
    <circle cx="12" cy="12" r="2" />
  </svg>
);