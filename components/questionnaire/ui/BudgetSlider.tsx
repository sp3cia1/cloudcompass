"use client";

import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  MinimalBudgetIcon, 
  SmallBudgetIcon, 
  MediumBudgetIcon, 
  LargeBudgetIcon, 
  EnterpriseBudgetIcon 
} from "../icons/BudgetIcons";
import { BUDGET_RANGE_METADATA } from "@/lib/metadata/budget";
import { motion, AnimatePresence } from "framer-motion";

export interface BudgetSliderProps {
  value: number;
  onChange: (value: number) => void;
  className?: string;
}

export default function BudgetSlider({
  value,
  onChange,
  className
}: BudgetSliderProps) {
  // Convert actual range to logarithmic range for slider
  const logarithmicBase = BUDGET_RANGE_METADATA.logarithmicBase;
  const min = BUDGET_RANGE_METADATA.min;
  const max = BUDGET_RANGE_METADATA.max;
  
  const toLogarithmic = useCallback(
    (value: number): number => {
      return Math.log(value) / Math.log(logarithmicBase);
    },
    [logarithmicBase]
  );

  const fromLogarithmic = useCallback(
    (value: number): number => {
      // Ensure the returned value is within the valid range
      return Math.max(min, Math.min(max, Math.round(Math.pow(logarithmicBase, value))));
    },
    [logarithmicBase, min, max]
  );

  // Calculate logarithmic values for slider
  const logMin = toLogarithmic(min);
  const logMax = toLogarithmic(max);
  
  // State for the logarithmic value
  const [logValue, setLogValue] = useState(toLogarithmic(value));
  // State for the direct input value (as a string to handle intermediate states during typing)
  const [inputValue, setInputValue] = useState(value.toString());
  // Animation control for value changes
  const [isAnimating, setIsAnimating] = useState(false);

  // Update log value when prop value changes
  useEffect(() => {
    setLogValue(toLogarithmic(value));
    setInputValue(value.toString());
  }, [value, toLogarithmic]);

  // Handle slider change
  const handleSliderChange = (newLogValue: number[]) => {
    const actualValue = fromLogarithmic(newLogValue[0]);
    setLogValue(newLogValue[0]);
    setInputValue(actualValue.toString());
    onChange(actualValue);
    triggerAnimation();
  };

  // Handle direct input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    setInputValue(rawValue);
  };

  // Handle input blur - validate and update value
  const handleInputBlur = () => {
    let numericValue = parseInt(inputValue, 10);
    
    // Handle invalid input
    if (isNaN(numericValue)) {
      setInputValue(value.toString());
      return;
    }
    
    // Clamp the value to the valid range
    numericValue = Math.max(min, Math.min(max, numericValue));
    
    // Update all states and notify parent
    setInputValue(numericValue.toString());
    setLogValue(toLogarithmic(numericValue));
    onChange(numericValue);
    triggerAnimation();
  };

  // Handle input key press - update on Enter
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleInputBlur();
    }
  };

  // Trigger animation effect
  const triggerAnimation = () => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 700);
  };

  // Get budget tier icon based on value
  const getBudgetIcon = () => {
    if (value <= 500) return <MinimalBudgetIcon />;
    if (value <= 2000) return <SmallBudgetIcon />;
    if (value <= 10000) return <MediumBudgetIcon />;
    if (value <= 50000) return <LargeBudgetIcon />;
    return <EnterpriseBudgetIcon />;
  };

  // Get current implication message
  const getCurrentImplication = () => {
    const implications = BUDGET_RANGE_METADATA.infrastructureImplications;
    const ranges = Object.keys(implications);
    
    for (const range of ranges) {
      // Handle ranges with plus sign properly
      if (range.endsWith('+')) {
        const minValue = parseInt(range.replace('+', ''));
        if (value >= minValue) {
          return implications[range];
        }
      } else {
        const [rangeMin, rangeMax] = range.split('-');
        const numMin = parseInt(rangeMin);
        const numMax = parseInt(rangeMax);
        
        if (value >= numMin && value <= numMax) {
          return implications[range];
        }
      }
    }
    
    return null;
  };

  // Get appropriate budget tier label
  const getBudgetTierLabel = () => {
    if (value <= 500) return "Minimal";
    if (value <= 2000) return "Small";
    if (value <= 10000) return "Medium";
    if (value <= 50000) return "Large";
    return "Enterprise";
  };

  // Format currency for display
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      maximumFractionDigits: 0 
    }).format(amount);
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Budget display section with animated value */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-primary/10 rounded-full">
            {getBudgetIcon()}
          </div>
          <div>
            <h3 className="text-base font-medium">Monthly Budget</h3>
            <div className="flex items-baseline gap-2">
              <AnimatePresence mode="wait">
                <motion.div
                  key={value}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-3xl font-bold text-primary"
                >
                  {formatCurrency(value)}
                </motion.div>
              </AnimatePresence>
              <Badge variant="outline" className="font-normal">
                {getBudgetTierLabel()}
              </Badge>
            </div>
          </div>
        </div>
        
        {/* Direct input field for precise control */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <span className="text-muted-foreground">$</span>
          </div>
          <Input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            onKeyDown={handleInputKeyDown}
            className="pl-7 w-32 text-right"
            placeholder="Enter amount"
          />
        </div>
      </div>

      {/* Main slider */}
      <div className="pt-4 pb-2">
        <Slider
          min={logMin}
          max={logMax}
          step={0.01}
          value={[logValue]}
          onValueChange={handleSliderChange}
          className="w-full"
        />
      </div>

      {/* Marker labels */}
      <div className="relative h-8 mt-2 mb-4">
        {BUDGET_RANGE_METADATA.markers.map((marker) => {
          // Calculate the percentage position (0-100%) on the slider
          const position = ((toLogarithmic(marker.value) - logMin) / (logMax - logMin)) * 100;
          
          // Only render markers that are within the visible range with a small buffer
          if (position >= -5 && position <= 105) {
            return (
              <div 
                key={marker.value} 
                className="absolute flex flex-col items-center -translate-x-1/2"
                style={{ 
                  left: `${position}%`,
                }}
              >
                <div className="h-1.5 w-0.5 bg-muted-foreground/50 mb-1.5"></div>
                <span className="text-xs font-medium">{marker.label}</span>
              </div>
            );
          }
          return null;
        })}
      </div>

      {/* Implications card with subtle animation on change */}
      <AnimatePresence mode="wait">
        <motion.div
          key={value} // Recreate when value changes to trigger animation
          initial={{ opacity: 0.6, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* <Card className="bg-muted/20 border-primary/10">
            <CardContent className="pt-4">
              <div className="flex items-start gap-3">
                <div className={`p-1.5 rounded-full ${isAnimating ? 'bg-primary' : 'bg-primary/20'} transition-colors duration-700`}>
                  {getBudgetIcon()}
                </div>
                <div>
                  <p className="text-sm mb-1 font-medium">Infrastructure Implications</p>
                  <p className="text-sm text-muted-foreground">{getCurrentImplication()}</p>
                </div>
              </div>
            </CardContent>
          </Card> */}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}