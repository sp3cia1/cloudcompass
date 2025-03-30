"use client";

import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ComplexityLevel } from "@/types";
import { CircleIcon, CheckIcon } from "@radix-ui/react-icons";
import { useTheme } from "@/components/theme/ThemeProvider";

// Data for complexity levels with detailed descriptions
const complexityData = [
  {
    level: ComplexityLevel.SIMPLE,
    title: "Simple",
    description: "Basic functionality with minimal features",
    details: [
      "Standard CRUD operations",
      "Single-user workflows",
      "Basic reporting",
      "Limited integrations"
    ],
    icon: <div className="flex"><CircleIcon className="h-4 w-4" /></div>,
    lightModeColor: "bg-green-100 border-green-200 text-green-950",
    darkModeColor: "dark:bg-green-950/30 dark:border-green-900 dark:text-green-200"
  },
  {
    level: ComplexityLevel.MODERATE,
    title: "Moderate",
    description: "Enhanced functionality with multiple features",
    details: [
      "Multi-step workflows",
      "Role-based permissions",
      "Advanced filtering and sorting",
      "Multiple third-party integrations"
    ],
    icon: <div className="flex"><CircleIcon className="h-4 w-4" /><CircleIcon className="h-4 w-4" /></div>,
    lightModeColor: "bg-blue-50 border-blue-200 text-blue-950",
    darkModeColor: "dark:bg-blue-950/30 dark:border-blue-900 dark:text-blue-200"
  },
  {
    level: ComplexityLevel.COMPLEX,
    title: "Complex",
    description: "Sophisticated system with advanced capabilities",
    details: [
      "Custom business logic",
      "Complex workflows and state machines",
      "Real-time updates and notifications",
      "Multiple integrated subsystems"
    ],
    icon: <div className="flex"><CircleIcon className="h-4 w-4" /><CircleIcon className="h-4 w-4" /><CircleIcon className="h-4 w-4" /></div>,
    lightModeColor: "bg-purple-50 border-purple-200 text-purple-950",
    darkModeColor: "dark:bg-purple-950/30 dark:border-purple-800 dark:text-purple-200"
  }
];

export interface ComplexitySliderProps {
  value: ComplexityLevel;
  onChange: (value: ComplexityLevel) => void;
  label?: string;
  description?: string;
  className?: string;
}

export default function ComplexitySlider({
  value,
  onChange,
  className
}: ComplexitySliderProps) {
  const { theme } = useTheme();
  
  return (
    <div className={cn("space-y-4", className)}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {complexityData.map((item) => {
          const isSelected = value === item.level;
          
          return (
            <Card 
              key={item.level}
              className={cn(
                "relative cursor-pointer transition-all border-2",
                // Use both light and dark mode classes - they'll apply automatically based on theme
                item.lightModeColor,
                item.darkModeColor,
                // Selected state styling
                isSelected ? 
                  "border-primary shadow-md dark:border-primary" : 
                  "hover:border-primary/50 hover:shadow-sm"
              )}
              onClick={() => onChange(item.level)}
              tabIndex={0}
              role="radio"
              aria-checked={isSelected}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onChange(item.level);
                }
              }}
            >
              {/* Selected indicator */}
              {isSelected && (
                <div className="absolute top-2 right-2 h-5 w-5 bg-primary rounded-full flex items-center justify-center">
                  <CheckIcon className="h-3 w-3 text-primary-foreground" />
                </div>
              )}
              
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {item.icon}
                    <CardTitle className="text-base">{item.title}</CardTitle>
                  </div>
                </div>
                <CardDescription className="mt-1 dark:text-muted-foreground">{item.description}</CardDescription>
              </CardHeader>
              
              <CardContent>
                <ul className="text-sm space-y-1 list-disc pl-4">
                  {item.details.map((detail, i) => (
                    <li key={i} className="dark:text-gray-300">{detail}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}