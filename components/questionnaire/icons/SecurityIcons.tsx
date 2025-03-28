import React from 'react';

/**
 * Security Level Icons
 * Visual representations of the three security levels with progressive complexity
 */
export const BasicSecurityIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
    {/* Simple shield with minimal protection */}
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

export const EnhancedSecurityIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
    {/* Shield with additional protective layer */}
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="M12 17a2 2 0 100-4 2 2 0 000 4z" strokeLinejoin="round" />
    <path d="M8 11h8" />
  </svg>
);

export const HighSecurityIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
    {/* Advanced shield with multiple protective layers */}
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="M12 17a2 2 0 100-4 2 2 0 000 4z" fill="currentColor" />
    <path d="M8 11h8" />
    <path d="M9 8l3 3 3-3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/**
 * Security Category Icons
 * Visual representations of different security capability domains
 */
export const IdentitySecurityIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
    {/* User identity protection */}
    <circle cx="12" cy="8" r="4" />
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
    <path d="M16 3.13a4 4 0 010 7.75" strokeLinecap="round" strokeDasharray="0.5 2.5" />
  </svg>
);

export const DataSecurityIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
    {/* Database with shield protection */}
    <ellipse cx="12" cy="5" rx="9" ry="3" />
    <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
    <path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3" strokeOpacity="0.5" />
    <path d="M12 13.5l2.2-2.2a1 1 0 111.4 1.4L12 16.3 8.4 12.7a1 1 0 111.4-1.4l2.2 2.2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
  </svg>
);

export const NetworkSecurityIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
    {/* Network with firewall protection */}
    <rect x="2" y="7" width="20" height="10" rx="2" />
    <path d="M12 7v10" strokeLinecap="round" />
    <path d="M17 7v10" strokeLinecap="round" />
    <path d="M7 7v10" strokeLinecap="round" />
    <path d="M2 12h5" strokeLinecap="round" strokeOpacity="0.5" />
    <path d="M7 12h5" strokeLinecap="round" strokeOpacity="0.5" />
    <path d="M12 12h5" strokeLinecap="round" strokeOpacity="0.5" />
    <path d="M17 12h5" strokeLinecap="round" strokeOpacity="0.5" />
  </svg>
);

export const ThreatSecurityIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
    {/* Threat detection and prevention */}
    <circle cx="12" cy="12" r="10" />
    <path d="M16 8l-8 8" />
    <path d="M8 8l8 8" />
    <path d="M12 22v-2" strokeOpacity="0.5" strokeDasharray="2 2" />
    <path d="M12 6V4" strokeOpacity="0.5" strokeDasharray="2 2" />
    <path d="M4 12h2" strokeOpacity="0.5" strokeDasharray="2 2" />
    <path d="M18 12h2" strokeOpacity="0.5" strokeDasharray="2 2" />
  </svg>
);

export const MonitoringSecurityIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
    {/* Security monitoring and logging */}
    <rect x="3" y="4" width="18" height="12" rx="2" />
    <path d="M7 20h10" />
    <path d="M9 16v4" />
    <path d="M15 16v4" />
    <path d="M7 10l3-3 2 2 5-5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const GovernanceSecurityIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
    {/* Security governance and policies */}
    <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09" />
    <path d="M18 8.5v-.77l-6-3.27-6 3.27v.77" strokeOpacity="0.7" />
    <path d="M16 13a2 2 0 100-4 2 2 0 000 4z" fill="currentColor" strokeOpacity="0.8" />
    <path d="M21 11h1" strokeLinecap="round" />
    <path d="M19.5 8l.87-.5" strokeLinecap="round" />
    <path d="M19.5 14l.87.5" strokeLinecap="round" />
  </svg>
);

export const ComplianceSecurityIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
    {/* Compliance and regulatory controls */}
    <path d="M9 12l2 2 4-4" />
    <path d="M16 21H8a2 2 0 01-2-2V5a2 2 0 012-2h6l4 4v12a2 2 0 01-2 2z" />
    <path d="M12 3v4h4" strokeOpacity="0.7" />
  </svg>
);

/**
 * Specialized Security Capability Icons
 * Visual representations of specific security capabilities
 */
export const MFASecurityIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
    {/* Multi-factor authentication */}
    <rect x="4" y="5" width="16" height="14" rx="2" />
    <path d="M12 8v5" />
    <path d="M12 16h.01" />
    <circle cx="8" cy="9" r="1" fill="currentColor" />
    <circle cx="8" cy="12" r="1" fill="currentColor" />
    <circle cx="8" cy="15" r="1" fill="currentColor" />
    <circle cx="16" cy="9" r="1" fill="currentColor" />
    <circle cx="16" cy="12" r="1" fill="currentColor" />
    <circle cx="16" cy="15" r="1" fill="currentColor" />
  </svg>
);

export const EncryptionSecurityIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
    {/* Data encryption */}
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0110 0v4" />
    <path d="M12 16a1 1 0 100-2 1 1 0 000 2z" fill="currentColor" />
  </svg>
);

export const VulnerabilityScanIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
    {/* Vulnerability scanning */}
    <circle cx="11" cy="11" r="8" />
    <path d="M21 21l-4.35-4.35" />
    <path d="M8 11h6" />
    <path d="M11 8v6" />
  </svg>
);

export const SecurityScoreIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
    {/* Security score/rating visualization */}
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="M12 8v8" />
    <path d="M8 12l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const DDoSProtectionIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
    {/* DDoS protection */}
    <path d="M12 3a9 9 0 011 18m-1-18a9 9 0 00-1 18" />
    <path d="M8 7h.01" /> 
    <path d="M7 10h.01" />
    <path d="M6 13h.01" />
    <path d="M7 17h.01" />
    <path d="M10 18h.01" />
    <path d="M14 18h.01" /> 
    <path d="M17 17h.01" />
    <path d="M18 14h.01" />
    <path d="M17 11h.01" />
    <path d="M16 8h.01" />
    <path d="M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
  </svg>
);

export const SecureDataTransitIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
    {/* Data in transit security */}
    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    <path d="M5 12a2 2 0 100-4 2 2 0 000 4z" fill="currentColor" />
    <path d="M19 12a2 2 0 100-4 2 2 0 000 4z" fill="currentColor" />
  </svg>
);