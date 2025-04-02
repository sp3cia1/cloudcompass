import { create } from 'zustand';
import { persist, subscribeWithSelector } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { cloneDeep } from 'lodash-es';

import {
  ArchitectureComponent,
  ArchitectureRecommendation,
  CloudArchitecture,
  ComponentConnection,
  ComponentType,
  ComplexityPreference,
  Position,
  ProviderStrategy,
  Region,
  ConnectionType, // Added missing import 
} from '@/types/architecture';
import { CloudProvider } from './applicationState';
import { GeographicRegion, QuestionnaireState } from '@/types';

import { transformArchitecture } from '@/lib/architecture/serviceEquivalency';

// =========================================
// History and versioning interfaces
// =========================================

interface ArchitectureVersion {
  timestamp: Date;
  architecture: CloudArchitecture;
  description: string;
}

// =========================================
// Store state type
// =========================================

interface ArchitectureState {
  // Current active architecture
  currentArchitecture: CloudArchitecture | null;
  
  // For comparing providers and alternatives
  alternativeArchitectures: Record<string, CloudArchitecture>;
  
  // Generated recommendations from questionnaire
  recommendation: ArchitectureRecommendation | null;
  
  // Selected service for detailed view
  selectedComponentId: string | null;
  
  // Editing states
  isEditing: boolean;
  unsavedChanges: boolean;
  
  // Versioning and history
  versions: ArchitectureVersion[];
  currentVersionIndex: number;
  
  // UI state
  visualizationSettings: {
    zoomLevel: number;
    showCosts: boolean;
    showConnections: boolean;
    highlightedCategory: string | null;
    layout: 'diagram' | 'list' | '3d';
    groupByCategory: boolean;
  };
  
  // Export settings
  exportSettings: {
    includeExplanations: boolean;
    includeCostBreakdown: boolean;
    includeAlternatives: boolean;
    outputFormat: 'pdf' | 'svg' | 'png' | 'json';
  };
}

// =========================================
// Store actions type
// =========================================

interface ArchitectureActions {
  // Architecture generation
  setRecommendation: (recommendation: ArchitectureRecommendation) => void;
  generateFromQuestionnaire: (questionnaire: QuestionnaireState, 
                             complexityPreference: ComplexityPreference,
                             providerStrategy: ProviderStrategy,
                             primaryProvider?: CloudProvider) => Promise<void>;
  
  // Architecture management
  setCurrentArchitecture: (architecture: CloudArchitecture | null) => void;
  addAlternativeArchitecture: (architecture: CloudArchitecture) => void;
  removeAlternativeArchitecture: (id: string) => void;
  switchToAlternative: (id: string) => void;
  
  // Complex transformations
  changeComplexityLevel: (level: ComplexityPreference) => void;
  changeProvider: (provider: CloudProvider) => void;
  optimizeForCost: () => void;
  optimizeForPerformance: () => void;
  optimizeForReliability: () => void;
  
  // Component operations
  addComponent: (component: Partial<ArchitectureComponent>) => string;
  updateComponent: (id: string, updates: Partial<ArchitectureComponent>) => void;
  removeComponent: (id: string) => void;
  moveComponent: (id: string, position: Position) => void;
  resizeComponent: (id: string, width: number, height: number) => void;
  selectComponent: (id: string | null) => void;
  
  // Connection operations
  addConnection: (connection: Partial<ComponentConnection>) => string;
  updateConnection: (id: string, updates: Partial<ComponentConnection>) => void;
  removeConnection: (id: string) => void;
  
  // Region operations
  addRegion: (region: Partial<Region>) => string;
  updateRegion: (id: string, updates: Partial<Region>) => void;
  removeRegion: (id: string) => void;
  
  // History operations
  saveVersion: (description: string) => void;
  undoChange: () => void;
  redoChange: () => void;
  resetToVersion: (index: number) => void;
  
  // Export operations
  exportArchitecture: () => Promise<Blob>;
  setExportSettings: (settings: Partial<ArchitectureState['exportSettings']>) => void;
  
  // Visualization settings
  setVisualizationSettings: (settings: Partial<ArchitectureState['visualizationSettings']>) => void;
  
  // Reset operations
  resetState: () => void;
}

// Combined store type
type ArchitectureStore = ArchitectureState & ArchitectureActions;

// =========================================
// Default/initial values
// =========================================

const DEFAULT_VISUALIZATION_SETTINGS: ArchitectureState['visualizationSettings'] = {
  zoomLevel: 1,
  showCosts: true,
  showConnections: true,
  highlightedCategory: null,
  layout: 'diagram',
  groupByCategory: true
};

const DEFAULT_EXPORT_SETTINGS: ArchitectureState['exportSettings'] = {
  includeExplanations: true,
  includeCostBreakdown: true,
  includeAlternatives: false,
  outputFormat: 'pdf'
};

const initialState: ArchitectureState = {
  currentArchitecture: null,
  alternativeArchitectures: {},
  recommendation: null,
  selectedComponentId: null,
  isEditing: false,
  unsavedChanges: false,
  versions: [],
  currentVersionIndex: -1,
  visualizationSettings: DEFAULT_VISUALIZATION_SETTINGS,
  exportSettings: DEFAULT_EXPORT_SETTINGS
};

// =========================================
// Utility functions
// =========================================

/**
 * Creates a new architecture with default values
 */
const createEmptyArchitecture = (provider: CloudProvider = 'aws'): CloudArchitecture => ({
  id: uuidv4(),
  name: `Cloud Architecture - ${new Date().toLocaleString()}`,
  description: "Generated cloud architecture",
  provider: provider,
  components: [],
  connections: [],
  regions: [],
  estimatedCost: {
    monthlyCost: {
      amount: 0,
      currency: 'USD',
      confidence: 'medium'
    },
    breakdown: [],
    assumptions: []
  },
  complexityLevel: 'balanced',
  tags: [],
  generatedAt: new Date(),
  lastUpdated: new Date()
});

/**
 * Calculates the estimated position for a new component
 * based on existing components and component type
 */
const calculateNewComponentPosition = (
  components: ArchitectureComponent[],
  type: ComponentType
): Position => {
  // Group similar components together
  const categoryMap: Record<string, string> = {
    [ComponentType.VM]: 'compute',
    [ComponentType.CONTAINER]: 'compute',
    [ComponentType.FUNCTION]: 'compute',
    [ComponentType.KUBERNETES]: 'compute',
    
    [ComponentType.OBJECT_STORAGE]: 'storage',
    [ComponentType.FILE_STORAGE]: 'storage',
    [ComponentType.BLOCK_STORAGE]: 'storage',
    
    [ComponentType.RELATIONAL_DB]: 'database',
    [ComponentType.DOCUMENT_DB]: 'database',
    [ComponentType.KEY_VALUE_DB]: 'database',
    [ComponentType.GRAPH_DB]: 'database',
    [ComponentType.TIME_SERIES_DB]: 'database',
    [ComponentType.CACHE]: 'database',
    
    [ComponentType.LOAD_BALANCER]: 'network',
    [ComponentType.CDN]: 'network',
    [ComponentType.VPC]: 'network',
    [ComponentType.VPN]: 'network',
    [ComponentType.DNS]: 'network',
    [ComponentType.API_GATEWAY]: 'network',
    
    [ComponentType.FIREWALL]: 'security',
    [ComponentType.WAF]: 'security',
    [ComponentType.IAM]: 'security',
    
    [ComponentType.QUEUE]: 'integration',
    [ComponentType.EVENT_BUS]: 'integration',
    [ComponentType.STREAM]: 'integration',
    
    [ComponentType.MONITORING]: 'monitoring',
    [ComponentType.LOGGING]: 'monitoring',
    [ComponentType.ALERTING]: 'monitoring',
  };
  
  const category = categoryMap[type] || 'other';
  
  // Get components of the same category
  const sameCategory = components.filter(c => categoryMap[c.type] === category);
  
  if (sameCategory.length === 0) {
    // First component of this category - place according to category
    const categoryPositions: Record<string, Position> = {
      'compute': { x: 100, y: 100 },
      'storage': { x: 100, y: 300 },
      'database': { x: 300, y: 100 },
      'network': { x: 300, y: 300 },
      'security': { x: 500, y: 100 },
      'integration': { x: 500, y: 300 },
      'monitoring': { x: 700, y: 100 },
      'other': { x: 700, y: 300 }
    };
    
    return categoryPositions[category] || { x: 400, y: 200 };
  }
  
  // Group components together, with some spacing
  const lastComponent = sameCategory[sameCategory.length - 1];
  const position = lastComponent.position || { x: 100, y: 100 };
  
  return {
    x: position.x + 150,
    y: position.y
  };
};

// =========================================
// Create the store
// =========================================

export const useArchitectureStore = create<ArchitectureStore>()(
  subscribeWithSelector(
    persist(
      (set, get) => ({
        ...initialState,
        
        // Architecture generation
        setRecommendation: (recommendation) => set({
          recommendation,
          currentArchitecture: recommendation.primaryArchitecture,
          alternativeArchitectures: recommendation.alternativeArchitectures.reduce((acc, arch) => {
            acc[arch.id] = arch;
            return acc;
          }, {} as Record<string, CloudArchitecture>),
          versions: [
            {
              timestamp: new Date(),
              architecture: recommendation.primaryArchitecture,
              description: "Initial recommendation"
            }
          ],
          currentVersionIndex: 0,
          unsavedChanges: false,
          isEditing: false
        }),

        generateFromQuestionnaire: async (
          questionnaire: QuestionnaireState,
          complexityPreference: ComplexityPreference,
          providerStrategy: ProviderStrategy,
          primaryProvider?: CloudProvider
        ) => {
          try {
            // Import the actual architecture generator function
            const { createArchitecture } = require('@/lib/architecture/generator');
            
            // Generate the actual architecture using the pattern-based generator
            const architecture = await createArchitecture(
              questionnaire,
              primaryProvider || 'aws',
              complexityPreference,
              true // Use patterns by default
            );
            
            // Create a recommendation with the generated architecture
            const recommendation: ArchitectureRecommendation = {
              primaryArchitecture: architecture,
              alternativeArchitectures: [],
              explanations: architecture.explanations || {
                general: "This architecture is optimized for your requirements.",
                componentChoices: {},
                costConsiderations: "Cost optimizations have been applied where possible.",
                scalabilityConsiderations: "This architecture can scale to meet your expected load.",
                securityConsiderations: "Security best practices have been implemented."
              },
              userRequirements: {
                questionnaire,
                complexity: complexityPreference,
                providerStrategy,
                primaryProvider
              }
            };
            
            get().setRecommendation(recommendation);
          } catch (error) {
            console.error('Error generating architecture from questionnaire:', error);
            
            const mockArchitecture = createEmptyArchitecture(primaryProvider || 'aws');
            mockArchitecture.complexityLevel = complexityPreference;
            
            const mockRecommendation: ArchitectureRecommendation = {
              primaryArchitecture: mockArchitecture,
              alternativeArchitectures: [],
              explanations: {
                general: "This architecture is optimized for your requirements.",
                componentChoices: {},
                costConsiderations: "Cost optimizations have been applied where possible.",
                scalabilityConsiderations: "This architecture can scale to meet your expected load.",
                securityConsiderations: "Security best practices have been implemented."
              },
              userRequirements: {
                questionnaire,
                complexity: complexityPreference,
                providerStrategy,
                primaryProvider
              }
            };
            
            get().setRecommendation(mockRecommendation);
          }
        },
        
        
        // Architecture management
        setCurrentArchitecture: (architecture) => set({
          currentArchitecture: architecture,
          selectedComponentId: null,
          unsavedChanges: false
        }),
        
        addAlternativeArchitecture: (architecture) => set((state) => ({
          alternativeArchitectures: {
            ...state.alternativeArchitectures,
            [architecture.id]: architecture
          }
        })),
        
        removeAlternativeArchitecture: (id) => set((state) => {
          const newAlternatives = { ...state.alternativeArchitectures };
          delete newAlternatives[id];
          return { alternativeArchitectures: newAlternatives };
        }),
        
        switchToAlternative: (id) => {
          const { alternativeArchitectures, setCurrentArchitecture } = get();
          const architecture = alternativeArchitectures[id];
          if (architecture) {
            setCurrentArchitecture(architecture);
          }
        },
        
        // Complex transformations
        changeComplexityLevel: (level) => set((state) => {
          if (!state.currentArchitecture) return state;
          
          // This would be a complex operation that transforms all components
          // based on complexity level - simplifying to just update the level for now
          const updatedArchitecture = {
            ...state.currentArchitecture,
            complexityLevel: level,
            lastUpdated: new Date()
          };
          
          return {
            currentArchitecture: updatedArchitecture,
            unsavedChanges: true
          };
        }),
        
        changeProvider: (provider) => set((state) => {
          if (!state.currentArchitecture) return state;
          
          // Skip if already using this provider
          if (state.currentArchitecture.provider === provider) return state;
          
          try {
            // Use the service equivalency system to transform the architecture
            const transformedArchitecture = transformArchitecture(
              state.currentArchitecture,
              provider,
              'performance' // Default optimization context
            );
            
            return {
              currentArchitecture: transformedArchitecture,
              unsavedChanges: true
            };
          } catch (error) {
            console.error('Failed to transform architecture:', error);
            
            // Fallback to simple provider change if transformation fails
            return {
              currentArchitecture: {
                ...state.currentArchitecture,
                provider,
                lastUpdated: new Date()
              },
              unsavedChanges: true
            };
          }
        }),
        
        optimizeForCost: () => set((state) => {
          if (!state.currentArchitecture) return state;
          
          // This would apply cost optimization transformations to the architecture
          // Just a placeholder implementation for now
          const updatedArchitecture = {
            ...state.currentArchitecture,
            lastUpdated: new Date()
          };
          
          return {
            currentArchitecture: updatedArchitecture,
            unsavedChanges: true
          };
        }),
        
        optimizeForPerformance: () => set((state) => {
          if (!state.currentArchitecture) return state;
          
          // This would apply performance optimization transformations
          // Just a placeholder implementation for now
          const updatedArchitecture = {
            ...state.currentArchitecture,
            lastUpdated: new Date()
          };
          
          return {
            currentArchitecture: updatedArchitecture,
            unsavedChanges: true
          };
        }),
        
        optimizeForReliability: () => set((state) => {
          if (!state.currentArchitecture) return state;
          
          // This would apply reliability optimization transformations
          // Just a placeholder implementation for now
          const updatedArchitecture = {
            ...state.currentArchitecture,
            lastUpdated: new Date()
          };
          
          return {
            currentArchitecture: updatedArchitecture,
            unsavedChanges: true
          };
        }),
        
        // Component operations
        addComponent: (component) => {
          const { currentArchitecture } = get();
          if (!currentArchitecture) return "";
          
          const newComponent: ArchitectureComponent = {
            id: uuidv4(),
            name: component.name || `New ${component.type || 'Component'}`,
            type: component.type || ComponentType.VM,
            provider: component.provider || currentArchitecture.provider as CloudProvider,
            region: component.region || (currentArchitecture.regions[0]?.id || 'unknown'),
            tier: component.tier || 'standard',
            specs: component.specs || {
              type: 'compute',
              cpu: {
                cores: 2
              },
              memory: {
                amount: 4,
                unit: 'GB'
              }
            },
            configuration: component.configuration || {},
            estimatedCost: component.estimatedCost || {
              monthlyCost: {
                amount: 0,
                currency: 'USD',
                confidence: 'low'
              },
              breakdown: [],
              assumptions: []
            },
            tags: component.tags || [],
            description: component.description || "",
            position: component.position || 
              calculateNewComponentPosition(currentArchitecture.components, component.type || ComponentType.VM)
          };
          
          set((state) => ({
            currentArchitecture: {
              ...state.currentArchitecture!,
              components: [...state.currentArchitecture!.components, newComponent],
              lastUpdated: new Date()
            },
            unsavedChanges: true
          }));
          
          return newComponent.id;
        },
        
        updateComponent: (id, updates) => set((state) => {
          if (!state.currentArchitecture) return state;
          
          const index = state.currentArchitecture.components.findIndex(c => c.id === id);
          if (index === -1) return state;
          
          const updatedComponents = [...state.currentArchitecture.components];
          updatedComponents[index] = {
            ...updatedComponents[index],
            ...updates,
          };
          
          return {
            currentArchitecture: {
              ...state.currentArchitecture,
              components: updatedComponents,
              lastUpdated: new Date()
            },
            unsavedChanges: true
          };
        }),
        
        removeComponent: (id) => set((state) => {
          if (!state.currentArchitecture) return state;
          
          // Remove the component
          const updatedComponents = state.currentArchitecture.components.filter(c => c.id !== id);
          
          // Also remove any connections to/from this component
          const updatedConnections = state.currentArchitecture.connections.filter(
            conn => conn.sourceId !== id && conn.targetId !== id
          );
          
          return {
            currentArchitecture: {
              ...state.currentArchitecture,
              components: updatedComponents,
              connections: updatedConnections,
              lastUpdated: new Date()
            },
            selectedComponentId: state.selectedComponentId === id ? null : state.selectedComponentId,
            unsavedChanges: true
          };
        }),
        
        moveComponent: (id, position) => set((state) => {
          if (!state.currentArchitecture) return state;
          
          const index = state.currentArchitecture.components.findIndex(c => c.id === id);
          if (index === -1) return state;
          
          const updatedComponents = [...state.currentArchitecture.components];
          updatedComponents[index] = {
            ...updatedComponents[index],
            position: {
              ...updatedComponents[index].position,
              ...position
            }
          };
          
          return {
            currentArchitecture: {
              ...state.currentArchitecture,
              components: updatedComponents,
              lastUpdated: new Date()
            },
            unsavedChanges: true
          };
        }),
        
        resizeComponent: (id, width, height) => set((state) => {
          if (!state.currentArchitecture) return state;
          
          const index = state.currentArchitecture.components.findIndex(c => c.id === id);
          if (index === -1) return state;
          
          const updatedComponents = [...state.currentArchitecture.components];
          // Fixed type issue by ensuring x and y are always defined
          updatedComponents[index] = {
            ...updatedComponents[index],
            position: {
              x: updatedComponents[index].position?.x || 0,
              y: updatedComponents[index].position?.y || 0,
              width,
              height,
              // Preserve z value if it exists
              ...(updatedComponents[index].position?.z !== undefined 
                ? { z: updatedComponents[index].position.z } 
                : {})
            }
          };
          
          return {
            currentArchitecture: {
              ...state.currentArchitecture,
              components: updatedComponents,
              lastUpdated: new Date()
            },
            unsavedChanges: true
          };
        }),
        
        selectComponent: (id) => set({
          selectedComponentId: id
        }),
        
        // Connection operations
        addConnection: (connection) => {
          const { currentArchitecture } = get();
          if (!currentArchitecture) return "";
          
          const newConnection: ComponentConnection = {
            id: uuidv4(),
            sourceId: connection.sourceId || "",
            targetId: connection.targetId || "",
            type: connection.type || ConnectionType.NETWORK, // Fixed reference
            configuration: connection.configuration || {},
            dataFlowRate: connection.dataFlowRate,
            description: connection.description
          };
          
          set((state) => ({
            currentArchitecture: {
              ...state.currentArchitecture!,
              connections: [...state.currentArchitecture!.connections, newConnection],
              lastUpdated: new Date()
            },
            unsavedChanges: true
          }));
          
          return newConnection.id;
        },
        
        updateConnection: (id, updates) => set((state) => {
          if (!state.currentArchitecture) return state;
          
          const index = state.currentArchitecture.connections.findIndex(c => c.id === id);
          if (index === -1) return state;
          
          const updatedConnections = [...state.currentArchitecture.connections];
          updatedConnections[index] = {
            ...updatedConnections[index],
            ...updates
          };
          
          return {
            currentArchitecture: {
              ...state.currentArchitecture,
              connections: updatedConnections,
              lastUpdated: new Date()
            },
            unsavedChanges: true
          };
        }),
        
        removeConnection: (id) => set((state) => {
          if (!state.currentArchitecture) return state;
          
          const updatedConnections = state.currentArchitecture.connections.filter(c => c.id !== id);
          
          return {
            currentArchitecture: {
              ...state.currentArchitecture,
              connections: updatedConnections,
              lastUpdated: new Date()
            },
            unsavedChanges: true
          };
        }),
        
        // Region operations
        addRegion: (region) => {
          const { currentArchitecture } = get();
          if (!currentArchitecture) return "";
          
          const newRegion: Region = {
            id: uuidv4(),
            name: region.name || "New Region",
            provider: region.provider || (currentArchitecture.provider as CloudProvider),
            continent: region.continent || GeographicRegion.NORTH_AMERICA, // Fixed reference
            latitude: region.latitude || 0,
            longitude: region.longitude || 0,
            services: region.services || [],
            tier: region.tier
          };
          
          set((state) => ({
            currentArchitecture: {
              ...state.currentArchitecture!,
              regions: [...state.currentArchitecture!.regions, newRegion],
              lastUpdated: new Date()
            },
            unsavedChanges: true
          }));
          
          return newRegion.id;
        },
        
        updateRegion: (id, updates) => set((state) => {
          if (!state.currentArchitecture) return state;
          
          const index = state.currentArchitecture.regions.findIndex(r => r.id === id);
          if (index === -1) return state;
          
          const updatedRegions = [...state.currentArchitecture.regions];
          updatedRegions[index] = {
            ...updatedRegions[index],
            ...updates
          };
          
          return {
            currentArchitecture: {
              ...state.currentArchitecture,
              regions: updatedRegions,
              lastUpdated: new Date()
            },
            unsavedChanges: true
          };
        }),
        
        removeRegion: (id) => set((state) => {
          if (!state.currentArchitecture) return state;
          
          // Check if any components are using this region
          const componentsUsingRegion = state.currentArchitecture.components.some(c => c.region === id);
          if (componentsUsingRegion) {
            console.warn("Cannot remove region as it is being used by components");
            return state;
          }
          
          const updatedRegions = state.currentArchitecture.regions.filter(r => r.id !== id);
          
          return {
            currentArchitecture: {
              ...state.currentArchitecture,
              regions: updatedRegions,
              lastUpdated: new Date()
            },
            unsavedChanges: true
          };
        }),
        
        // History operations
        saveVersion: (description) => set((state) => {
          if (!state.currentArchitecture) return state;
          
          const newVersion: ArchitectureVersion = {
            timestamp: new Date(),
            architecture: cloneDeep(state.currentArchitecture),
            description
          };
          
          // If we have unsaved changes and we're not at the latest version,
          // we need to discard all versions after the current one
          const newVersions = state.unsavedChanges || state.currentVersionIndex < state.versions.length - 1
            ? [...state.versions.slice(0, state.currentVersionIndex + 1), newVersion]
            : [...state.versions, newVersion];
          
          return {
            versions: newVersions,
            currentVersionIndex: newVersions.length - 1,
            unsavedChanges: false
          };
        }),
        
        undoChange: () => set((state) => {
          if (state.currentVersionIndex <= 0) return state;
          
          const newIndex = state.currentVersionIndex - 1;
          const version = state.versions[newIndex];
          
          return {
            currentArchitecture: cloneDeep(version.architecture),
            currentVersionIndex: newIndex,
            unsavedChanges: false
          };
        }),
        
        redoChange: () => set((state) => {
          if (state.currentVersionIndex >= state.versions.length - 1) return state;
          
          const newIndex = state.currentVersionIndex + 1;
          const version = state.versions[newIndex];
          
          return {
            currentArchitecture: cloneDeep(version.architecture),
            currentVersionIndex: newIndex,
            unsavedChanges: false
          };
        }),
        
        resetToVersion: (index) => set((state) => {
          if (index < 0 || index >= state.versions.length) return state;
          
          const version = state.versions[index];
          
          return {
            currentArchitecture: cloneDeep(version.architecture),
            currentVersionIndex: index,
            unsavedChanges: false
          };
        }),
        
        // Export operations
        exportArchitecture: async () => {
          const { currentArchitecture, exportSettings } = get();
          
          if (!currentArchitecture) {
            throw new Error("No architecture to export");
          }
          
          // In a real implementation, this would connect to export services
          // For now, just return the JSON data as a blob
          
          const exportData = {
            architecture: currentArchitecture,
            generated: new Date(),
            settings: exportSettings
          };
          
          const jsonString = JSON.stringify(exportData, null, 2);
          const blob = new Blob([jsonString], { type: 'application/json' });
          return blob;
        },
        
        setExportSettings: (settings) => set((state) => ({
          exportSettings: {
            ...state.exportSettings,
            ...settings
          }
        })),
        
        // Visualization settings
        setVisualizationSettings: (settings) => set((state) => ({
          visualizationSettings: {
            ...state.visualizationSettings,
            ...settings
          }
        })),
        
        // Reset operations
        resetState: () => set(initialState)
      }),
      {
        name: 'cloudcompass-architecture',
        // Only persist the necessary state, not function references
        partialize: (state) => ({
          currentArchitecture: state.currentArchitecture,
          alternativeArchitectures: state.alternativeArchitectures,
          recommendation: state.recommendation,
          versions: state.versions,
          currentVersionIndex: state.currentVersionIndex,
          visualizationSettings: state.visualizationSettings,
          exportSettings: state.exportSettings
        }),
        // Version migrations if needed
        version: 1
      }
    )
  )
);

// =========================================
// Selectors for common derived data
// =========================================

/**
 * Creates a selector for an architecture store instance
 */
export const createArchitectureSelector = <T>(selector: (state: ArchitectureStore) => T) => selector;

export const selectCurrentArchitecture = createArchitectureSelector(
  (state) => state.currentArchitecture
);

export const selectSelectedComponent = createArchitectureSelector(
  (state) => state.selectedComponentId && state.currentArchitecture
    ? state.currentArchitecture.components.find(c => c.id === state.selectedComponentId) || null
    : null
);

export const selectComponentsByType = createArchitectureSelector(
  (state) => {
    if (!state.currentArchitecture) return {};
    
    const componentsByType: Record<ComponentType, ArchitectureComponent[]> = {} as any;
    
    state.currentArchitecture.components.forEach(component => {
      if (!componentsByType[component.type]) {
        componentsByType[component.type] = [];
      }
      componentsByType[component.type].push(component);
    });
    
    return componentsByType;
  }
);

export const selectComponentsByCategory = createArchitectureSelector(
  (state) => {
    if (!state.currentArchitecture) return {};
    
    // Group components by general category
    const componentsByCategory: Record<string, ArchitectureComponent[]> = {
      compute: [],
      storage: [],
      database: [],
      networking: [],
      security: [],
      integration: [],
      monitoring: [],
      other: []
    };
    
    state.currentArchitecture.components.forEach(component => {
      const categoryMap: Record<string, string> = {
        [ComponentType.VM]: 'compute',
        [ComponentType.CONTAINER]: 'compute',
        [ComponentType.FUNCTION]: 'compute',
        [ComponentType.KUBERNETES]: 'compute',
        
        [ComponentType.OBJECT_STORAGE]: 'storage',
        [ComponentType.FILE_STORAGE]: 'storage',
        [ComponentType.BLOCK_STORAGE]: 'storage',
        
        [ComponentType.RELATIONAL_DB]: 'database',
        [ComponentType.DOCUMENT_DB]: 'database',
        [ComponentType.KEY_VALUE_DB]: 'database',
        [ComponentType.GRAPH_DB]: 'database',
        [ComponentType.TIME_SERIES_DB]: 'database',
        [ComponentType.CACHE]: 'database',
        
        [ComponentType.LOAD_BALANCER]: 'networking',
        [ComponentType.CDN]: 'networking',
        [ComponentType.VPC]: 'networking',
        [ComponentType.VPN]: 'networking',
        [ComponentType.DNS]: 'networking',
        [ComponentType.API_GATEWAY]: 'networking',
        
        [ComponentType.FIREWALL]: 'security',
        [ComponentType.WAF]: 'security',
        [ComponentType.IAM]: 'security',
        
        [ComponentType.QUEUE]: 'integration',
        [ComponentType.EVENT_BUS]: 'integration',
        [ComponentType.STREAM]: 'integration',
        
        [ComponentType.MONITORING]: 'monitoring',
        [ComponentType.LOGGING]: 'monitoring',
        [ComponentType.ALERTING]: 'monitoring',
      };
      
      const category = categoryMap[component.type] || 'other';
      componentsByCategory[category].push(component);
    });
    
    return componentsByCategory;
  }
);

export const selectTotalCost = createArchitectureSelector(
  (state) => state.currentArchitecture?.estimatedCost.monthlyCost.amount || 0
);

export const selectCostByCategory = createArchitectureSelector(
  (state) => {
    if (!state.currentArchitecture) return {};
    
    const costByCategory: Record<string, number> = {
      compute: 0,
      storage: 0,
      database: 0,
      networking: 0,
      security: 0,
      integration: 0,
      monitoring: 0,
      other: 0
    };
    
    const componentsByCategory = selectComponentsByCategory(state);
    
    Object.entries(componentsByCategory).forEach(([category, components]) => {
      costByCategory[category] = components.reduce(
        (total, component) => total + component.estimatedCost.monthlyCost.amount, 
        0
      );
    });
    
    return costByCategory;
  }
);

export const selectComponentConnections = (componentId: string) => createArchitectureSelector(
  (state) => {
    if (!state.currentArchitecture) return { incoming: [], outgoing: [] };
    
    const incoming = state.currentArchitecture.connections.filter(conn => conn.targetId === componentId);
    const outgoing = state.currentArchitecture.connections.filter(conn => conn.sourceId === componentId);
    
    return { incoming, outgoing };
  }
);

// Export ConnectionType enum for easy access
export { ConnectionType };