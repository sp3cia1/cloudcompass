import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  QuestionnaireState, 
  defaultQuestionnaireState 
} from '@/types';

// Entry point types
export type EntrySource = 'questionnaire' | 'repository' | 'idea' | null;

// Cloud provider types
export type CloudProvider = 'aws' | 'azure' | 'gcp' | 'firebase' | 'digitalocean' ;

// Solution generation parameters
export interface SolutionParameters {
  complexityPreference: 'simple' | 'balanced' | 'advanced';
  providerStrategy: 'single' | 'best-of-breed';
  primaryProvider: CloudProvider | null;
  includeProviders: CloudProvider[];
}

// Application state interface
export interface ApplicationState {
  // Source tracking
  entrySource: EntrySource;
  entrySourceData: {
    repositoryUrl?: string;
    ideaPrompt?: string;
  };
  
  // Solution generation flow states
  reviewComplete: boolean;
  solutionParameters: SolutionParameters;
  
  // Processing states
  isAnalyzing: boolean;
  isGeneratingSolution: boolean;
  
  // Result states
  hasResults: boolean;
  resultsGenerated: Date | null;
  
  // Actions for entry sources
  setEntrySource: (source: EntrySource) => void;
  setRepositoryUrl: (url: string) => void;
  setIdeaPrompt: (prompt: string) => void;
  
  // Actions for solution generation
  setSolutionParameters: (params: Partial<SolutionParameters>) => void;
  completeReview: () => void;
  
  // Processing actions
  startAnalysis: () => void;
  finishAnalysis: () => void;
  startSolutionGeneration: () => void;
  finishSolutionGeneration: () => void;
  
  // Reset actions
  resetResults: () => void;
  resetState: () => void;
}

// Default solution parameters
const defaultSolutionParameters: SolutionParameters = {
  complexityPreference: 'balanced',
  providerStrategy: 'single',
  primaryProvider: null,
  includeProviders: ['aws', 'azure', 'gcp', 'firebase', 'digitalocean'],
};

// Create the store with persistence
export const useApplicationStore = create<ApplicationState>()(
  persist(
    (set, get) => ({
      // Initial state
      entrySource: null,
      entrySourceData: {},
      reviewComplete: false,
      solutionParameters: defaultSolutionParameters,
      isAnalyzing: false,
      isGeneratingSolution: false,
      hasResults: false,
      resultsGenerated: null,
      
      // Source tracking actions
      setEntrySource: (source) => set({ 
        entrySource: source,
        // Reset related states when changing source
        reviewComplete: false,
        hasResults: false
      }),
      
      setRepositoryUrl: (url) => set({ 
        entrySourceData: { ...get().entrySourceData, repositoryUrl: url } 
      }),
      
      setIdeaPrompt: (prompt) => set({ 
        entrySourceData: { ...get().entrySourceData, ideaPrompt: prompt } 
      }),
      
      // Solution generation actions
      setSolutionParameters: (params) => set({ 
        solutionParameters: { ...get().solutionParameters, ...params } 
      }),
      
      completeReview: () => set({ reviewComplete: true }),
      
      // Processing state actions
      startAnalysis: () => set({ isAnalyzing: true }),
      finishAnalysis: () => set({ isAnalyzing: false }),
      
      startSolutionGeneration: () => set({ isGeneratingSolution: true }),
      finishSolutionGeneration: () => set({ 
        isGeneratingSolution: false,
        hasResults: true,
        resultsGenerated: new Date()
      }),
      
      // Reset actions
      resetResults: () => set({ 
        hasResults: false,
        resultsGenerated: null,
        reviewComplete: false,
        solutionParameters: defaultSolutionParameters
      }),
      
      resetState: () => set({
        entrySource: null,
        entrySourceData: {},
        reviewComplete: false,
        solutionParameters: defaultSolutionParameters,
        isAnalyzing: false,
        isGeneratingSolution: false,
        hasResults: false,
        resultsGenerated: null
      })
    }),
    {
      name: 'cloudcompass-application',
      // Only persist the necessary state
      partialize: (state) => ({
        entrySource: state.entrySource,
        entrySourceData: state.entrySourceData,
        reviewComplete: state.reviewComplete,
        solutionParameters: state.solutionParameters,
        hasResults: state.hasResults,
        resultsGenerated: state.resultsGenerated
      })
    }
  )
);