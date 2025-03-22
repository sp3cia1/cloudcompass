import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  QuestionnaireState, 
  defaultQuestionnaireState,
  ApplicationCharacteristics,
  ScalingParameters,
  DataManagementRequirements,
  GeographicRequirements,
  SecurityRequirements,
  BudgetRequirements
} from '@/types';

// Define the complete store type with state and actions
interface QuestionnaireStore extends QuestionnaireState {
  // Navigation actions
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  
  // Section update actions - strongly typed
  updateApplication: <K extends keyof ApplicationCharacteristics>(
    field: K, 
    value: ApplicationCharacteristics[K]
  ) => void;
  
  updateScaling: <K extends keyof ScalingParameters>(
    field: K, 
    value: ScalingParameters[K]
  ) => void;
  
  updateData: <K extends keyof DataManagementRequirements>(
    field: K, 
    value: DataManagementRequirements[K]
  ) => void;
  
  updateGeographic: <K extends keyof GeographicRequirements>(
    field: K, 
    value: GeographicRequirements[K]
  ) => void;
  
  updateSecurity: <K extends keyof SecurityRequirements>(
    field: K, 
    value: SecurityRequirements[K]
  ) => void;
  
  updateBudget: <K extends keyof BudgetRequirements>(
    field: K, 
    value: BudgetRequirements[K]
  ) => void;
  
  // Reset functionality
  resetSection: (section: keyof Omit<QuestionnaireState, 'currentStep' | 'isComplete'>) => void;
  resetAll: () => void;
  
  // Completion action
  completeQuestionnaire: () => void;
}

// Create the store with persistence
export const useQuestionnaireStore = create<QuestionnaireStore>()(
  persist(
    (set) => ({
      // Include all initial state
      ...defaultQuestionnaireState,
      
      // Navigation actions
      nextStep: () => set((state) => ({ 
        currentStep: Math.min(state.currentStep + 1, 5) // Assuming 6 steps (0-5)
      })),
      
      prevStep: () => set((state) => ({ 
        currentStep: Math.max(state.currentStep - 1, 0) 
      })),
      
      goToStep: (step) => set({ currentStep: step }),
      
      // Section update actions with type safety
      updateApplication: (field, value) => set((state) => ({
        application: {
          ...state.application,
          [field]: value
        }
      })),
      
      updateScaling: (field, value) => set((state) => ({
        scaling: {
          ...state.scaling,
          [field]: value
        }
      })),
      
      updateData: (field, value) => set((state) => ({
        data: {
          ...state.data,
          [field]: value
        }
      })),
      
      updateGeographic: (field, value) => set((state) => ({
        geographic: {
          ...state.geographic,
          [field]: value
        }
      })),
      
      updateSecurity: (field, value) => set((state) => ({
        security: {
          ...state.security,
          [field]: value
        }
      })),
      
      updateBudget: (field, value) => set((state) => ({
        budget: {
          ...state.budget,
          [field]: value
        }
      })),
      
      // Reset functionality
      resetSection: (section) => set((state) => ({
        ...state,
        [section]: defaultQuestionnaireState[section]
      })),
      
      resetAll: () => set(defaultQuestionnaireState),
      
      // Completion
      completeQuestionnaire: () => set({ isComplete: true })
    }),
    {
      name: 'cloudcompass-questionnaire',
      // Only persist the actual data, not methods
      partialize: (state) => ({
        currentStep: state.currentStep,
        application: state.application,
        scaling: state.scaling,
        data: state.data,
        geographic: state.geographic,
        security: state.security,
        budget: state.budget,
        isComplete: state.isComplete
      })
    }
  )
);