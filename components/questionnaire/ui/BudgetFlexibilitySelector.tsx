"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { BUDGET_FLEXIBILITY_OPTIONS } from "@/lib/metadata/budget";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { FixedBudgetIcon, FlexibleBudgetIcon } from "../icons/BudgetIcons";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/components/theme/ThemeProvider";

export interface BudgetFlexibilitySelectorProps {
  value: number;
  onChange: (value: number) => void;
  className?: string;
}

export default function BudgetFlexibilitySelector({
  value,
  onChange,
  className
}: BudgetFlexibilitySelectorProps) {
  const { theme } = useTheme();
  const [animateTransition, setAnimateTransition] = useState(false);

  // Trigger animation when value changes
  useEffect(() => {
    setAnimateTransition(true);
    const timer = setTimeout(() => setAnimateTransition(false), 700);
    return () => clearTimeout(timer);
  }, [value]);

  // Get currently selected option details
  const selectedOption = BUDGET_FLEXIBILITY_OPTIONS.find(option => option.value === value) || 
                         BUDGET_FLEXIBILITY_OPTIONS[0];

  // Get appropriate icon based on flexibility level
  const getFlexibilityIcon = (flexValue: number) => {
    return flexValue === 0 ? <FixedBudgetIcon /> : <FlexibleBudgetIcon />;
  };

  // Get color based on flexibility level
  const getFlexibilityColor = (flexValue: number) => {
    // Combined light and dark mode colors
    if (flexValue === 0) {
      return "border-yellow-200 bg-yellow-50 hover:bg-yellow-100 dark:border-yellow-900 dark:bg-yellow-950/30 dark:hover:bg-yellow-900/40";
    }
    if (flexValue <= 10) {
      return "border-blue-200 bg-blue-50 hover:bg-blue-100 dark:border-blue-900 dark:bg-blue-950/30 dark:hover:bg-blue-900/40";
    }
    if (flexValue <= 20) {
      return "border-indigo-200 bg-indigo-50 hover:bg-indigo-100 dark:border-indigo-900 dark:bg-indigo-950/30 dark:hover:bg-indigo-900/40";
    }
    if (flexValue <= 30) {
      return "border-purple-200 bg-purple-50 hover:bg-purple-100 dark:border-purple-900 dark:bg-purple-950/30 dark:hover:bg-purple-900/40";
    }
    return "border-pink-200 bg-pink-50 hover:bg-pink-100 dark:border-pink-900 dark:bg-pink-950/30 dark:hover:bg-pink-900/40";
  };

  // Get badge color based on flexibility level
  const getBadgeColor = (flexValue: number) => {
    // Combined light and dark mode colors
    if (flexValue === 0) {
      return "bg-yellow-200 text-yellow-800 hover:bg-yellow-300 dark:bg-yellow-900/60 dark:text-yellow-200 dark:hover:bg-yellow-800";
    }
    if (flexValue <= 10) {
      return "bg-blue-200 text-blue-800 hover:bg-blue-300 dark:bg-blue-900/60 dark:text-blue-200 dark:hover:bg-blue-800";
    }
    if (flexValue <= 20) {
      return "bg-indigo-200 text-indigo-800 hover:bg-indigo-300 dark:bg-indigo-900/60 dark:text-indigo-200 dark:hover:bg-indigo-800";
    }
    if (flexValue <= 30) {
      return "bg-purple-200 text-purple-800 hover:bg-purple-300 dark:bg-purple-900/60 dark:text-purple-200 dark:hover:bg-purple-800";
    }
    return "bg-pink-200 text-pink-800 hover:bg-pink-300 dark:bg-pink-900/60 dark:text-pink-200 dark:hover:bg-pink-800";
  };

  // Get progress bar color based on flexibility level with dark mode support
  const getProgressColor = (flexValue: number) => {
    if (flexValue === 0) return "bg-yellow-500 dark:bg-yellow-600";
    if (flexValue <= 10) return "bg-blue-500 dark:bg-blue-600";
    if (flexValue <= 20) return "bg-indigo-500 dark:bg-indigo-600";
    if (flexValue <= 30) return "bg-purple-500 dark:bg-purple-600";
    return "bg-pink-500 dark:bg-pink-600";
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Flexibility options */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {BUDGET_FLEXIBILITY_OPTIONS.map((option) => {
          const isSelected = option.value === value;
          const flexColor = getFlexibilityColor(option.value);
          const badgeColor = getBadgeColor(option.value);
          
          return (
            // <TooltipProvider key={option.value} delayDuration={300}>
            //   <Tooltip>
            //     <TooltipTrigger asChild>
                  <Card
                    className={cn(
                      "relative cursor-pointer transition-all overflow-hidden border-2",
                      flexColor,
                      isSelected && "ring-2 ring-primary/50 dark:ring-primary/70"
                    )}
                    onClick={() => onChange(option.value)}
                  >
                    {/* Selected indicator */}
                    {isSelected && (
                      <motion.div 
                        className="absolute top-0 left-0 w-full h-1 bg-primary"
                        layoutId="selectedIndicator"
                      />
                    )}
                    
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-1.5 bg-background rounded-full shadow-sm dark:bg-background/90">
                          {getFlexibilityIcon(option.value)}
                        </div>
                        <div>
                          <h4 className="text-sm font-medium dark:text-foreground">{option.label}</h4>
                          <Badge
                            variant="outline"
                            className={cn("mt-1 font-normal text-xs", badgeColor)}
                          >
                            {option.value}% flexibility
                          </Badge>
                        </div>
                      </div>
                      
                      {/* Budget visualization */}
                      <div className="mt-4 mb-1">
                        <div className="flex justify-between items-center text-xs mb-1 dark:text-foreground/70">
                          <span>Base Budget</span>
                          {option.value > 0 && (
                            <span>+{option.value}%</span>
                          )}
                        </div>
                        <div className="relative h-3 w-full bg-background dark:bg-muted rounded-full overflow-hidden">
                          <div
                            className={cn("h-full", getProgressColor(option.value))}
                            style={{ width: `${100 / (1 + option.value / 100)}%` }}
                          />
                          {option.value > 0 && (
                            <div 
                              className={cn(
                                "absolute top-0 h-full opacity-30",
                                getProgressColor(option.value)
                              )}
                              style={{ 
                                left: `${100 / (1 + option.value / 100)}%`,
                                width: `${100 - (100 / (1 + option.value / 100))}%` 
                              }}
                            />
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
            //     </TooltipTrigger>
            //     <TooltipContent side="bottom" align="center" className="dark:bg-background/90">
            //       <p className="text-xs max-w-[200px]">{option.description}</p>
            //     </TooltipContent>
            //   </Tooltip>
            // </TooltipProvider>
          );
        })}
      </div>
    </div>
  );
}