"use client";

import { memo, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export interface FeatureToggle {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  value: boolean;
}

export interface FeatureToggleGroupProps {
  features: FeatureToggle[];
  onChange: (id: string, value: boolean) => void;
  label?: string;
  description?: string;
  className?: string;
}

// Memoized switch component to prevent infinite rerenders
const FeatureSwitch = memo(({ 
  id, 
  checked, 
  onToggle 
}: { 
  id: string; 
  checked: boolean; 
  onToggle: (id: string, checked: boolean) => void; 
}) => {
  // Create stable callback that doesn't change on rerenders
  // const handleCheckedChange = useCallback((newChecked: boolean) => {
  //   onToggle(id, newChecked);
  // }, [id, onToggle]);

  return (
    <Switch
      id={id}
      checked={checked}
      onCheckedChange={(newChecked) => onToggle(id, newChecked)}
    />
  );
});
FeatureSwitch.displayName = "FeatureSwitch";

export default function FeatureToggleGroup({
  features,
  onChange,
  label = "Application Features",
  description = "Select the features your application requires",
  className
}: FeatureToggleGroupProps) {
  // Create a stable onChange handler
  const handleToggle = useCallback((id: string, checked: boolean) => {
    // Extract the original ID without the "feature-" prefix
    const originalId = id.startsWith("feature-") ? id.substring(8) : id;
    onChange(originalId, checked);
  }, [onChange]);

  return (
    <div className={cn("space-y-4", className)}>
      {/* Section header */}
      {/* <div className="space-y-1"> */}
        {/* <h3 className="text-lg font-medium">{label}</h3>
        <p className="text-sm text-muted-foreground">{description}</p> */}
      {/* </div> */}
      
      {/* Feature cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {features.map((feature) => (
          <Card 
            key={feature.id}
            className={cn(
              "transition-all hover:shadow-sm",
              feature.value && "bg-primary/5 border-primary/50"
            )}
          >
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {/* Feature icon */}
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border bg-muted/50">
                    {feature.icon}
                  </div>
                  
                  <div>
                    <CardTitle className="text-base">{feature.label}</CardTitle>
                  </div>
                </div>
                
                {/* Toggle switch - Now using memoized component */}
                <div className="flex items-center space-x-2">
                  <FeatureSwitch
                    id={`feature-${feature.id}`}
                    checked={feature.value}
                    onToggle={handleToggle}
                  />
                </div>
              </div>
              
              {/* Feature description */}
              <CardDescription className="mt-2">
                {feature.description}
              </CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}