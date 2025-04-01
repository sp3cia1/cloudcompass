"use client";

import { useEffect } from "react";
import { useQuestionnaireStore } from "@/lib/store/questionnaire";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import CardSelector from "../ui/CardSelector";
import LogarithmicSlider from "../ui/LogarithmicSlider";
import LatencyRequirementsSelector from "../ui/LatencyRequirementsSelector";
import { 
  TRAFFIC_PATTERNS, 
  AVAILABILITY_LEVELS,
  CONCURRENT_USERS_METADATA,
  getRecommendedPeakMultiplier,
  isAvailabilityAppropriateForTraffic,
  calculateInfrastructureTier
} from "@/lib/metadata";
import { 
  TrafficPattern,
  AvailabilityLevel
} from "@/types";
import {
  SteadyTrafficIcon,
  BusinessHoursIcon,
  VariableTrafficIcon,
  UnpredictableSpikeIcon,
  EventDrivenIcon
} from "../icons/TrafficIcons";
import {
  StandardAvailabilityIcon,
  EnhancedAvailabilityIcon,
  HighAvailabilityIcon,
  CriticalAvailabilityIcon
} from "../icons/AvailabilityIcons";

// Map icon types to components for CardSelector
const TRAFFIC_ICON_MAP = {
  'steady': <SteadyTrafficIcon />,
  'businessHours': <BusinessHoursIcon />,
  'variable': <VariableTrafficIcon />,
  'unpredictable': <UnpredictableSpikeIcon />,
  'eventDriven': <EventDrivenIcon />
};

const AVAILABILITY_ICON_MAP = {
  'standard': <StandardAvailabilityIcon />,
  'enhanced': <EnhancedAvailabilityIcon />,
  'high': <HighAvailabilityIcon />,
  'critical': <CriticalAvailabilityIcon />
};

export default function ScalingStep() {
  // Get state and update functions from store
  const { 
    scaling, 
    updateScaling 
  } = useQuestionnaireStore();
  
  // Extract current values from state
  const { 
    trafficPattern, 
    availabilityLevel, 
    expectedConcurrentUsers, 
    peakTrafficMultiplier,
    maxAcceptableLatencyMs
  } = scaling;
  
  // Derived state
  const isAvailabilityAppropriate = isAvailabilityAppropriateForTraffic(
    availabilityLevel, 
    trafficPattern
  );
  
  const infrastructureTier = calculateInfrastructureTier(
    expectedConcurrentUsers,
    availabilityLevel
  );
  
  // Update peak multiplier when traffic pattern changes
  useEffect(() => {
    const recommendedMultiplier = getRecommendedPeakMultiplier(trafficPattern);
    updateScaling('peakTrafficMultiplier', recommendedMultiplier);
  }, [trafficPattern, updateScaling]);
  
  // Event handlers
  const handleTrafficPatternChange = (pattern: TrafficPattern) => {
    updateScaling('trafficPattern', pattern);
  };
  
  const handleAvailabilityChange = (level: AvailabilityLevel) => {
    updateScaling('availabilityLevel', level);
  };
  
  const handleConcurrentUsersChange = (value: number) => {
    updateScaling('expectedConcurrentUsers', value);
  };
  
  const handleLatencyChange = (value: number) => {
    updateScaling('maxAcceptableLatencyMs', value);
  };
  
  return (
    <div className="space-y-12">
      {/* Traffic Pattern Selection */}
      <section>
        <div className="mb-6">
          <h2 className="text-2xl font-semibold tracking-tight mb-1">
            Traffic Pattern
          </h2>
          <p className="text-muted-foreground">
            Select the pattern that best describes how users will access your application
          </p>
          <Separator className="mt-2" />
        </div>
        
        <CardSelector<TrafficPattern>
          options={TRAFFIC_PATTERNS.map(pattern => ({
            value: pattern.value,
            label: pattern.label,
            description: pattern.description,
            icon: TRAFFIC_ICON_MAP[pattern.iconType]
          }))}
          value={trafficPattern}
          onChange={handleTrafficPatternChange}
        />
      </section>
      
      {/* Concurrent Users */}
      <section>
        <div className="mb-6">
          <h2 className="text-2xl font-semibold tracking-tight mb-1">
            Concurrent Users
          </h2>
          <p className="text-muted-foreground">
            Estimate the maximum number of users accessing your application simultaneously
          </p>
          <Separator className="mt-2" />
        </div>
        
        <Card className="p-6">
          <LogarithmicSlider
            min={CONCURRENT_USERS_METADATA.min}
            max={CONCURRENT_USERS_METADATA.max}
            value={expectedConcurrentUsers}
            onChange={handleConcurrentUsersChange}
            logarithmicBase={CONCURRENT_USERS_METADATA.logarithmicBase}
            markers={CONCURRENT_USERS_METADATA.markers}
            label="Concurrent Users"
            description="Expected number of simultaneous users"
            implications={CONCURRENT_USERS_METADATA.infrastructureImplications}
          />
        </Card>
      </section>
      
      {/* Availability Level */}
      <section>
        <div className="mb-6">
          <h2 className="text-2xl font-semibold tracking-tight mb-1">
            Availability Level
          </h2>
          <p className="text-muted-foreground">
            Choose the required uptime level for your application
          </p>
          <Separator className="mt-2" />
        </div>
        
        <div className="space-y-6">
          <CardSelector<AvailabilityLevel>
            options={AVAILABILITY_LEVELS.map(level => ({
              value: level.value,
              label: level.label,
              description: `${level.percentage} uptime (${level.downtimePerYear} downtime per year)`,
              icon: AVAILABILITY_ICON_MAP[level.iconType]
            }))}
            value={availabilityLevel}
            onChange={handleAvailabilityChange}
            gridClassName="lg:grid-cols-2"
          />
          
          {!isAvailabilityAppropriate && (
            <Alert variant="default" className="mt-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Availability Warning</AlertTitle>
              <AlertDescription>
                The selected availability level may be insufficient for your traffic pattern.
                Applications with {trafficPattern.toLowerCase().replace('-', ' ')} traffic
                typically require higher availability to handle usage spikes properly.
              </AlertDescription>
            </Alert>
          )}
        </div>
      </section>
      
      {/* Latency Requirements */}
      <section>
        <div className="mb-6">
          <h2 className="text-2xl font-semibold tracking-tight mb-1">
            Latency Requirements
          </h2>
          <p className="text-muted-foreground">
            Define the maximum acceptable response time for your application
          </p>
          <Separator className="mt-2" />
        </div>
        
        <Card className="p-6">
          <LatencyRequirementsSelector
            value={maxAcceptableLatencyMs}
            onChange={handleLatencyChange}
          />
        </Card>
      </section>
      
      {/* Infrastructure Recommendation Summary */}
      {/* <section>
        <div className="mb-6">
          <h2 className="text-2xl font-semibold tracking-tight mb-1">
            Infrastructure Summary
          </h2>
          <p className="text-muted-foreground">
            Based on your scaling and performance requirements
          </p>
          <Separator className="mt-2" />
        </div>
        
        <Card className="bg-primary/5 border-primary/10">
          <CardHeader>
            <CardTitle>{infrastructureTier} Infrastructure Tier</CardTitle>
            <CardDescription>
              Recommended based on your scaling parameters
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-muted-foreground">
                  Your selections indicate a need for {infrastructureTier.toLowerCase()}-level 
                  infrastructure with {availabilityLevel.toLowerCase()} availability 
                  supporting up to {expectedConcurrentUsers.toLocaleString()} concurrent users.
                </p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                <div className="space-y-1">
                  <div className="text-sm font-medium text-muted-foreground">Traffic Pattern</div>
                  <div className="text-lg font-semibold">{TRAFFIC_PATTERNS.find(p => p.value === trafficPattern)?.label}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-medium text-muted-foreground">Peak Multiplier</div>
                  <div className="text-lg font-semibold">{peakTrafficMultiplier}x</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-medium text-muted-foreground">Availability</div>
                  <div className="text-lg font-semibold">
                    {AVAILABILITY_LEVELS.find(l => l.value === availabilityLevel)?.percentage}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-medium text-muted-foreground">Max Latency</div>
                  <div className="text-lg font-semibold">{maxAcceptableLatencyMs}ms</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section> */}
      
      {/* Infrastructure Parameters Summary */}
      <section>
        <div className="mb-6">
          <h2 className="text-2xl font-semibold tracking-tight mb-1">
            Parameters Summary
          </h2>
          <p className="text-muted-foreground">
            Your infrastructure scaling configuration
          </p>
          <Separator className="mt-2" />
        </div>
        
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-1">
                <div className="text-sm font-medium text-muted-foreground">Traffic Pattern</div>
                <div className="text-lg font-semibold">{TRAFFIC_PATTERNS.find(p => p.value === trafficPattern)?.label}</div>
              </div>
              <div className="space-y-1">
                <div className="text-sm font-medium text-muted-foreground">Concurrent Users</div>
                <div className="text-lg font-semibold">{expectedConcurrentUsers.toLocaleString()}</div>
              </div>
              <div className="space-y-1">
                <div className="text-sm font-medium text-muted-foreground">Availability</div>
                <div className="text-lg font-semibold">
                  {AVAILABILITY_LEVELS.find(l => l.value === availabilityLevel)?.percentage}
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-sm font-medium text-muted-foreground">Max Latency</div>
                <div className="text-lg font-semibold">{maxAcceptableLatencyMs}ms</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}