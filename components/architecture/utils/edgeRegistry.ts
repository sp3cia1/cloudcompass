import React, { useMemo } from 'react';
import { EdgeTypes } from 'reactflow';
import { CloudProvider } from '@/lib/store/applicationState';
import { ConnectionType, ComponentConnection } from '@/types/architecture';

// Edge components
import BaseEdge, { BaseEdgeProps, BaseEdgeData } from '../edges/BaseEdge';
import DataFlowEdge from '../edges/DataFlowEdge';
import DependencyEdge from '../edges/DependencyEdge';

/**
 * Edge categories for organization and filtering
 */
export enum EdgeCategory {
  CONNECTIVITY = 'connectivity',
  DATA_MOVEMENT = 'data-movement', 
  DEPENDENCY = 'dependency',
  SECURITY = 'security',
  EVENT = 'event'
}

/**
 * Maps connection types to their categories for organization
 */
const connectionCategoryMap: Record<ConnectionType, EdgeCategory> = {
  [ConnectionType.NETWORK]: EdgeCategory.CONNECTIVITY,
  [ConnectionType.DATA_FLOW]: EdgeCategory.DATA_MOVEMENT,
  [ConnectionType.DEPENDENCY]: EdgeCategory.DEPENDENCY,
  [ConnectionType.EVENT]: EdgeCategory.EVENT,
  [ConnectionType.AUTHENTICATION]: EdgeCategory.SECURITY
};

/**
 * Maps connection types to their specialized edge components
 */
const connectionComponentMap: Record<ConnectionType, React.ComponentType<any>> = {
  [ConnectionType.NETWORK]: BaseEdge,
  [ConnectionType.DATA_FLOW]: DataFlowEdge,
  [ConnectionType.DEPENDENCY]: DependencyEdge,
  [ConnectionType.EVENT]: BaseEdge,
  [ConnectionType.AUTHENTICATION]: BaseEdge
};

/**
 * Metadata for each connection type to enhance visualization and filtering
 */
export interface EdgeMetadata {
  displayName: string;
  description: string;
  category: EdgeCategory;
  defaultAnimated: boolean;
  defaultStrokeWidth: number;
  defaultDashArray: string | null;
  bidirectionalSupport: boolean;
  color: {
    default: string;
    hover: string;
    selected: string;
  };
  visualProperties?: Record<string, any>;
}

/**
 * Edge creation options for flexibility
 */
export interface EdgeOptions {
  label?: string;
  animated?: boolean;
  data?: Record<string, any>;
  style?: React.CSSProperties;
  markerEnd?: string;
  markerStart?: string;
  type?: ConnectionType;
  provider?: CloudProvider;
}

/**
 * Edge factory function type
 */
export type EdgeFactory = (
  sourceId: string, 
  targetId: string, 
  connectionType: ConnectionType, 
  options?: EdgeOptions
) => any;

/**
 * Registry for custom edge factories
 */
const edgeFactories: Record<ConnectionType, EdgeFactory> = {} as Record<ConnectionType, EdgeFactory>;

/**
 * Custom edge types beyond the enum
 */
const customEdgeTypes: Record<string, {
  component: React.ComponentType<any>;
  metadata: EdgeMetadata;
  factory?: EdgeFactory;
}> = {};

/**
 * Comprehensive metadata for all connection types
 */
const edgeMetadata: Record<ConnectionType, EdgeMetadata> = {
  [ConnectionType.NETWORK]: {
    displayName: 'Network Connection',
    description: 'Represents a network connection between components',
    category: EdgeCategory.CONNECTIVITY,
    defaultAnimated: true,
    defaultStrokeWidth: 2,
    defaultDashArray: null,
    bidirectionalSupport: true,
    color: {
      default: '#3b82f6', // blue-500
      hover: '#60a5fa',   // blue-400
      selected: '#2563eb' // blue-600
    },
    visualProperties: {
      showBandwidth: true,
      showLatency: true
    }
  },
  [ConnectionType.DATA_FLOW]: {
    displayName: 'Data Flow',
    description: 'Represents data movement between components',
    category: EdgeCategory.DATA_MOVEMENT,
    defaultAnimated: true,
    defaultStrokeWidth: 3,
    defaultDashArray: null,
    bidirectionalSupport: true,
    color: {
      default: '#16a34a', // green-600
      hover: '#4ade80',   // green-400
      selected: '#15803d' // green-700
    },
    visualProperties: {
      showDataRate: true,
      showEncryption: true
    }
  },
  [ConnectionType.DEPENDENCY]: {
    displayName: 'Dependency',
    description: 'Represents a dependency relationship between components',
    category: EdgeCategory.DEPENDENCY,
    defaultAnimated: false,
    defaultStrokeWidth: 2,
    defaultDashArray: '5,5',
    bidirectionalSupport: true,
    color: {
      default: '#f59e0b', // amber-500
      hover: '#fbbf24',   // amber-400
      selected: '#d97706' // amber-600
    },
    visualProperties: {
      showCriticality: true,
      showVersionConstraint: true
    }
  },
  [ConnectionType.EVENT]: {
    displayName: 'Event',
    description: 'Represents an event flow between components',
    category: EdgeCategory.EVENT,
    defaultAnimated: true,
    defaultStrokeWidth: 2.5,
    defaultDashArray: '3,2',
    bidirectionalSupport: false,
    color: {
      default: '#8b5cf6', // violet-500
      hover: '#a78bfa',   // violet-400
      selected: '#7c3aed' // violet-600
    },
    visualProperties: {
      showEventRate: true,
      showEventTypes: true
    }
  },
  [ConnectionType.AUTHENTICATION]: {
    displayName: 'Authentication',
    description: 'Represents an authentication relationship',
    category: EdgeCategory.SECURITY,
    defaultAnimated: false,
    defaultStrokeWidth: 2,
    defaultDashArray: '10,5',
    bidirectionalSupport: true,
    color: {
      default: '#ec4899', // pink-500
      hover: '#f472b6',   // pink-400
      selected: '#db2777' // pink-600
    },
    visualProperties: {
      showAuthType: true,
      showSecurityLevel: true
    }
  }
};

/**
 * Default edge factory implementation
 */
const defaultEdgeFactory: EdgeFactory = (sourceId, targetId, connectionType, options = {}) => {
  // Generate a unique ID for the edge
  const edgeId = `${sourceId}-${connectionType}-${targetId}-${Date.now().toString(36)}`;
  
  // Get metadata for this connection type
  const metadata = edgeMetadata[connectionType] || edgeMetadata[ConnectionType.NETWORK];
  
  return {
    id: edgeId,
    source: sourceId,
    target: targetId,
    type: options.type || connectionType,
    animated: options.animated ?? metadata.defaultAnimated,
    style: {
      strokeWidth: metadata.defaultStrokeWidth,
      ...(options.style || {})
    },
    markerEnd: options.markerEnd,
    markerStart: options.markerStart,
    data: {
      type: connectionType,
      provider: options.provider || 'aws',
      label: options.label || metadata.displayName,
      ...options.data
    }
  };
};

// Initialize all edge factories with the default implementation
Object.values(ConnectionType).forEach(type => {
  edgeFactories[type] = defaultEdgeFactory;
});

/**
 * Creates a complete mapping of edge types for use with ReactFlow
 */
export const createEdgeTypes = (): EdgeTypes => {
  const edgeTypes: EdgeTypes = {};
  
  // Add built-in edge types
  Object.entries(connectionComponentMap).forEach(([type, component]) => {
    edgeTypes[type] = component;
  });
  
  // Add custom edge types
  Object.entries(customEdgeTypes).forEach(([type, { component }]) => {
    edgeTypes[type] = component;
  });
  
  return edgeTypes;
};

/**
 * Creates an edge based on connection information
 */
export const createEdge = (
  sourceId: string, 
  targetId: string, 
  connectionType: ConnectionType, 
  options?: EdgeOptions
) => {
  const factory = edgeFactories[connectionType] || defaultEdgeFactory;
  return factory(sourceId, targetId, connectionType, options);
};

/**
 * Creates an edge directly from a ComponentConnection with position
 */
export const createEdgeFromConnection = (
  connection: ComponentConnection,
  sourcePosition?: { x: number, y: number },
  targetPosition?: { x: number, y: number },
  options?: EdgeOptions
) => {
  const edge = createEdge(
    connection.sourceId,
    connection.targetId,
    connection.type,
    {
      label: connection.description,
      data: {
        ...connection.configuration,
        dataFlowRate: connection.dataFlowRate
      },
      ...options
    }
  );
  
  // Add position information if available
  if (sourcePosition) {
    edge.sourceX = sourcePosition.x;
    edge.sourceY = sourcePosition.y;
  }
  
  if (targetPosition) {
    edge.targetX = targetPosition.x;
    edge.targetY = targetPosition.y;
  }
  
  return edge;
};

/**
 * Gets all edge types organized by category
 */
export const getEdgeTypesByCategory = (): Record<EdgeCategory, ConnectionType[]> => {
  const result = Object.values(EdgeCategory).reduce((acc, category) => {
    acc[category] = [];
    return acc;
  }, {} as Record<EdgeCategory, ConnectionType[]>);
  
  Object.entries(connectionCategoryMap).forEach(([type, category]) => {
    result[category].push(type as ConnectionType);
  });
  
  return result;
};

/**
 * Registers a custom edge factory for a specific connection type
 */
export const registerEdgeFactory = (
  connectionType: ConnectionType, 
  factory: EdgeFactory
): void => {
  edgeFactories[connectionType] = factory;
};

/**
 * Registers a completely custom edge type not defined in the ConnectionType enum
 */
export const registerCustomEdgeType = (
  type: string,
  component: React.ComponentType<any>,
  metadata: EdgeMetadata,
  factory?: EdgeFactory
): void => {
  customEdgeTypes[type] = {
    component,
    metadata,
    factory: factory || defaultEdgeFactory
  };
};

/**
 * Gets metadata for a specific edge type
 */
export const getEdgeMetadata = (connectionType: ConnectionType): EdgeMetadata => {
  if (!edgeMetadata[connectionType]) {
    throw new Error(`Edge metadata not found for connection type: ${connectionType}`);
  }
  return edgeMetadata[connectionType];
};

/**
 * Gets the category for a specific connection type
 */
export const getConnectionCategory = (connectionType: ConnectionType): EdgeCategory => {
  return connectionCategoryMap[connectionType] || EdgeCategory.CONNECTIVITY;
};

/**
 * Gets the appropriate component for rendering a specific edge type
 */
export const getEdgeComponent = (connectionType: ConnectionType): React.ComponentType<any> => {
  return connectionComponentMap[connectionType] || BaseEdge;
};

/**
 * Updates metadata for a specific edge type
 */
export const updateEdgeMetadata = (
  connectionType: ConnectionType, 
  metadata: Partial<EdgeMetadata>
): void => {
  if (!edgeMetadata[connectionType]) {
    throw new Error(`Edge metadata not found for connection type: ${connectionType}`);
  }
  
  edgeMetadata[connectionType] = {
    ...edgeMetadata[connectionType],
    ...metadata
  };
};

/**
 * React hook that returns memoized edge types mapping
 */
export const useEdgeTypes = (): EdgeTypes => {
  return useMemo(() => createEdgeTypes(), []);
};

/**
 * React hook that returns edges organized by category
 */
export const useEdgeTypesByCategory = (): Record<EdgeCategory, ConnectionType[]> => {
  return useMemo(() => getEdgeTypesByCategory(), []);
};

/**
 * Creates a specialized data flow edge with dataflow-specific properties
 */
export const createDataFlowEdge = (
  sourceId: string, 
  targetId: string, 
  options: EdgeOptions & {
    dataType?: 'structured' | 'unstructured' | 'semi-structured' | 'binary' | 'streaming' | 'batch';
    dataSize?: { amount: number; unit: string };
    throughput?: { amount: number; unit: string };
    frequencyType?: string;
    bidirectional?: boolean;
  } = {}
) => {
  return createEdge(sourceId, targetId, ConnectionType.DATA_FLOW, {
    ...options,
    data: {
      ...options.data,
      dataType: options.dataType,
      dataSize: options.dataSize,
      throughput: options.throughput,
      frequencyType: options.frequencyType,
      bidirectional: options.bidirectional
    }
  });
};

/**
 * Creates a specialized dependency edge with dependency-specific properties
 */
export const createDependencyEdge = (
  sourceId: string, 
  targetId: string, 
  options: EdgeOptions & {
    dependencyType?: 'hard' | 'soft' | 'optional' | 'runtime' | 'build-time' | 'infrastructure';
    criticality?: 'high' | 'medium' | 'low';
    deploymentOrder?: boolean;
    versionConstraint?: string;
    mutual?: boolean;
  } = {}
) => {
  return createEdge(sourceId, targetId, ConnectionType.DEPENDENCY, {
    ...options,
    data: {
      ...options.data,
      dependencyType: options.dependencyType || 'hard',
      criticality: options.criticality,
      deploymentOrder: options.deploymentOrder,
      versionConstraint: options.versionConstraint,
      mutual: options.mutual
    }
  });
};

// Export core registry objects
export {
  edgeMetadata,
  connectionCategoryMap,
  connectionComponentMap,
  edgeFactories,
  customEdgeTypes
};