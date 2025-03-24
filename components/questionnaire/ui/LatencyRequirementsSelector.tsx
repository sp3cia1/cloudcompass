"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LATENCY_METADATA } from "@/lib/metadata";

export interface LatencyRequirementsSelectorProps {
  value: number;
  onChange: (value: number) => void;
  className?: string;
}

export default function LatencyRequirementsSelector({
  value,
  onChange,
  className
}: LatencyRequirementsSelectorProps) {
  const [selectedRegion, setSelectedRegion] = useState<string>("Same region");
  
  // Get current perception for selected value
  const getCurrentPerception = () => {
    // Find the nearest marker at or below the current value
    const marker = [...LATENCY_METADATA.markers]
      .sort((a, b) => b.value - a.value)
      .find(m => m.value <= value) || LATENCY_METADATA.markers[0];
    
    return marker.perception;
  };
  
  // Get the regional adjusted latency
  const getRegionalLatency = () => {
    const multiplier = LATENCY_METADATA.regionalImpact[selectedRegion] || 1;
    return Math.round(value * multiplier);
  };
  
  // Get current architectural implications
  const getCurrentImplications = () => {
    const ranges = Object.keys(LATENCY_METADATA.architecturalImplications);
    
    for (const range of ranges) {
      // Special case for patterns like "501+"
      if (range.includes('+')) {
        const threshold = parseInt(range.replace('+', ''));
        if (value >= threshold) {
          return LATENCY_METADATA.architecturalImplications[range];
        }
        continue;
      }
      
      // Standard case for ranges like "50-100"
      const [rangeMin, rangeMax] = range.split('-');
      const numMin = parseInt(rangeMin);
      const numMax = parseInt(rangeMax);
      
      if (value >= numMin && value <= numMax) {
        return LATENCY_METADATA.architecturalImplications[range];
      }
    }
    
    return null;
  };
  
  const currentPerception = getCurrentPerception();
  const regionalLatency = getRegionalLatency();
  const implications = getCurrentImplications();
  
  // Generate background with perception zones
  const getSliderBackground = () => {
    const sortedMarkers = [...LATENCY_METADATA.markers].sort((a, b) => a.value - b.value);
    const gradientStops: string[] = [];
    
    sortedMarkers.forEach((marker, index) => {
      const position = ((marker.value - LATENCY_METADATA.min) / 
        (LATENCY_METADATA.max - LATENCY_METADATA.min)) * 100;
      
      // Color based on perception
      let color;
      switch (marker.perception) {
        case "Imperceptible delay": color = "rgba(0, 255, 0, 0.2)"; break; // Green
        case "Slight delay": color = "rgba(144, 238, 144, 0.2)"; break; // Light green
        case "Noticeable delay": color = "rgba(255, 255, 0, 0.2)"; break; // Yellow
        case "Frustrating delay": color = "rgba(255, 165, 0, 0.2)"; break; // Orange
        case "Unacceptable delay": color = "rgba(255, 0, 0, 0.2)"; break; // Red
        default: color = "rgba(200, 200, 200, 0.2)";
      }
      
      // Add gradient stop
      gradientStops.push(`${color} ${position}%`);
      
      // Add stop for next color if not the last marker
      if (index < sortedMarkers.length - 1) {
        gradientStops.push(`${color} ${position}%`);
      }
    });
    
    return `linear-gradient(to right, ${gradientStops.join(', ')})`;
  };
  
  const sliderBackground = getSliderBackground();
  
  return (
    <div className={cn("space-y-6", className)}>
      {/* Header with current value and perception */}
      <div className="flex flex-col space-y-2">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-lg font-medium">Latency Requirements</h3>
            <p className="text-sm text-muted-foreground">
              Select the maximum acceptable response time for your application
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-semibold text-primary">{value}ms</div>
            <div className="text-sm font-medium" style={{ 
              color: currentPerception.includes("Imperceptible") ? "green" :
                     currentPerception.includes("Slight") ? "green" :
                     currentPerception.includes("Noticeable") ? "#CC9900" :
                     currentPerception.includes("Frustrating") ? "orange" : "red"
            }}>
              {currentPerception}
            </div>
          </div>
        </div>
      </div>
      
      {/* Slider with colored zones and cost indicators */}
      <div className="space-y-1">
        {/* Cost indicator scale */}
        {/* <div className="relative h-6 mb-2">
          <div className="absolute inset-x-0 flex items-center justify-between px-2">
            <div className="text-sm font-medium text-foreground/50">Higher Cost</div>
            <div className="text-sm font-medium text-foreground/50">Lower Cost</div>
          </div>
        </div> */}
      
        {/* Cost indicator icons */}
        <div className="relative h-5">
          {LATENCY_METADATA.markers.map((marker) => {
            const position = ((marker.value - LATENCY_METADATA.min) / 
              (LATENCY_METADATA.max - LATENCY_METADATA.min)) * 100;
            
            // Extract dollar sign count from the label if it exists
            const dollarMatch = marker.label.match(/\(\$+\)/);
            const dollars = dollarMatch ? dollarMatch[0].replace(/[()]/g, '') : '';
            
            return (
              <div 
                key={marker.value}
                className="absolute top-0"
                style={{ 
                  left: `${position}%`,
                  transform: 'translateX(-50%)',
                }}
              >
                <div className="text-foreground/70 font-medium">
                  {dollars}
                </div>
              </div>
            );
          })}
        </div>
      
        {/* The slider with background */}
        <div 
          className="pt-4 pb-2 px-2 rounded-md" 
          style={{ background: sliderBackground }}
        >
          <Slider
            min={LATENCY_METADATA.min}
            max={LATENCY_METADATA.max}
            step={LATENCY_METADATA.step}
            value={[value]}
            onValueChange={(values) => onChange(values[0])}
            className="w-full"
          />
        </div>
        
        {/* Marker labels - positioned precisely */}
        <div className="relative h-10 mt-1">
          {LATENCY_METADATA.markers.map((marker) => {
            const position = ((marker.value - LATENCY_METADATA.min) / 
              (LATENCY_METADATA.max - LATENCY_METADATA.min)) * 100;
            
            // Remove dollar signs from displayed label
            const cleanLabel = marker.label.replace(/\s*\(\$+\)/, '');
            
            return (
              <div 
                key={marker.value}
                className="absolute top-0"
                style={{ 
                  left: `${position}%`,
                  transform: 'translateX(-50%)',
                }}
              >
                <div className="flex flex-col items-center">
                  <div className="h-1.5 w-0.5 bg-muted-foreground/50 mb-1"></div>
                  <span className="text-sm whitespace-nowrap">{cleanLabel}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Regional impact calculator */}
      <Card className="mt-4">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Geographic Distribution Impact</CardTitle>
          <CardDescription>
            See how your users location affects their perceived latency
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="Same region" onValueChange={setSelectedRegion}>
            <TabsList className="grid grid-cols-4 mb-4">
              {Object.keys(LATENCY_METADATA.regionalImpact).map(region => (
                <TabsTrigger key={region} value={region}>
                  {region}
                </TabsTrigger>
              ))}
            </TabsList>
            
            <div className="text-center p-4 border rounded-md bg-muted/40">
              <div className="text-sm text-muted-foreground mb-1">Effective latency for users in this region:</div>
              <div className="text-2xl font-semibold">
                {regionalLatency}ms
                <span className="text-sm ml-2 font-normal text-muted-foreground">
                  ({LATENCY_METADATA.regionalImpact[selectedRegion]}x)
                </span>
              </div>
            </div>
          </Tabs>
        </CardContent>
      </Card>
      
      {/* Architectural implications */}
      {implications && (
        <Card className="mt-4 border-l-4" style={{ borderLeftColor: 
          value <= 100 ? "green" :
          value <= 300 ? "#22CC88" :
          value <= 500 ? "orange" : "gray"
        }}>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">{implications.description}</CardTitle>
            <CardDescription>Architectural recommendations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* <div>
                <h4 className="text-sm font-medium mb-2">Recommended approaches:</h4>
                <ul className="text-sm space-y-1">
                  {implications.recommendations.map((rec, i) => (
                    <li key={i} className="flex items-start">
                      <div className="mr-2 mt-0.5 h-1.5 w-1.5 rounded-full bg-foreground/70"></div>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div> */}
              
              <div>
                <h4 className="text-sm font-medium mb-2">Suitable for:</h4>
                <ul className="text-sm flex justify-center space-x-4">
                  {implications.suitableFor.map((app, i) => (
                    <li key={i} className="flex items-center">
                      <div className="mr-2 mt-0.5 h-1.5 w-1.5 rounded-full bg-foreground/70"></div>
                      <span>{app}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}