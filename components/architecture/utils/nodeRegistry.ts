import React, { useMemo } from 'react';
import { NodeProps, NodeTypes } from 'reactflow';
import { CloudProvider } from '@/lib/store/applicationState';
import { ComponentType, ArchitectureComponent, Position } from '@/types/architecture';
import BaseNode, { BaseNodeProps } from '../nodes/BaseNode';

// These imports need to be fixed to ensure they extend BaseNodeProps
import ComputeNode from '../nodes/ComputeNode';
import DatabaseNode from '../nodes/DatabaseNode';
import NetworkingNode from '../nodes/NetworkingNode';
import SecurityNode from '../nodes/SecurityNode';
import StorageNode from '../nodes/StorageNode';

/**
 * Node categories for organizational and visualization purposes
 */
export enum NodeCategory {
  COMPUTE = 'compute',
  STORAGE = 'storage',
  DATABASE = 'database',
  NETWORKING = 'networking',
  SECURITY = 'security',
  INTEGRATION = 'integration',
  MONITORING = 'monitoring',
  ML_AI = 'ml-ai',
  OTHER = 'other'
}

/**
 * Maps component types to their respective categories
 */
const componentCategoryMap: Record<ComponentType, NodeCategory> = {
  // Compute nodes
  [ComponentType.VM]: NodeCategory.COMPUTE,
  [ComponentType.CONTAINER]: NodeCategory.COMPUTE,
  [ComponentType.FUNCTION]: NodeCategory.COMPUTE,
  [ComponentType.KUBERNETES]: NodeCategory.COMPUTE,
  
  // Storage nodes
  [ComponentType.OBJECT_STORAGE]: NodeCategory.STORAGE,
  [ComponentType.FILE_STORAGE]: NodeCategory.STORAGE,
  [ComponentType.BLOCK_STORAGE]: NodeCategory.STORAGE,
  
  // Database nodes
  [ComponentType.RELATIONAL_DB]: NodeCategory.DATABASE,
  [ComponentType.DOCUMENT_DB]: NodeCategory.DATABASE,
  [ComponentType.KEY_VALUE_DB]: NodeCategory.DATABASE,
  [ComponentType.GRAPH_DB]: NodeCategory.DATABASE,
  [ComponentType.TIME_SERIES_DB]: NodeCategory.DATABASE,
  [ComponentType.CACHE]: NodeCategory.DATABASE,
  
  // Networking nodes
  [ComponentType.LOAD_BALANCER]: NodeCategory.NETWORKING,
  [ComponentType.CDN]: NodeCategory.NETWORKING,
  [ComponentType.VPC]: NodeCategory.NETWORKING,
  [ComponentType.VPN]: NodeCategory.NETWORKING,
  [ComponentType.DNS]: NodeCategory.NETWORKING,
  [ComponentType.API_GATEWAY]: NodeCategory.NETWORKING,
  
  // Security nodes
  [ComponentType.FIREWALL]: NodeCategory.SECURITY,
  [ComponentType.WAF]: NodeCategory.SECURITY,
  [ComponentType.IAM]: NodeCategory.SECURITY,
  
  // Integration nodes
  [ComponentType.QUEUE]: NodeCategory.INTEGRATION,
  [ComponentType.EVENT_BUS]: NodeCategory.INTEGRATION,
  [ComponentType.STREAM]: NodeCategory.INTEGRATION,
  
  // Monitoring nodes
  [ComponentType.MONITORING]: NodeCategory.MONITORING,
  [ComponentType.LOGGING]: NodeCategory.MONITORING,
  [ComponentType.ALERTING]: NodeCategory.MONITORING,
  
  // ML/AI nodes
  [ComponentType.ML_INFERENCE]: NodeCategory.ML_AI,
  [ComponentType.ML_TRAINING]: NodeCategory.ML_AI,
  
  // Other nodes
  [ComponentType.SEARCH]: NodeCategory.OTHER,
  [ComponentType.EMAIL]: NodeCategory.OTHER,
  [ComponentType.NOTIFICATION]: NodeCategory.OTHER,
  [ComponentType.AUTH]: NodeCategory.OTHER,
};

/**
 * Maps each category to its specialized component renderer
 * Fixed by using React.ComponentType<any> and proper type assertion
 */
const categoryComponentMap: Record<NodeCategory, React.ComponentType<any>> = {
  [NodeCategory.COMPUTE]: ComputeNode as React.ComponentType<any>,
  [NodeCategory.STORAGE]: StorageNode as React.ComponentType<any>,
  [NodeCategory.DATABASE]: DatabaseNode as React.ComponentType<any>,
  [NodeCategory.NETWORKING]: NetworkingNode as React.ComponentType<any>,
  [NodeCategory.SECURITY]: SecurityNode as React.ComponentType<any>,
  [NodeCategory.INTEGRATION]: BaseNode as React.ComponentType<any>,
  [NodeCategory.MONITORING]: BaseNode as React.ComponentType<any>,
  [NodeCategory.ML_AI]: BaseNode as React.ComponentType<any>,
  [NodeCategory.OTHER]: BaseNode as React.ComponentType<any>,
};

/**
 * Comprehensive metadata interface for nodes
 */
export interface NodeMetadata {
  displayName: string;
  description: string;
  icon: string;
  category: NodeCategory;
  defaultWidth: number;
  defaultHeight: number;
  providerSpecific: boolean;
  supportedProviders: CloudProvider[];
  tags: string[];
  capabilities?: string[];
  limitations?: string[];
}

/**
 * Node creation options
 */
export interface NodeOptions {
  position?: Position;
  selected?: boolean;
  draggable?: boolean;
  selectable?: boolean;
  connectable?: boolean;
  data?: Record<string, any>;
  style?: React.CSSProperties;
}

/**
 * Node factory function type
 */
export type NodeFactory = (component: ArchitectureComponent, options?: NodeOptions) => any;

/**
 * Registry for custom node factories
 */
const nodeFactories = {} as Record<ComponentType, NodeFactory>;

/**
 * Custom node types registry (beyond the enum)
 */
const customNodeTypes: Record<string, {
  component: React.ComponentType<any>;
  metadata: NodeMetadata;
  factory?: NodeFactory;
}> = {};

/**
 * Maps component types to their respective icon identifiers
 */
const componentIconMap: Record<ComponentType, string> = {
  [ComponentType.VM]: 'server',
  [ComponentType.CONTAINER]: 'package',
  [ComponentType.FUNCTION]: 'zap',
  [ComponentType.KUBERNETES]: 'layers',
  [ComponentType.OBJECT_STORAGE]: 'database',
  [ComponentType.FILE_STORAGE]: 'file',
  [ComponentType.BLOCK_STORAGE]: 'hard-drive',
  [ComponentType.RELATIONAL_DB]: 'database',
  [ComponentType.DOCUMENT_DB]: 'file-text',
  [ComponentType.KEY_VALUE_DB]: 'key',
  [ComponentType.GRAPH_DB]: 'git-branch',
  [ComponentType.TIME_SERIES_DB]: 'trending-up',
  [ComponentType.CACHE]: 'zap',
  [ComponentType.LOAD_BALANCER]: 'shuffle',
  [ComponentType.CDN]: 'globe',
  [ComponentType.VPC]: 'layout',
  [ComponentType.VPN]: 'lock',
  [ComponentType.DNS]: 'at-sign',
  [ComponentType.API_GATEWAY]: 'server',
  [ComponentType.FIREWALL]: 'shield',
  [ComponentType.WAF]: 'shield',
  [ComponentType.IAM]: 'users',
  [ComponentType.QUEUE]: 'list',
  [ComponentType.EVENT_BUS]: 'activity',
  [ComponentType.STREAM]: 'radio',
  [ComponentType.MONITORING]: 'activity',
  [ComponentType.LOGGING]: 'file-text',
  [ComponentType.ALERTING]: 'bell',
  [ComponentType.ML_INFERENCE]: 'cpu',
  [ComponentType.ML_TRAINING]: 'layers',
  [ComponentType.SEARCH]: 'search',
  [ComponentType.EMAIL]: 'mail',
  [ComponentType.NOTIFICATION]: 'bell',
  [ComponentType.AUTH]: 'user-check',
};

/**
 * Comprehensive metadata for all built-in node types
 * Fixed using explicit type construction to ensure all enum values are covered
 */
const nodeMetadata: Record<ComponentType, NodeMetadata> = (() => {
  const result = {} as Record<ComponentType, NodeMetadata>;
  
  Object.values(ComponentType).forEach(type => {
    result[type] = {
      displayName: type.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' '),
      description: `A ${type.replace(/-/g, ' ')} component`,
      icon: componentIconMap[type] || 'help-circle',
      category: componentCategoryMap[type] || NodeCategory.OTHER,
      defaultWidth: 220,
      defaultHeight: 100,
      providerSpecific: false,
      supportedProviders: ['aws', 'azure', 'gcp', 'firebase', 'digitalocean'],
      tags: [componentCategoryMap[type] || NodeCategory.OTHER],
      capabilities: [],
      limitations: []
    };
  });
  
  return result;
})();

/**
 * Default node factory implementation
 */
const defaultNodeFactory: NodeFactory = (component, options = {}) => {
  return {
    id: component.id,
    type: component.type,
    position: options.position || component.position || { x: 0, y: 0 },
    data: { 
      component,
      ...options.data
    },
    draggable: options.draggable ?? true,
    selectable: options.selectable ?? true,
    connectable: options.connectable ?? true,
    style: options.style,
  };
};

// Initialize all node factories with the default implementation
Object.values(ComponentType).forEach(type => {
  nodeFactories[type] = defaultNodeFactory;
});

/**
 * Creates a complete mapping of node types for use with ReactFlow
 */
export const createNodeTypes = (): NodeTypes => {
  const nodeTypes: NodeTypes = {};
  
  // Add built-in node types - fixed by using type assertion
  Object.values(ComponentType).forEach(type => {
    const category = componentCategoryMap[type];
    nodeTypes[type] = categoryComponentMap[category] as React.ComponentType<NodeProps>;
  });
  
  // Add custom node types - fixed by using type assertion
  Object.entries(customNodeTypes).forEach(([type, { component }]) => {
    nodeTypes[type] = component as React.ComponentType<NodeProps>;
  });
  
  return nodeTypes;
};

/**
 * Gets all node types organized by category
 * Fixed by using explicit construction of the return object
 */
export const getNodeTypesByCategory = (): Record<NodeCategory, ComponentType[]> => {
  const result = Object.values(NodeCategory).reduce((acc, category) => {
    acc[category] = [];
    return acc;
  }, {} as Record<NodeCategory, ComponentType[]>);
  
  Object.entries(componentCategoryMap).forEach(([type, category]) => {
    result[category].push(type as ComponentType);
  });
  
  return result;
};

/**
 * Gets all node types supported by a specific cloud provider
 */
export const getNodeTypesByProvider = (provider: CloudProvider): ComponentType[] => {
  return Object.values(ComponentType).filter(type => 
    !nodeMetadata[type].providerSpecific || 
    (nodeMetadata[type].supportedProviders?.includes(provider))
  );
};

/**
 * Creates a node instance using the appropriate factory
 */
export const createNode = (component: ArchitectureComponent, options?: NodeOptions) => {
  const factory = nodeFactories[component.type] || defaultNodeFactory;
  return factory(component, options);
};

/**
 * Registers a custom node factory for a specific component type
 */
export const registerNodeFactory = (
  componentType: ComponentType, 
  factory: NodeFactory
): void => {
  nodeFactories[componentType] = factory;
};

/**
 * Registers a completely custom node type not defined in the ComponentType enum
 */
export const registerCustomNodeType = (
  type: string,
  component: React.ComponentType<any>,
  metadata: NodeMetadata,
  factory?: NodeFactory
): void => {
  customNodeTypes[type] = {
    component,
    metadata,
    factory: factory || defaultNodeFactory
  };
};

/**
 * Gets metadata for a specific node type
 */
export const getNodeMetadata = (componentType: ComponentType): NodeMetadata => {
  if (!nodeMetadata[componentType]) {
    throw new Error(`Node metadata not found for component type: ${componentType}`);
  }
  return nodeMetadata[componentType];
};

/**
 * Gets the category for a specific component type
 */
export const getComponentCategory = (componentType: ComponentType): NodeCategory => {
  return componentCategoryMap[componentType] || NodeCategory.OTHER;
};

/**
 * Gets the appropriate component for rendering a specific node type
 */
export const getNodeComponent = (componentType: ComponentType): React.ComponentType<any> => {
  const category = getComponentCategory(componentType);
  return categoryComponentMap[category] || BaseNode;
};

/**
 * Registers a specialized component renderer for a category
 */
export const registerCategoryComponent = (
  category: NodeCategory, 
  component: React.ComponentType<any>
): void => {
  categoryComponentMap[category] = component;
};

/**
 * Updates metadata for a specific node type
 */
export const updateNodeMetadata = (
  componentType: ComponentType, 
  metadata: Partial<NodeMetadata>
): void => {
  if (!nodeMetadata[componentType]) {
    throw new Error(`Node metadata not found for component type: ${componentType}`);
  }
  
  nodeMetadata[componentType] = {
    ...nodeMetadata[componentType],
    ...metadata
  };
};

/**
 * Checks if a component type is registered
 */
export const isNodeTypeRegistered = (componentType: ComponentType): boolean => {
  return componentType in componentCategoryMap;
};

/**
 * React hook that returns memoized node types mapping
 */
export const useNodeTypes = (): NodeTypes => {
  return useMemo(() => createNodeTypes(), []);
};

/**
 * React hook that returns nodes filtered by provider
 */
export const useNodeTypesByProvider = (provider: CloudProvider): ComponentType[] => {
  return useMemo(() => getNodeTypesByProvider(provider), [provider]);
};

/**
 * React hook that returns nodes organized by category
 */
export const useNodeTypesByCategory = (): Record<NodeCategory, ComponentType[]> => {
  return useMemo(() => getNodeTypesByCategory(), []);
};

// Export core registry objects
export {
  nodeMetadata,
  componentCategoryMap,
  categoryComponentMap,
  componentIconMap,
  nodeFactories,
  customNodeTypes
};