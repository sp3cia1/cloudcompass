"use client";

import { useCallback } from "react";
import { cn } from "@/lib/utils";
import { CheckIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";

interface Step {
  title: string;
}

interface ProgressIndicatorProps {
  steps: Step[];
  currentStep: number;
  onStepClick: (index: number) => void;
}

export default function ProgressIndicator({
  steps,
  currentStep,
  onStepClick,
}: ProgressIndicatorProps) {
  const getStepStatus = useCallback(
    (index: number) => {
      if (index < currentStep) return "completed";
      if (index === currentStep) return "current";
      return "upcoming";
    },
    [currentStep]
  );

  const isStepAccessible = useCallback(
    (index: number) => {
      // Can only access current or previous steps, or the immediate next step
      return index <= currentStep + 1;
    },
    [currentStep]
  );

  return (
    <nav aria-label="Progress" className="w-full">
      {/* Mobile view - simplified dots */}
      <div className="md:hidden flex justify-between items-center px-4 py-2">
        {steps.map((step, index) => {
          const status = getStepStatus(index);
          return (
            <Button
              key={index}
              variant="ghost"
              size="icon"
              className={cn(
                "w-2.5 h-2.5 p-0 rounded-full transition-all duration-200",
                status === "completed" && "bg-primary hover:bg-primary/90 scale-110",
                status === "current" && "bg-primary hover:bg-primary/90 ring-2 ring-offset-2 ring-primary scale-125",
                status === "upcoming" && "bg-muted hover:bg-muted/80",
                !isStepAccessible(index) && "opacity-50 cursor-not-allowed"
              )}
              disabled={!isStepAccessible(index)}
              onClick={() => isStepAccessible(index) && onStepClick(index)}
              aria-current={status === "current" ? "step" : undefined}
              aria-label={`${step.title} ${
                status === "completed" ? "(completed)" : status === "current" ? "(current)" : "(upcoming)"
              }`}
            />
          );
        })}
      </div>

      {/* Desktop view - redesigned horizontal stepper */}
      <div className="hidden md:block">
        <div className="flex flex-col space-y-2">
          {/* Step indicators and connecting lines */}
          <div className="flex items-center justify-between relative">
            {/* The line that connects all steps */}
            <div className="absolute left-0 right-0 h-0.5 bg-muted top-1/2 transform -translate-y-1/2 z-0"></div>
            
            {/* Step buttons with spacing */}
            <div className="flex justify-between w-full relative z-10">
              {steps.map((step, index) => {
                const status = getStepStatus(index);
                return (
                  <Button
                    key={index}
                    // remove the variant property to prevent it from conflicting with our custom styles
                    // instead, we'll define styles explicitly based on status
                    variant={status === "upcoming" ? "outline" : "default"}
                    size="icon"
                    className={cn(
                      "h-8 w-8 rounded-full p-0",
                      // remove bg-background that was overriding the variant styles
                      status === "current" && "ring-2 ring-offset-2 ring-primary"
                    )}
                    disabled={!isStepAccessible(index)}
                    onClick={() => isStepAccessible(index) && onStepClick(index)}
                    aria-current={status === "current" ? "step" : undefined}
                  >
                    {status === "completed" ? (
                      <CheckIcon className="h-4 w-4" />
                    ) : (
                      <span className="text-xs">{index + 1}</span>
                    )}
                  </Button>
                );
              })}
            </div>
            
            {/* Progress overlay */}
            <div 
              className="absolute left-0 h-0.5 bg-primary top-1/2 transform -translate-y-1/2 transition-all duration-500 ease-in-out z-0"
              style={{
                width: `${(currentStep / (steps.length - 1)) * 100}%`,
              }}
            ></div>
          </div>
          
          {/* Step titles below, properly aligned with buttons */}
          <div className="flex justify-between w-full px-0">
            {steps.map((step, index) => {
              const status = getStepStatus(index);
              return (
                <div 
                  key={index} 
                  className={cn(
                    "text-center px-2 transition-colors",
                    status === "completed" && "text-primary",
                    status === "current" && "text-primary font-semibold",
                    status === "upcoming" && "text-muted-foreground"
                  )}
                  style={{
                    width: `${100 / steps.length}%`
                  }}
                >
                  <span className="text-sm whitespace-normal break-words">
                    {step.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}