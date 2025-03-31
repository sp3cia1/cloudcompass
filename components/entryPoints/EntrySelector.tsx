"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useApplicationStore } from "@/lib/store/applicationState";
import { QuestionnaireIcon, RepositoryIcon, IdeaIcon, CirclePattern, GridPattern } from "./icons/EntryIcons";

export default function EntrySelector() {
  const router = useRouter();
  const { setEntrySource } = useApplicationStore();
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // Entry options with rich metadata
  const entryOptions = [
    {
      id: "questionnaire",
      title: "Guided Questionnaire",
      description: "Answer questions about your application needs step-by-step for a tailored cloud architecture recommendation.",
      icon: <QuestionnaireIcon className="h-10 w-10" />,
      timeEstimate: "5-10 minutes",
      idealFor: "Non-technical users planning cloud adoption",
      path: "/questionnaire",
      color: "from-blue-500/20 via-blue-400/20 to-indigo-500/20 border-blue-500/30 dark:from-blue-700/30 dark:via-blue-600/20 dark:to-indigo-700/30",
      hoverEffect: "from-blue-500/30 via-blue-400/30 to-indigo-500/30 border-blue-500/40 dark:from-blue-700/40 dark:via-blue-600/30 dark:to-indigo-700/40",
      textGradient: "from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400"
    },
    {
      id: "repository",
      title: "Analyze Repository",
      description: "Connect your GitHub repository to automatically analyze your codebase and suggest optimal cloud infrastructure.",
      icon: <RepositoryIcon className="h-10 w-10" />,
      timeEstimate: "2-3 minutes",
      idealFor: "Developers with existing code",
      path: "/devguard",
      color: "from-emerald-500/20 via-green-400/20 to-teal-500/20 border-emerald-500/30 dark:from-emerald-700/30 dark:via-green-600/20 dark:to-teal-700/30",
      hoverEffect: "from-emerald-500/30 via-green-400/30 to-teal-500/30 border-emerald-500/40 dark:from-emerald-700/40 dark:via-green-600/30 dark:to-teal-700/40",
      textGradient: "from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400"
    },
    {
      id: "idea",
      title: "Describe Your Idea",
      description: "Just tell us about your application idea in plain language, and we'll suggest the optimal cloud architecture.",
      icon: <IdeaIcon className="h-10 w-10" />,
      timeEstimate: "1-2 minutes",
      idealFor: "Quick exploration of cloud options",
      path: "/prompt",
      color: "from-amber-500/20 via-orange-400/20 to-rose-500/20 border-amber-500/30 dark:from-amber-700/30 dark:via-orange-600/20 dark:to-rose-700/30",
      hoverEffect: "from-amber-500/30 via-orange-400/30 to-rose-500/30 border-amber-500/40 dark:from-amber-700/40 dark:via-orange-600/30 dark:to-rose-700/40",
      textGradient: "from-amber-600 to-rose-600 dark:from-amber-400 dark:to-rose-400"
    }
  ];
  
  // Handle navigation with proper state updates
  const handleEntrySelect = (option: typeof entryOptions[0]) => {
    if (isTransitioning) return;
    
    setSelectedCard(option.id);
    setIsTransitioning(true);
    
    // Set the entry source in our global store
    setEntrySource(option.id as 'questionnaire' | 'repository' | 'idea');
    
    // Delayed navigation for smooth animation
    setTimeout(() => {
      router.push(option.path);
    }, 400);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.15,
      }
    }
  };
  
  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
    }
  };
  
  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <div className="relative overflow-hidden min-h-[calc(100vh-80px)] flex flex-col">
      {/* Background elements */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] -translate-y-1/4 translate-x-1/4 rounded-full bg-gradient-to-br from-blue-500/10 to-purple-500/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] translate-y-1/4 -translate-x-1/4 rounded-full bg-gradient-to-tr from-amber-500/10 to-red-500/10 blur-3xl" />
        <GridPattern className="absolute inset-0 opacity-20" />
      </div>

      <div className="container relative z-10 mx-auto py-12 px-4 flex-grow flex flex-col justify-center">
        <motion.div 
          className="text-center mb-14 mx-auto max-w-3xl"
          variants={headerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="mb-6 flex justify-center">
            <div className="relative bg-gradient-to-r from-primary to-purple-700 rounded-xl p-2 shadow-lg">
              <div className="flex items-center justify-center h-14 w-14 bg-background rounded-lg">
                <div className="relative h-8 w-8">
                  <CloudLogo />
                </div>
              </div>
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
            CloudCompass
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-6">
            Your intelligent guide to optimal cloud architecture
          </p>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Choose your preferred path to get cloud architecture recommendations and cost analysis tailored to your needs.
          </p>
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {entryOptions.map((option) => (
            <motion.div
              key={option.id}
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.98 }}
              variants={cardVariants}
              className="relative"
              onHoverStart={() => setHoveredCard(option.id)}
              onHoverEnd={() => setHoveredCard(null)}
            >
              <Card 
                className={`relative overflow-hidden border-2 h-full flex flex-col bg-gradient-to-br transition-all duration-300 ${
                  selectedCard === option.id
                    ? option.hoverEffect
                    : hoveredCard === option.id
                    ? option.hoverEffect
                    : option.color
                }`}
                onClick={() => handleEntrySelect(option)}
              >
                {/* Decorative elements */}
                <CirclePattern className="absolute right-4 bottom-4 text-primary opacity-30" />
                
                <CardHeader className="pb-2 relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-background/80 backdrop-blur-sm rounded-xl shadow-sm">
                      {option.icon}
                    </div>
                    <div>
                      <CardTitle className="text-xl">
                        {option.title}
                      </CardTitle>
                      <CardDescription className="text-xs font-medium">
                        Estimated time: {option.timeEstimate}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="flex-grow pb-2 relative z-10">
                  <p className="mb-4 text-sm">{option.description}</p>
                  <div className="bg-background/60 backdrop-blur-sm rounded-lg p-3 text-sm">
                    <span className="font-medium">Best for:</span> {option.idealFor}
                  </div>
                </CardContent>
                
                <CardFooter className="pt-0 pb-4 relative z-10">
                  <Button 
                    className={`w-full mt-2 transition-all ${selectedCard === option.id ? 'bg-primary/90' : ''}`}
                  >
                    <span>Start Here</span>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>
        
        {/* Footer with cloud provider logos */}
        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <p className="text-sm text-muted-foreground mb-4">Supporting all major cloud providers</p>
          <div className="flex flex-wrap justify-center items-center gap-8">
            <ProviderLogo name="AWS" />
            <ProviderLogo name="Azure" />
            <ProviderLogo name="GCP" />
            <ProviderLogo name="DigitalOcean" />
            <ProviderLogo name="Firebase" />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// Cloud logo component
const CloudLogo = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
    <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
  </svg>
);

// Placeholder for provider logos
const ProviderLogo = ({ name }: { name: string }) => (
  <div className="h-8 opacity-70 hover:opacity-100 transition-opacity">
    <div className="bg-background/80 backdrop-blur-sm px-3 py-1 rounded-md text-sm font-medium">
      {name}
    </div>
  </div>
);