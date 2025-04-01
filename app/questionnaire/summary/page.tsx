"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useQuestionnaireStore } from "@/lib/store/questionnaire";
import { useApplicationStore } from "@/lib/store/applicationState";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronsRight, LayoutGrid, Sparkles } from "lucide-react";
import SummaryReviewPanel from "@/components/questionnaire/summary/SummaryReviewPanel";
import { ComplexityLevel } from "@/types";

export default function QuestionnaireSummaryPage() {
  const router = useRouter();
  const questionnaireState = useQuestionnaireStore();
  const { application } = questionnaireState;
  
  const { 
    setEntrySource, 
    completeReview, 
    setSolutionParameters,
    startSolutionGeneration,
    finishSolutionGeneration 
  } = useApplicationStore();
  
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Ensure the entry source is set
  useEffect(() => {
    setEntrySource('questionnaire');
  }, [setEntrySource]);
  
  // Handle navigation to specific questionnaire step
  const handleEditSection = (stepIndex: number) => {
    router.push(`/questionnaire?step=${stepIndex}`);
  };
  
  // Handle result generation
  const handleGenerateResults = async () => {
    setIsGenerating(true);
    completeReview();
    startSolutionGeneration();
    
    // Default solution parameters based on questionnaire responses
    setSolutionParameters({
      complexityPreference: application.complexityLevel === ComplexityLevel.SIMPLE ? 'simple' : 
                           application.complexityLevel === ComplexityLevel.ENTERPRISE ? 'advanced' : 'balanced',
      providerStrategy: 'single',
      primaryProvider: null
    });
    
    // Simulate processing time for the demo
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    finishSolutionGeneration();
    router.push('/results');
  };

  return (
    <div className="relative min-h-screen py-12 px-4">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] -translate-y-1/4 translate-x-1/4 rounded-full bg-gradient-to-br from-blue-500/5 to-purple-500/5 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] translate-y-1/4 -translate-x-1/4 rounded-full bg-gradient-to-tr from-amber-500/5 to-red-500/5 blur-3xl" />
        <div className="absolute inset-0 bg-grid-white/[0.02] [mask-image:linear-gradient(0deg,transparent,#fff)]" />
      </div>
      
      <motion.div 
        className="container max-w-6xl mx-auto relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <header className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-2 mb-4 bg-gradient-to-br from-primary/20 to-violet-500/20 rounded-xl backdrop-blur-sm border border-primary/20">
            <LayoutGrid className="w-6 h-6 text-primary" />
          </div>
          <motion.h1 
            className="text-4xl md:text-5xl font-bold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            Your Cloud Blueprint
          </motion.h1>
          <motion.p 
            className="text-xl text-muted-foreground max-w-2xl mx-auto mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Review your requirements before we generate your architecture
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <Badge variant="outline" className="text-xs">
              6/6 sections completed
            </Badge>
          </motion.div>
        </header>
        
        {/* Summary Component */}
        <SummaryReviewPanel 
          questionnaireState={questionnaireState}
          onEditSection={handleEditSection}
        />
        
        {/* Generate Button */}
        <motion.div 
          className="flex flex-col items-center justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <div className="relative mb-6">
            <motion.div
              className="absolute -top-2 -right-2 text-amber-500"
              initial={{ rotate: -20, scale: 0.8 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ delay: 0.7, duration: 0.3 }}
            >
              <Sparkles size={20} />
            </motion.div>
            <Button
              size="lg"
              className="px-8 py-6 text-lg gap-2 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700"
              onClick={handleGenerateResults}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="mr-2"
                  >
                    <LayoutGrid className="h-5 w-5" />
                  </motion.div>
                  Generating Architecture...
                </>
              ) : (
                <>
                  Generate Cloud Architecture
                  <ChevronsRight className="h-5 w-5" />
                </>
              )}
            </Button>
          </div>
          <p className="text-sm text-muted-foreground max-w-sm text-center">
            We'll use your requirements to design an optimal cloud architecture across multiple providers
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}