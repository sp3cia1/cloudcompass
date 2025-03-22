'use client';

import { useState, useEffect } from 'react';
import { useQuestionnaireStore } from '@/lib/store/questionnaire';
import QuestionnaireContainer from '@/components/questionnaire/QuestionnaireContainer';

export default function QuestionnairePage() {
  // Development tools state - only active in development
  const [showDevTools, setShowDevTools] = useState(false);
  
  // Connect to questionnaire state store
  const questionnaireState = useQuestionnaireStore();
  
  // Setup keyboard shortcut (Ctrl+D) for toggling dev tools
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.ctrlKey && e.key === 'd') {
          e.preventDefault();
          setShowDevTools(prev => !prev);
        }
      };
      
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, []);
  
  return (
    <>
      {/* Placeholder for QuestionnaireContainer */}
      <div className="border rounded-lg p-6 shadow-sm">
        <p className="text-center text-muted-foreground">
          <QuestionnaireContainer/>
          <span className="text-sm">
            (Current step: {questionnaireState.currentStep})
          </span>
        </p>
      </div>
      
      {/* Development Tools - Only rendered in development environment */}
      {process.env.NODE_ENV === 'development' && showDevTools && (
        <div className="fixed bottom-0 right-0 w-1/3 h-2/3 bg-background border shadow-lg p-4 overflow-auto z-50">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Development Tools</h2>
            <button 
              onClick={() => setShowDevTools(false)}
              className="text-sm px-2 py-1 rounded bg-destructive text-destructive-foreground"
            >
              Close
            </button>
          </div>
          
          {/* State Inspector */}
          <div>
            <h3 className="text-md font-medium mb-2">Questionnaire State:</h3>
            <pre className="bg-muted p-2 rounded text-xs overflow-auto max-h-40">
              {JSON.stringify(questionnaireState, null, 2)}
            </pre>
          </div>
          
          {/* Controls for testing */}
          <div className="mt-4">
            <h3 className="text-md font-medium mb-2">Step Navigation:</h3>
            <div className="flex space-x-2">
              <button 
                onClick={() => questionnaireState.prevStep()}
                className="text-sm px-3 py-1 rounded bg-primary text-primary-foreground"
              >
                Previous
              </button>
              <button 
                onClick={() => questionnaireState.nextStep()}
                className="text-sm px-3 py-1 rounded bg-primary text-primary-foreground"
              >
                Next
              </button>
              <button 
                onClick={() => questionnaireState.resetAll()}
                className="text-sm px-3 py-1 rounded bg-destructive text-destructive-foreground ml-auto"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Development Tools Toggle Button */}
      {process.env.NODE_ENV === 'development' && (
        <button 
          onClick={() => setShowDevTools(prev => !prev)}
          className={`fixed bottom-4 right-4 w-10 h-10 rounded-full flex items-center justify-center shadow-md ${
            showDevTools ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
          }`}
          title="Toggle Dev Tools (Ctrl+D)"
        >
          <span className="text-sm font-mono">DEV</span>
        </button>
      )}
    </>
  );
}