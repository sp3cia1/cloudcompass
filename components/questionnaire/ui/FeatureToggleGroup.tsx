"use client";

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

export default function FeatureToggleGroup({
  features,
  onChange,
  label = "Application Features",
  description = "Select the features your application requires",
  className
}: FeatureToggleGroupProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {/* Section header */}
      <div className="space-y-1">
        {/* <h3 className="text-lg font-medium">{label}</h3>
        <p className="text-sm text-muted-foreground">{description}</p> */}
      </div>
      
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
                
                {/* Toggle switch */}
                <div className="flex items-center space-x-2">
                  <Switch
                    id={`feature-${feature.id}`}
                    checked={feature.value}
                    onCheckedChange={(checked: boolean) => onChange(feature.id, checked)}
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