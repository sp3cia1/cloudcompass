import React from 'react';

export const RelationalDataIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
    {/* Connected tables with relationships visualization */}
    <rect x="3" y="3" width="8" height="6" rx="1" />
    <rect x="3" y="15" width="8" height="6" rx="1" />
    <rect x="16" y="9" width="8" height="6" rx="1" />
    {/* Relationship lines */}
    <path d="M7 9v6" strokeDasharray="2 2" />
    <path d="M11 6h2.5L16 9" strokeDasharray="2 2" />
    <path d="M11 18h2.5L16 15" strokeDasharray="2 2" />
  </svg>
);

export const DocumentDataIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
    {/* Document with flexible structure */}
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
    <path d="M14 2v6h6" />
    {/* JSON-like structure */}
    <path d="M8 13h2" />
    <path d="M8 17h4" />
    <path d="M14 13h2" />
  </svg>
);

export const KeyValueDataIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
    {/* Key-value pair visualization */}
    <path d="M9 7l6 5-6 5V7z" />
    <rect x="3" y="7" width="6" height="10" rx="1" />
    <rect x="15" y="7" width="6" height="10" rx="1" />
  </svg>
);

export const GraphDataIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
    {/* Network of connected nodes */}
    <circle cx="5" cy="6" r="2" />
    <circle cx="12" cy="4" r="2" />
    <circle cx="18" cy="8" r="2" />
    <circle cx="9" cy="12" r="2" />
    <circle cx="15" cy="16" r="2" />
    <circle cx="7" cy="19" r="2" />
    {/* Connecting edges */}
    <path d="M7 6l3 0" />
    <path d="M13.5 5l3 2" />
    <path d="M16 8.5l-5 3" />
    <path d="M10.5 13.5l3 1.5" />
    <path d="M8.5 17.5l-0.5 -4" />
    <path d="M7 17l1.5 -5" />
  </svg>
);

export const TimeSeriesDataIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
    {/* Time-series visualization */}
    <path d="M3 12h18" strokeOpacity="0.3" />
    <path d="M3 17h18" strokeOpacity="0.3" />
    <path d="M3 7h18" strokeOpacity="0.3" />
    <path d="M3 20V4" />
    <path d="M21 20h-18" />
    {/* Time series line */}
    <path d="M3 15l3-6 4 2 3-8 4 5 4-3" strokeLinejoin="round" strokeLinecap="round" />
  </svg>
);

export const BlobDataIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
    {/* File/Blob storage visualization */}
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
    <path d="M14 2v6h6" />
    {/* File indicators */}
    <path d="M9 13a1 1 0 100-2 1 1 0 000 2z" fill="currentColor" />
    <path d="M9 17a1 1 0 100-2 1 1 0 000 2z" fill="currentColor" />
    <path d="M15 13a1 1 0 100-2 1 1 0 000 2z" fill="currentColor" />
    <path d="M15 17a1 1 0 100-2 1 1 0 000 2z" fill="currentColor" />
  </svg>
);

export const StreamDataIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
    {/* Streaming data visualization */}
    <path d="M3 7h3c2 0 2 4 4 4s2-4 4-4 2 4 4 4 2-4 4-4h2" />
    <path d="M3 12h3c2 0 2 4 4 4s2-4 4-4 2 4 4 4 2-4 4-4h2" />
    <path d="M3 17h18" strokeDasharray="2 2" />
  </svg>
);