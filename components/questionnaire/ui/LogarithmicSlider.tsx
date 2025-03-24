"use client";

import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export interface LogarithmicSliderProps {
  min: number;
  max: number; 
  value: number;
  onChange: (value: number) => void;
  logarithmicBase?: number;
  markers?: { value: number; label: string }[];
  label?: string;
  description?: string;
  valueDisplay?: (value: number) => string;
  className?: string;
  implications?: Record<string, string>;
}

export default function LogarithmicSlider({
  min,
  max,
  value,
  onChange,
  logarithmicBase = 10,
  markers = [],
  label = "Scale",
  description = "Select a value on the logarithmic scale",
  valueDisplay = (value: number) => value.toLocaleString(),
  className,
  implications
}: LogarithmicSliderProps) {
  // Calculate logarithmic positioning
  const toLogarithmic = useCallback(
    (value: number): number => {
      return Math.log(value) / Math.log(logarithmicBase);
    },
    [logarithmicBase]
  );

  const fromLogarithmic = useCallback(
    (value: number): number => {
      return Math.round(Math.pow(logarithmicBase, value));
    },
    [logarithmicBase]
  );

  // Convert actual range to logarithmic range for slider
  const logMin = toLogarithmic(min);
  const logMax = toLogarithmic(max);
  
  // Convert current value to logarithmic for slider
  const [logValue, setLogValue] = useState(toLogarithmic(value));

  // Update log value when prop value changes
  useEffect(() => {
    setLogValue(toLogarithmic(value));
  }, [value, toLogarithmic]);

  // Handle slider change
  const handleSliderChange = (newLogValue: number[]) => {
    const actualValue = fromLogarithmic(newLogValue[0]);
    setLogValue(newLogValue[0]);
    onChange(actualValue);
  };

  // Find current implication message
  const getCurrentImplication = () => {
    if (!implications) return null;
    
    // Find the implication range that includes the current value
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

  const currentImplication = getCurrentImplication();

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header with current value display */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-lg font-medium">{label}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <div className="text-2xl font-semibold text-primary">
          {valueDisplay(value)}
        </div>
      </div>

      {/* Main slider */}

      <div className="relative h-6 mb-2">
          <div className="absolute inset-x-0 flex items-center justify-between px-2">
            <div className="text-sm font-medium text-foreground/50">Lower Cost</div>
            <div className="text-sm font-medium text-foreground/50">Higher Cost</div>
          </div>
      </div>

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
        {markers.map((marker) => {
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
                {marker.label}
              </div>
            );
          }
          return null;
        })}
      </div>

      {/* Infrastructure implication card */}
      {/* {currentImplication && (
        <Card className="mt-6 bg-muted/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Infrastructure Implications</CardTitle>
            <CardDescription>
              Based on your selected concurrent user count
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{currentImplication}</p>
          </CardContent>
        </Card>
      )} */}
    </div>
  );
}