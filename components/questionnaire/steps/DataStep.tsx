"use client";

import { useEffect, useMemo, useState } from "react";
import { useQuestionnaireStore } from "@/lib/store/questionnaire";
import { DataType, DataAccessPattern } from "@/types";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import MultiCardSelector from "../ui/MultiCardSelector";
import CardSelector from "../ui/CardSelector";
import LogarithmicSlider from "../ui/LogarithmicSlider";
import { 
  DATA_TYPES, 
  DATA_ACCESS_PATTERNS, 
  STORAGE_SIZE_METADATA,
  DATA_RETENTION_PERIODS 
} from "@/lib/metadata/data-types";
import { 
  RelationalDataIcon,
  DocumentDataIcon,
  KeyValueDataIcon,
  GraphDataIcon,
  TimeSeriesDataIcon,
  BlobDataIcon,
  StreamDataIcon 
} from "../icons/DataIcons";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

// Map icon types to actual icon components
const DATA_ICON_MAP: Record<string, React.ReactNode> = {
  'relational': <RelationalDataIcon />,
  'document': <DocumentDataIcon />,
  'keyValue': <KeyValueDataIcon />,
  'graph': <GraphDataIcon />,
  'timeSeries': <TimeSeriesDataIcon />,
  'blob': <BlobDataIcon />,
  'file': <BlobDataIcon />, // Using BlobDataIcon for file as well
  'multimedia': <BlobDataIcon />, // Using BlobDataIcon for multimedia as well
  'stream': <StreamDataIcon />
};

// Info card component for advantages and limitations
const InfoCard = ({ 
  advantages, 
  limitations, 
  title 
}: { 
  advantages: string[], 
  limitations: string[], 
  title: string 
}) => {
  return (
    <div className="w-full max-w-md">
      <h4 className="font-medium text-base mb-3">{title}</h4>
      
      <Tabs defaultValue="advantages" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-2">
          <TabsTrigger value="advantages">Advantages</TabsTrigger>
          <TabsTrigger value="limitations">Limitations</TabsTrigger>
        </TabsList>
        
        <TabsContent value="advantages" className="max-h-48 overflow-y-auto">
          <ul className="space-y-2 text-sm">
            {advantages.map((adv, i) => (
              <li key={`adv-${i}`} className="flex items-start">
                <div className="mr-2 mt-1.5 h-1 w-1 rounded-full bg-primary"></div>
                <span>{adv}</span>
              </li>
            ))}
          </ul>
        </TabsContent>
        
        <TabsContent value="limitations" className="max-h-48 overflow-y-auto">
          <ul className="space-y-2 text-sm">
            {limitations.map((lim, i) => (
              <li key={`lim-${i}`} className="flex items-start">
                <div className="mr-2 mt-1.5 h-1 w-1 rounded-full bg-primary"></div>
                <span>{lim}</span>
              </li>
            ))}
          </ul>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default function DataStep() {
  // Connect to the questionnaire state store
  const { data, updateData } = useQuestionnaireStore();
  
  // Extract current values from state
  const { 
    dataTypes,
    dataAccessPattern,
    estimatedStorageGB,
    dataRetentionPeriodDays
  } = data;
  
  // Convert data types metadata to enhanced card options
  const dataTypeOptions = useMemo(() => {
    return DATA_TYPES.map(type => ({
      value: type.value,
      label: type.label,
      description: type.description,
      icon: DATA_ICON_MAP[type.iconType] || null,
      metadata: {
        costIndicator: type.costIndicator,
        idealFor: type.idealFor,
        advantages: type.advantages,
        limitations: type.limitations
      }
    }));
  }, []);
  
  // Handle data type selection changes
  const handleDataTypesChange = (types: DataType[]) => {
    updateData('dataTypes', types);
  };
  
  // Handle access pattern selection
  const handleAccessPatternChange = (pattern: DataAccessPattern) => {
    updateData('dataAccessPattern', pattern);
  };
  
  // Handle storage size changes
  const handleStorageSizeChange = (size: number) => {
    updateData('estimatedStorageGB', size);
  };
  
  // Handle retention period changes
  const handleRetentionPeriodChange = (days: number) => {
    updateData('dataRetentionPeriodDays', days);
  };
  
  // Create custom card renderer for MultiCardSelector
  const renderDataTypeCard = (option: any, isSelected: boolean) => {
    const metadata = option.metadata;
    
    return (
      <Card
        className={`cursor-pointer transition-all hover:border-primary/50 hover:shadow-md flex flex-col h-76 ${
          isSelected ? "border-primary shadow-sm bg-primary/5" : ""
        }`}
      >
        <CardHeader className="pb-2">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border bg-muted/50">
              {option.icon}
            </div>
            <div>
              <CardTitle className="text-base">{option.label}</CardTitle>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="flex-1">
          <CardDescription className="mb-4">
            {option.description}
          </CardDescription>
          
          {/* Show IdealFor directly on card */}
          {metadata.idealFor && metadata.idealFor.length > 0 && (
            <div className="mt-2">
              <p className="text-xs font-medium text-muted-foreground mb-1">
                Ideal for:
              </p>
              <ul className="flex text-xs space-x-1">
                {metadata.idealFor.map((item: string, i: number) => (
                  <li key={i} className="flex items-start">
                    <div className="mr-1.5 mt-1 h-1 w-1 rounded-full bg-primary"></div>
                    <span>{item}</span>
                  </li>
                ))}
                {/* {metadata.idealFor.length > 2 && (
                  <li className="text-xs text-muted-foreground">
                    + {metadata.idealFor.length - 2} more
                  </li>
                )} */}
              </ul>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-between pt-0">
          <span className="text-muted-foreground">
            {"$".repeat(metadata.costIndicator)}
          </span>
          
          {/* Info button to show advantages/limitations */}
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                className="rounded-full p-1 hover:bg-muted flex items-center justify-center"
                onClick={(e) => e.stopPropagation()}
              >
                <InfoCircledIcon className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-80">
              <InfoCard 
                advantages={metadata.advantages} 
                limitations={metadata.limitations}
                title={option.label}
              />
            </PopoverContent>
          </Popover>
        </CardFooter>
      </Card>
    );
  };
  
  return (
    <div className="space-y-12">
      {/* Data Type Selection */}
      <section>
        <div className="mb-6">
          <h2 className="text-2xl font-semibold tracking-tight mb-1">
            Data Organization
          </h2>
          <p className="text-muted-foreground">
            Select the types of data your application will store and manage
          </p>
          <Separator className="mt-2" />
        </div>
        
        <div className="space-y-6">
          <MultiCardSelector<DataType>
            options={dataTypeOptions}
            values={dataTypes}
            onChange={handleDataTypesChange}
            label="Select all that apply to your application"
            renderCard={renderDataTypeCard}
          />
        </div>
      </section>
      
      {/* Data Access Pattern */}
      <section>
        <div className="mb-6">
          <h2 className="text-2xl font-semibold tracking-tight mb-1">
            Data Access Pattern
          </h2>
          <p className="text-muted-foreground">
            How will your application primarily interact with the data?
          </p>
          <Separator className="mt-2" />
        </div>
        
        {/* Fixed grid layout with 2x2 pattern */}
        <div className="grid grid-cols-2 gap-4">
          {DATA_ACCESS_PATTERNS.map(pattern => {
            const isSelected = dataAccessPattern === pattern.value;
            return (
              <Card 
                key={pattern.value}
                className={`cursor-pointer transition-all hover:border-primary/50 hover:shadow-md ${
                  isSelected ? 'border-primary bg-primary/5' : ''
                }`}
                onClick={() => handleAccessPatternChange(pattern.value)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border bg-muted/50">
                      <div className="relative">
                        {pattern.visualType === 'readHeavy' && (
                          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M2 12h15M17 7l5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M6 17l-3-5 3-5" strokeLinecap="round" strokeLinejoin="round" opacity="0.3" />
                          </svg>
                        )}
                        {pattern.visualType === 'writeHeavy' && (
                          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M22 12H7M7 7l-5 5 5 5" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M18 17l3-5-3-5" strokeLinecap="round" strokeLinejoin="round" opacity="0.3" />
                          </svg>
                        )}
                        {pattern.visualType === 'balanced' && (
                          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M7 7l-5 5 5 5M17 7l5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                        {pattern.visualType === 'bursty' && (
                          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M2 12h6M16 12h6M9 6v12M15 6v12" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M8 16l1-4 1 8 2-12 1 8 1-4" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </div>
                    </div>
                    <div>
                      <CardTitle className="text-base">{pattern.label}</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="h-auto text-xs">
                    {pattern.description}
                  </CardDescription>
                  <div className="mt-3">
                    <p className="text-xs font-medium text-muted-foreground mb-1">
                      Common in:
                    </p>
                    <div className="flex flex-wrap gap-1 text-xs">
                      {pattern.businessScenarios.slice(0, 2).map((scenario, i) => (
                        <Badge key={i} variant="outline" className="font-normal text-[10px]">
                          {scenario}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>
      
      {/* Storage Size Estimation */}
      <section>
        <div className="mb-6">
          <h2 className="text-2xl font-semibold tracking-tight mb-1">
            Storage Size
          </h2>
          <p className="text-muted-foreground">
            Estimate the total amount of data your application will store
          </p>
          <Separator className="mt-2" />
        </div>
        
        <Card className="p-6">
          <LogarithmicSlider
            min={STORAGE_SIZE_METADATA.min}
            max={STORAGE_SIZE_METADATA.max}
            value={estimatedStorageGB}
            onChange={handleStorageSizeChange}
            logarithmicBase={STORAGE_SIZE_METADATA.logarithmicBase}
            markers={STORAGE_SIZE_METADATA.markers}
            label="Estimated Storage"
            description="Total data storage needs for your application"
            valueDisplay={(value) => `${value} GB`}
            implications={STORAGE_SIZE_METADATA.infrastructureImplications}
          />
        </Card>
      </section>
      
      {/* Data Retention */}
      <section>
        <div className="mb-6">
          <h2 className="text-2xl font-semibold tracking-tight mb-1">
            Data Retention
          </h2>
          <p className="text-muted-foreground">
            How long will you need to keep your data?
          </p>
          <Separator className="mt-2" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {DATA_RETENTION_PERIODS.map((period) => {
            const isSelected = dataRetentionPeriodDays === period.value;
            return (
              <Card 
                key={period.value}
                className={`cursor-pointer transition-all hover:border-primary/50 hover:shadow-md ${
                  isSelected ? 'border-primary bg-primary/5' : ''
                }`}
                onClick={() => handleRetentionPeriodChange(period.value)}
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-base">{period.label}</CardTitle>
                    <span className="text-muted-foreground">
                      {"$".repeat(period.costIndicator)}
                    </span>
                  </div>
                  <CardDescription>{period.description}</CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </section>
      
      {/* Data Selection Summary (replacing cost estimation) */}
      {dataTypes.length > 0 && dataAccessPattern && estimatedStorageGB > 0 && dataRetentionPeriodDays > 0 && (
        <section>
          <div className="mb-6">
            <h2 className="text-2xl font-semibold tracking-tight mb-1">
              Your Data Selections
            </h2>
            <p className="text-muted-foreground">
              Summary of your data management configuration
            </p>
            <Separator className="mt-2" />
          </div>
          
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <div className="text-sm font-medium text-muted-foreground">Data Types</div>
                  <div>
                    {dataTypes.length === 0 ? (
                      <span className="text-sm">None selected</span>
                    ) : (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {dataTypes.map(type => {
                          const typeInfo = DATA_TYPES.find(t => t.value === type);
                          return (
                            <Badge key={type} variant="outline" className="text-xs">
                              {typeInfo?.label}
                            </Badge>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-medium text-muted-foreground">Access Pattern</div>
                  <div className="text-base">
                    {DATA_ACCESS_PATTERNS.find(p => p.value === dataAccessPattern)?.label || "Not selected"}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-medium text-muted-foreground">Storage Size</div>
                  <div className="text-base">{estimatedStorageGB} GB</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-medium text-muted-foreground">Retention Period</div>
                  <div className="text-base">
                    {DATA_RETENTION_PERIODS.find(r => r.value === dataRetentionPeriodDays)?.label || "Not selected"}
                  </div>
                </div>
              </div>
              
              <div className="mt-6 text-sm">
                <p className="text-muted-foreground">
                  These selections will help determine the optimal cloud infrastructure for your data requirements.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>
      )}
    </div>
  );
}