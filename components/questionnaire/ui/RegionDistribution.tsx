"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { GeographicRegion } from "@/types";
import { getRegionInfo } from "@/lib/metadata/geographic-regions";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PieChart, ChevronUp, ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// Configuration constants
const MIN_REGION_PERCENTAGE = 3; // Minimum percentage for any selected region
const ADJUSTMENT_STEP = 5; // Percentage adjustment step for increment/decrement

// Helper function to safely get a number value with null safety
const safeGetValue = (obj: Record<GeographicRegion, number>, key: GeographicRegion): number => {
  const value = obj[key];
  return value != null ? value : 0;
};

// Define the component props interface
interface RegionDistributionProps {
  selectedRegions: GeographicRegion[];
  distribution: Record<GeographicRegion, number>;
  onChange: (newDistribution: Record<GeographicRegion, number>) => void;
  className?: string;
  disabled?: boolean;
}

// Helper to create a typed empty record
const createEmptyDistribution = (): Partial<Record<GeographicRegion, number>> => ({});
const createEmptyInputValues = (): Partial<Record<GeographicRegion, string>> => ({});

export default function RegionDistribution({
  selectedRegions,
  distribution,
  onChange,
  className,
  disabled = false,
}: RegionDistributionProps) {
  // Ref to prevent update cycles
  const isProcessingRef = useRef(false);
  
  // Active region for highlighting
  const [activeRegion, setActiveRegion] = useState<GeographicRegion | null>(null);
  
  // Local input values for direct editing
  const [inputValues, setInputValues] = useState<Partial<Record<GeographicRegion, string>>>(
    createEmptyInputValues()
  );

  // Calculate total percentage
  const totalPercentage = useMemo(() => {
    try {
      return Math.round(Object.values(distribution).reduce((sum, val) => sum + (val ?? 0), 0) * 10) / 10;
    } catch (error) {
      console.error("Error calculating total percentage:", error);
      return 0;
    }
  }, [distribution]);

  // Sort regions by size (largest first) for better UX
  const orderedRegions = useMemo(() => {
    return [...selectedRegions].sort((a, b) => safeGetValue(distribution, b) - safeGetValue(distribution, a));
  }, [selectedRegions, distribution]);

  // Get colors for each region
  const regionColors = useMemo(() => {
    return orderedRegions.map((_, index) => {
      const hue = (index * 35) % 360;
      return `hsl(${hue}, 85%, 50%)`;
    });
  }, [orderedRegions]);

  // Initialize input values when distribution or regions change
  useEffect(() => {
    if (isProcessingRef.current) return;
    const newInputValues = createEmptyInputValues();
    selectedRegions.forEach((region) => {
      newInputValues[region] = safeGetValue(distribution, region).toString();
    });
    setInputValues(newInputValues);
  }, [distribution, selectedRegions]);

  // Handle initial distribution setup
  useEffect(() => {
    if (isProcessingRef.current || selectedRegions.length === 0) return;

    let needsUpdate = false;
    const updatedDistribution = { ...distribution };

    // Ensure all selected regions have at least MIN_REGION_PERCENTAGE
    for (const region of selectedRegions) {
      if (safeGetValue(distribution, region) < MIN_REGION_PERCENTAGE) {
        updatedDistribution[region] = MIN_REGION_PERCENTAGE;
        needsUpdate = true;
      }
    }

    // Remove regions that are no longer selected
    Object.keys(updatedDistribution).forEach((key) => {
      if (!selectedRegions.includes(key as GeographicRegion)) {
        delete updatedDistribution[key as GeographicRegion];
        needsUpdate = true;
      }
    });

    // Normalize to ensure total is 100%
    if (needsUpdate || Math.abs(totalPercentage - 100) > 0.1) {
      isProcessingRef.current = true;
      
      try {
        const currentTotal = Object.values(updatedDistribution).reduce((sum, val) => sum + (val || 0), 0);
        
        if (Math.abs(currentTotal - 100) > 0.1) {
          const diff = 100 - currentTotal;
          
          // Find regions that can be adjusted without violating minimum
          const adjustableRegions = selectedRegions.filter(
            (r) => safeGetValue(updatedDistribution, r) > MIN_REGION_PERCENTAGE + Math.abs(diff)
          );
          
          if (adjustableRegions.length > 0) {
            // Adjust the largest region
            const largestRegion = adjustableRegions.reduce(
              (max, r) => safeGetValue(updatedDistribution, r) > safeGetValue(updatedDistribution, max) ? r : max,
              adjustableRegions[0]
            );
            updatedDistribution[largestRegion] += diff;
          } else {
            // Distribute proportionally across all regions
            const totalToAdjust = selectedRegions.reduce(
              (sum, r) => sum + safeGetValue(updatedDistribution, r), 0
            );
            
            if (totalToAdjust > 0) {
              for (const region of selectedRegions) {
                const proportion = safeGetValue(updatedDistribution, region) / totalToAdjust;
                updatedDistribution[region] = Math.max(
                  MIN_REGION_PERCENTAGE,
                  Math.round((safeGetValue(updatedDistribution, region) + diff * proportion) * 10) / 10
                );
              }
            }
          }
        }
        
        // Update parent
        onChange(updatedDistribution);
      } catch (error) {
        console.error("Error normalizing distribution:", error);
      } finally {
        setTimeout(() => {
          isProcessingRef.current = false;
        }, 0);
      }
    }
  }, [selectedRegions, distribution, onChange, totalPercentage]);

  // Handle value adjustments with increment/decrement
  const handleAdjustPercentage = useCallback((region: GeographicRegion, increment: boolean) => {
    if (disabled || isProcessingRef.current) return;
    
    isProcessingRef.current = true;
    
    try {
      const step = increment ? ADJUSTMENT_STEP : -ADJUSTMENT_STEP;
      const updatedDistribution = { ...distribution };
      const currentValue = safeGetValue(updatedDistribution, region);
      
      // Calculate new value with constraints
      const newValue = Math.max(
        MIN_REGION_PERCENTAGE, 
        Math.min(100 - (selectedRegions.length - 1) * MIN_REGION_PERCENTAGE, currentValue + step)
      );
      
      if (Math.abs(newValue - currentValue) < 0.1) {
        isProcessingRef.current = false;
        return;
      }
      
      updatedDistribution[region] = newValue;
      
      // Calculate how much we need to adjust other regions
      const delta = currentValue - newValue;
      const otherRegions = selectedRegions.filter(r => r !== region);
      
      if (otherRegions.length > 0 && Math.abs(delta) > 0.1) {
        // Distribute the delta proportionally across other regions
        const otherTotal = otherRegions.reduce(
          (sum, r) => sum + safeGetValue(updatedDistribution, r), 0
        );
        
        // Ensure all other regions maintain minimum percentage
        for (const otherRegion of otherRegions) {
          const otherCurrent = safeGetValue(updatedDistribution, otherRegion);
          const proportion = otherTotal > 0 ? otherCurrent / otherTotal : 1 / otherRegions.length;
          
          updatedDistribution[otherRegion] = Math.max(
            MIN_REGION_PERCENTAGE,
            Math.round((otherCurrent + delta * proportion) * 10) / 10
          );
        }
      }
      
      // Ensure exactly 100%
      const finalTotal = Object.values(updatedDistribution).reduce((sum, val) => sum + (val || 0), 0);
      
      if (Math.abs(finalTotal - 100) > 0.1) {
        // Adjust the largest other region to make total exactly 100%
        const diff = 100 - finalTotal;
        
        if (otherRegions.length > 0) {
          const largestOther = otherRegions.reduce(
            (max, r) => safeGetValue(updatedDistribution, r) > safeGetValue(updatedDistribution, max) ? r : max,
            otherRegions[0]
          );
          
          updatedDistribution[largestOther] += diff;
        } else {
          // If no other regions, this region must be 100%
          updatedDistribution[region] = 100;
        }
      }
      
      // Update input values
      const newInputValues = { ...inputValues };
      
      for (const r of selectedRegions) {
        newInputValues[r] = updatedDistribution[r].toString();
      }
      
      setInputValues(newInputValues);
      
      // Notify parent component
      onChange(updatedDistribution);
    } catch (error) {
      console.error("Error adjusting percentage:", error);
    } finally {
      setTimeout(() => {
        isProcessingRef.current = false;
      }, 0);
    }
  }, [disabled, selectedRegions, distribution, onChange, inputValues]);

  // Handle direct input changes
  const handleInputChange = useCallback(
    (region: GeographicRegion, inputValue: string) => {
      if (disabled || isProcessingRef.current) return;

      // Update input field immediately for responsive UI
      setInputValues(prev => ({
        ...prev,
        [region]: inputValue
      }));

      // Parse and validate input
      const parsedValue = parseInt(inputValue, 10);
      if (isNaN(parsedValue)) return;

      const newValue = Math.max(MIN_REGION_PERCENTAGE, Math.min(100, parsedValue));
      isProcessingRef.current = true;

      try {
        const updatedDistribution = { ...distribution };
        const currentValue = safeGetValue(updatedDistribution, region);
        const delta = currentValue - newValue;

        if (Math.abs(delta) < 0.1) {
          isProcessingRef.current = false;
          return;
        }

        updatedDistribution[region] = newValue;
        const otherRegions = selectedRegions.filter((r) => r !== region);

        if (otherRegions.length === 0) {
          updatedDistribution[region] = 100;
        } else if (Math.abs(delta) > 0.1) {
          // Calculate existing total for other regions
          const otherTotal = otherRegions.reduce(
            (sum, r) => sum + safeGetValue(updatedDistribution, r), 0
          );
          
          // Target total for other regions
          const targetOtherTotal = 100 - newValue;
          
          // Calculate adjustment factor
          const adjustmentFactor = otherTotal > 0 ? targetOtherTotal / otherTotal : 1;

          // Apply proportional adjustment
          for (const otherRegion of otherRegions) {
            const otherCurrent = safeGetValue(updatedDistribution, otherRegion);
            updatedDistribution[otherRegion] = Math.max(
              MIN_REGION_PERCENTAGE,
              Math.round(otherCurrent * adjustmentFactor * 10) / 10
            );
          }

          // Final adjustment to ensure exactly 100%
          const finalTotal = Object.values(updatedDistribution).reduce((sum, val) => sum + (val || 0), 0);
          
          if (Math.abs(finalTotal - 100) > 0.1) {
            const largestOther = otherRegions.reduce(
              (max, r) => safeGetValue(updatedDistribution, r) > safeGetValue(updatedDistribution, max) ? r : max,
              otherRegions[0]
            );
            
            updatedDistribution[largestOther] += 100 - finalTotal;
          }
        }

        // Update input values
        const newInputValues = { ...inputValues };
        for (const r of selectedRegions) {
          newInputValues[r] = updatedDistribution[r].toString();
        }
        setInputValues(newInputValues);

        // Notify parent
        onChange(updatedDistribution);
      } catch (error) {
        console.error("Error updating from input:", error);
      } finally {
        setTimeout(() => {
          isProcessingRef.current = false;
        }, 0);
      }
    },
    [disabled, selectedRegions, distribution, onChange, inputValues]
  );

  // Render empty state if no regions are selected
  if (selectedRegions.length === 0) {
    return (
      <Card className={cn("bg-muted/30", className)}>
        <CardHeader>
          <CardTitle className="text-base">Region Distribution</CardTitle>
          <CardDescription>Select regions on the map to allocate user distribution</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center p-6 text-center text-muted-foreground">
          <PieChart className="h-12 w-12 mb-4 opacity-30" />
          <p>No regions selected</p>
          <p className="text-sm">Use the map above to select regions first</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn(className, disabled && "opacity-70")}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base">Region Distribution</CardTitle>
            <CardDescription>Allocate your expected user distribution across regions</CardDescription>
          </div>
          <Badge variant={Math.abs(totalPercentage - 100) < 0.5 ? "outline" : "destructive"}>
            Total: {totalPercentage}%
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        <div className="mb-1 text-xs text-muted-foreground">
          Adjust percentages for each region (minimum: {MIN_REGION_PERCENTAGE}%)
        </div>

        {/* Visual bar representation */}
        <div className="mb-6 mt-4">
          <div className="h-12 w-full flex rounded-lg overflow-hidden">
            {orderedRegions.map((region, index) => {
              const percentage = safeGetValue(distribution, region);
              const info = getRegionInfo(region);
              if (!info) return null;

              return (
                <div
                  key={`segment-${region}`}
                  className={cn(
                    "h-full transition-colors duration-200 flex items-center justify-center",
                    activeRegion === region && "ring-2 ring-inset ring-primary"
                  )}
                  style={{ 
                    width: `${percentage}%`, 
                    backgroundColor: regionColors[index] 
                  }}
                  onMouseEnter={() => setActiveRegion(region)}
                  onMouseLeave={() => setActiveRegion(null)}
                >
                  {percentage >= 8 && (
                    <div className="text-white text-xs font-medium truncate px-1">
                      {info.name} ({percentage}%)
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Region details */}
        <div className="space-y-2 mt-6">
          {orderedRegions.map((region, index) => {
            const info = getRegionInfo(region);
            const percentage = safeGetValue(distribution, region);
            const inputValue = inputValues[region] ?? percentage.toString();
            
            if (!info) return null;

            return (
              <div
                key={`region-${region}`}
                className={cn(
                  "p-3 rounded-lg transition-colors",
                  activeRegion === region ? "bg-muted/50" : "hover:bg-muted/30"
                )}
                onMouseEnter={() => setActiveRegion(region)}
                onMouseLeave={() => setActiveRegion(null)}
              >
                <div className="flex items-center justify-between">
                  <div className="font-medium flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-2" 
                      style={{ backgroundColor: regionColors[index] }} 
                    />
                    {info.name}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {/* Decrement button */}
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleAdjustPercentage(region, false)}
                      disabled={disabled || percentage <= MIN_REGION_PERCENTAGE}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                    
                    {/* Input field */}
                    <Input
                      type="number"
                      min={MIN_REGION_PERCENTAGE}
                      max={100}
                      value={inputValue}
                      onChange={(e) => handleInputChange(region, e.target.value)}
                      className="w-16 h-8 text-center"
                      disabled={disabled}
                    />
                    <span className="text-sm text-muted-foreground">%</span>
                    
                    {/* Increment button */}
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleAdjustPercentage(region, true)}
                      disabled={disabled || percentage >= 100 - ((selectedRegions.length - 1) * MIN_REGION_PERCENTAGE)}
                    >
                      <ChevronUp className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                {/* Region description */}
                {activeRegion === region && (
                  <div className="mt-2 text-xs text-muted-foreground">
                    <span className="font-medium">{info.name} region:</span> {info.description}
                  </div>
                )}
                
                {/* Individual bar representation */}
                <div className="mt-2 h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-200"
                    style={{ 
                      width: `${percentage}%`, 
                      backgroundColor: regionColors[index] 
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}