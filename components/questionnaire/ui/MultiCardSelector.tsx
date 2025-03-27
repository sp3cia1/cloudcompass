"use client";

import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckIcon } from "@radix-ui/react-icons";
import { CardOption as BaseCardOption} from "./CardSelector"; // Reuse the option type

// Enhanced card option with metadata support
export interface EnhancedCardOption<T> extends BaseCardOption<T> {
  metadata?: {
    costIndicator?: number;
    businessUseCase?: string;
    [key: string]: any; // Allow for future extensibility
  };
}

// Component props using the generic type
export interface MultiCardSelectorProps<T> {
  options: EnhancedCardOption<T>[];
  values: T[];
  onChange: (values: T[]) => void;
  label?: string;
  description?: string;
  maxSelections?: number;
  className?: string;
  renderCard?: (option: EnhancedCardOption<T>, isSelected: boolean) => React.ReactNode;
}

export default function MultiCardSelector<T>({
  options,
  values,
  onChange,
  label,
  description,
  maxSelections,
  className,
  renderCard, // Make sure we include the renderCard prop here
}: MultiCardSelectorProps<T>) {
  // Toggle selection handler
  const handleToggle = (option: EnhancedCardOption<T>) => {
    const isSelected = values.includes(option.value);
    
    if (isSelected) {
      // Remove item if already selected
      onChange(values.filter(val => val !== option.value));
    } else {
      // Add item if not selected (respecting maxSelections if provided)
      if (maxSelections && values.length >= maxSelections) {
        // Replace oldest selection if at max
        const newValues = [...values.slice(1), option.value];
        onChange(newValues);
      } else {
        // Add to selections
        onChange([...values, option.value]);
      }
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (option: EnhancedCardOption<T>, e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleToggle(option);
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Label and description */}
      {(label || description) && (
        <div className="space-y-1">
          {label && (
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">{label}</h3>
              {maxSelections && (
                <span className="text-sm text-muted-foreground">
                  {values.length}/{maxSelections} selected
                </span>
              )}
            </div>
          )}
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>
      )}

      {/* Card grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {options.map((option, index) => {
          const isSelected = values.includes(option.value);
          
          // Container wrapper to handle events consistently regardless of rendering method
          return (
            <div
              key={index}
              onClick={() => handleToggle(option)}
              onKeyDown={(e) => handleKeyDown(option, e)}
              tabIndex={0}
              role="checkbox"
              aria-checked={isSelected}
              className="outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary rounded-md"
            >
              {/* Use custom rendering if provided, otherwise use default rendering */}
              {renderCard ? (
                renderCard(option, isSelected)
              ) : (
                <Card
                  className={cn(
                    "relative cursor-pointer transition-all hover:border-primary/50 hover:shadow-md",
                    isSelected && "border-primary shadow-sm bg-primary/5"
                  )}
                >
                  {/* Selected indicator */}
                  {isSelected && (
                    <div className="absolute top-2 right-2 h-5 w-5 bg-primary rounded-full flex items-center justify-center">
                      <CheckIcon className="h-3 w-3 text-primary-foreground" />
                    </div>
                  )}

                  <CardHeader>
                    <div className="flex items-start gap-4">
                      {/* Icon placeholder */}
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border bg-muted/50">
                        {option.icon}
                      </div>
                      <div>
                        <CardTitle className="text-base">{option.label}</CardTitle>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <CardDescription className="h-12 line-clamp-3">
                      {option.description}
                    </CardDescription>
                  </CardContent>
                  
                  {/* Optional: Enhanced metadata display */}
                  {option.metadata && (
                    <div className="px-6 pb-4">
                      <div className="flex items-center justify-between text-sm">
                        {option.metadata.costIndicator && (
                          <span className="text-muted-foreground">
                            {"$".repeat(option.metadata.costIndicator)}
                          </span>
                        )}
                        {option.metadata.businessUseCase && (
                          <span className="text-xs text-muted-foreground italic">
                            {option.metadata.businessUseCase}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </Card>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}