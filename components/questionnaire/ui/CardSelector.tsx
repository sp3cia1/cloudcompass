"use client";


import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckIcon } from "@radix-ui/react-icons";

// Define the option interface with generics to support different value types
export interface CardOption<T> {
  value: T;
  label: string;
  description: string;
  icon: React.ReactNode;
}

// Main component props using the generic type
export interface CardSelectorProps<T> {
  options: CardOption<T>[];
  value: T;
  onChange: (value: T) => void;
  label?: string;
  description?: string;
  className?: string;
  gridClassName?: string;
}

export default function CardSelector<T>({
  options,
  value,
  onChange,
  label,
  description,
  className,
  gridClassName,
}: CardSelectorProps<T>) {
  // Handle keyboard navigation
  const handleKeyDown = (option: CardOption<T>, e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onChange(option.value);
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Label and description */}
      {(label || description) && (
        <div className="space-y-1">
          {label && <h3 className="text-lg font-medium">{label}</h3>}
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>
      )}

      {/* Card grid */}
      <div className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", 
        gridClassName
      )}>
        {options.map((option, index) => {
          const isSelected = option.value === value;
          return (
            <Card
              key={index}
              className={cn(
                "relative cursor-pointer transition-all hover:border-primary/50 hover:shadow-md",
                isSelected && "border-primary shadow-sm bg-primary/5"
              )}
              onClick={() => onChange(option.value)}
              onKeyDown={(e) => handleKeyDown(option, e)}
              tabIndex={0}
              role="radio"
              aria-checked={isSelected}
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
            </Card>
          );
        })}
      </div>
    </div>
  );
}