"use client";

import { useEffect, useState, useMemo } from "react";
import { useQuestionnaireStore } from "@/lib/store/questionnaire";
import { GeographicRegion } from "@/types";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import { AlertTriangle, Info, Check, X } from "lucide-react";
import WorldMapSelector from "../ui/WorldMapSelector";
import RegionDistribution from "../ui/RegionDistribution";
import { calculateMultiRegionImpact, getRegionInfo } from "@/lib/metadata/geographic-regions";

export default function GeographicStep() {
  // Connect to the questionnaire state store
  const { geographic, updateGeographic } = useQuestionnaireStore();
  
  // Extract current values from state
  const { 
    targetRegions,
    primaryRegion,
    requiresMultiRegion,
    userDistribution
  } = geographic;

  // Track distribution updates and prevent feedback loops
  const [isInitialRender, setIsInitialRender] = useState(true);
  const [isDistributionUpdating, setIsDistributionUpdating] = useState(false);
  
  // Calculate multi-region deployment impact
  const deploymentImpact = useMemo(() => {
    return calculateMultiRegionImpact(targetRegions, userDistribution);
  }, [targetRegions, userDistribution]);

  // Handle region selection changes
  const handleRegionsChange = (regions: GeographicRegion[]) => {
    updateGeographic('targetRegions', regions);
    
    // If all regions were deselected, reset primary region and distribution
    if (regions.length === 0) {
      updateGeographic('primaryRegion', null as unknown as GeographicRegion);
      
      // Reset user distribution
      const resetDistribution = Object.fromEntries(
        Object.keys(userDistribution).map(key => [key, 0])
      ) as Record<GeographicRegion, number>;
      
      // Mark as updating to prevent distribution effect from running
      setIsDistributionUpdating(true);
      updateGeographic('userDistribution', resetDistribution);
      setTimeout(() => setIsDistributionUpdating(false), 0);
      return;
    }
    
    // If primary region was deselected, set a new one
    if (!regions.includes(primaryRegion) && regions.length > 0) {
      updateGeographic('primaryRegion', regions[0]);
    }
  };
  
  // Handle primary region change
  const handlePrimaryRegionChange = (region: GeographicRegion | null) => {
    if (region) {
      updateGeographic('primaryRegion', region);
    }
  };
  
  // Handle distribution change
  const handleDistributionChange = (newDistribution: Record<GeographicRegion, number>) => {
    setIsDistributionUpdating(true);
    updateGeographic('userDistribution', newDistribution);
    setTimeout(() => setIsDistributionUpdating(false), 0);
  };
  
  // Custom toggle implementation that avoids the problematic Switch component
  const handleMultiRegionToggle = () => {
    // Toggle the state
    const newEnabled = !requiresMultiRegion;
    
    // Mark as updating to prevent effect from running
    setIsDistributionUpdating(true);
    
    // Update the toggle state
    updateGeographic('requiresMultiRegion', newEnabled);
    
    // If disabling multi-region, reset distribution to primary region
    if (!newEnabled && primaryRegion) {
      // Create reset distribution with 100% in primary
      const singleRegionDistribution = Object.fromEntries(
        Object.keys(userDistribution).map(key => {
          const region = Number(key) as unknown as GeographicRegion;
          return [key, region === primaryRegion ? 100 : 0];
        })
      ) as Record<GeographicRegion, number>;
      
      updateGeographic('userDistribution', singleRegionDistribution);
    }
    
    // Reset the update flag after this render cycle
    setTimeout(() => setIsDistributionUpdating(false), 0);
  };
  
  // Distribution validation and cleanup effect
  useEffect(() => {
    // Skip if no regions selected or during updates
    if (targetRegions.length === 0 || isDistributionUpdating) return;
    
    // Skip initial render
    if (isInitialRender) {
      setIsInitialRender(false);
      return;
    }
    
    // Validate distribution and apply constraints
    let needsUpdate = false;
    const updatedDistribution = { ...userDistribution };
    
    // 1. Clear allocation for unselected regions
    Object.keys(updatedDistribution).forEach(key => {
      const region = Number(key) as unknown as GeographicRegion;
      if (!targetRegions.includes(region) && updatedDistribution[region] > 0) {
        updatedDistribution[region] = 0;
        needsUpdate = true;
      }
    });
    
    // 2. Ensure primary region has allocation when selected
    if (primaryRegion && targetRegions.includes(primaryRegion)) {
      if (!updatedDistribution[primaryRegion] || updatedDistribution[primaryRegion] === 0) {
        updatedDistribution[primaryRegion] = 100;
        needsUpdate = true;
      }
    }
    
    // Only update if needed
    if (needsUpdate) {
      setIsDistributionUpdating(true);
      setTimeout(() => {
        updateGeographic('userDistribution', updatedDistribution);
        setIsDistributionUpdating(false);
      }, 0);
    }
  }, [targetRegions, primaryRegion, userDistribution, updateGeographic, isInitialRender, isDistributionUpdating]);
  
  // Render multi-region impact metrics
  const renderImpactMetrics = () => {
    if (!requiresMultiRegion || targetRegions.length <= 1) {
      return (
        <div className="p-6 text-center text-muted-foreground">
          <div className="flex justify-center mb-4">
            <InfoCircledIcon className="h-12 w-12 opacity-50" />
          </div>
          <p className="mb-2">Enable multi-region deployment to see impact metrics.</p>
          <p className="text-sm">Multi-region deployments improve latency and reliability but increase cost and complexity.</p>
        </div>
      );
    }
    
    return (
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {/* Latency Improvement */}
        <Card className="overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Latency</CardTitle>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-green-500">
                -{deploymentImpact.latencyImprovement}%
              </span>
              <span className="text-xs text-muted-foreground">Global average</span>
            </div>
          </CardContent>
          <div className="h-2 bg-green-100">
            <div 
              className="h-full bg-green-500 transition-all duration-500" 
              style={{ width: `${deploymentImpact.latencyImprovement}%` }}
            />
          </div>
        </Card>
        
        {/* Cost Impact */}
        <Card className="overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Cost</CardTitle>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-amber-500">
                +{deploymentImpact.costIncrease}%
              </span>
              <span className="text-xs text-muted-foreground">Infrastructure cost</span>
            </div>
          </CardContent>
          <div className="h-2 bg-amber-100">
            <div 
              className="h-full bg-amber-500 transition-all duration-500" 
              style={{ width: `${deploymentImpact.costIncrease}%` }}
            />
          </div>
        </Card>
        
        {/* Reliability Improvement */}
        <Card className="overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Reliability</CardTitle>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-blue-500">
                +{deploymentImpact.reliabilityImprovement.toFixed(1)}%
              </span>
              <span className="text-xs text-muted-foreground">Availability</span>
            </div>
          </CardContent>
          <div className="h-2 bg-blue-100">
            <div 
              className="h-full bg-blue-500 transition-all duration-500" 
              style={{ width: `${deploymentImpact.reliabilityImprovement}%` }}
            />
          </div>
        </Card>
        
        {/* Complexity Impact */}
        <Card className="overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Complexity</CardTitle>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-purple-500">
                +{deploymentImpact.complexityIncrease}%
              </span>
              <span className="text-xs text-muted-foreground">Operational overhead</span>
            </div>
          </CardContent>
          <div className="h-2 bg-purple-100">
            <div 
              className="h-full bg-purple-500 transition-all duration-500" 
              style={{ width: `${deploymentImpact.complexityIncrease}%` }}
            />
          </div>
        </Card>
      </div>
    );
  };
  
  // Render selected regions summary
  const renderRegionsSummary = () => {
    if (targetRegions.length === 0) return null;
    
    return (
      <div className="flex flex-wrap gap-2 mt-4">
        {targetRegions.map(regionId => {
          const region = getRegionInfo(regionId);
          const isPrimary = primaryRegion === regionId;
          
          return (
            <Badge 
              key={regionId}
              variant={isPrimary ? "default" : "outline"}
              className="px-3 py-1.5"
            >
              {region?.name} {isPrimary && "(Primary)"}
            </Badge>
          );
        })}
      </div>
    );
  };
  
  return (
    <div className="space-y-12">
      {/* Region Selection */}
      <section>
        <div className="mb-6">
          <h2 className="text-2xl font-semibold tracking-tight mb-1">
            Target Regions
          </h2>
          <p className="text-muted-foreground">
            Select the geographic regions where your application will be deployed
          </p>
          <Separator className="mt-2" />
        </div>
        
        <Card>
          <CardContent className="p-6">
            <WorldMapSelector
              selectedRegions={targetRegions}
              primaryRegion={primaryRegion}
              onChange={handleRegionsChange}
              onPrimaryChange={handlePrimaryRegionChange}
              className="mb-4"
            />
            
            {renderRegionsSummary()}
            
            {targetRegions.length === 0 && (
              <Alert variant="default" className="mt-4">
                <Info className="h-4 w-4" />
                <AlertTitle>No regions selected</AlertTitle>
                <AlertDescription>
                  Click on the map to select the regions where your application will be deployed.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </section>
      
      {/* Multi-region Configuration - REDESIGNED */}
      <section>
        <div className="mb-6">
          <h2 className="text-2xl font-semibold tracking-tight mb-1">
            Multi-Region Configuration
          </h2>
          <p className="text-muted-foreground">
            Configure advanced deployment options across multiple regions
          </p>
          <Separator className="mt-2" />
        </div>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="multi-region-toggle" className="text-base font-medium">
                  Multi-Region Deployment
                </Label>
                <p className="text-sm text-muted-foreground">
                  Deploy your application across multiple regions for improved performance and reliability
                </p>
              </div>
              
              {/* Custom toggle button instead of Switch component */}
              <Button
                id="multi-region-toggle"
                onClick={handleMultiRegionToggle}
                disabled={targetRegions.length <= 1}
                variant={requiresMultiRegion ? "default" : "outline"}
                className="relative px-8 h-9 min-w-[80px]"
                aria-pressed={requiresMultiRegion}
              >
                {requiresMultiRegion ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    <span>Enabled</span>
                  </>
                ) : (
                  <>
                    <X className="h-4 w-4 mr-2" />
                    <span>Disabled</span>
                  </>
                )}
              </Button>
            </div>
            
            {targetRegions.length <= 1 && (
              <Alert variant="default" className="mt-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Select Multiple Regions</AlertTitle>
                <AlertDescription>
                  You need to select at least two regions to enable multi-region deployment.
                </AlertDescription>
              </Alert>
            )}
            
            {targetRegions.length > 0 && targetRegions.length <= 1 && requiresMultiRegion && (
              <Alert variant="destructive" className="mt-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Multi-Region Disabled</AlertTitle>
                <AlertDescription>
                  Multi-region deployment is disabled because you have only selected one region.
                </AlertDescription>
              </Alert>
            )}
            
            {targetRegions.length >= 2 && requiresMultiRegion && (
              <div className="mt-6 space-y-4">
                <div className="flex flex-col space-y-1.5">
                  <h3 className="text-base font-medium">Deployment Impact</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    How multi-region deployment affects your application
                  </p>
                </div>
                
                {renderImpactMetrics()}
              </div>
            )}
          </CardContent>
        </Card>
      </section>
      
      {/* User Distribution */}
      {targetRegions.length > 0 && (
        <section>
          <div className="mb-6">
            <h2 className="text-2xl font-semibold tracking-tight mb-1">
              User Distribution
            </h2>
            <p className="text-muted-foreground">
              Define how your users are distributed across geographic regions
            </p>
            <Separator className="mt-2" />
          </div>
          
          <RegionDistribution
            selectedRegions={targetRegions}
            distribution={userDistribution}
            onChange={handleDistributionChange}
            disabled={!requiresMultiRegion && targetRegions.length > 1}
          />
          
          {!requiresMultiRegion && targetRegions.length > 1 && (
            <div className="mt-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <InfoCircledIcon className="h-4 w-4" />
                <span>
                  Enable multi-region deployment to customize user distribution.
                </span>
              </div>
            </div>
          )}
        </section>
      )}
      
      {/* Recommendations based on selection */}
      {/* {targetRegions.length > 0 && (
        <section>
          <div className="mb-6">
            <h2 className="text-2xl font-semibold tracking-tight mb-1">
              Regional Insights
            </h2>
            <p className="text-muted-foreground">
              Optimization recommendations based on your geographic selections
            </p>
            <Separator className="mt-2" />
          </div>
          
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="pt-6 pb-6">
              <div className="space-y-4">
                {primaryRegion && getRegionInfo(primaryRegion) && (
                  <div>
                    <h3 className="text-base font-medium mb-1">Primary Region: {getRegionInfo(primaryRegion)?.name}</h3>
                    <p className="text-sm mb-2">{getRegionInfo(primaryRegion)?.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                      <div>
                        <h4 className="text-sm font-medium mb-1">Availability Zones</h4>
                        <p className="text-sm text-muted-foreground">
                          {getRegionInfo(primaryRegion)?.availabilityZones} availability zones
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium mb-1">Cost Tier</h4>
                        <p className="text-sm text-muted-foreground">
                          {"$".repeat(getRegionInfo(primaryRegion)?.costTier || 0)} 
                          ({getRegionInfo(primaryRegion)?.costTier}/5)
                        </p>
                      </div>
                    </div>
                    
                    <div className="mt-3">
                      <h4 className="text-sm font-medium mb-1">Recommended Workloads</h4>
                      <div className="flex flex-wrap gap-1.5">
                        {getRegionInfo(primaryRegion)?.recommendedForWorkloads.map((workload, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {workload}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                
                {requiresMultiRegion && targetRegions.length > 1 && (
                  <div className="mt-4 pt-4 border-t">
                    <h3 className="text-base font-medium mb-1">Multi-Region Recommendations</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2 text-sm">
                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary shrink-0"></span>
                        <span>Use Global Load Balancing to direct users to the nearest region</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm">
                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary shrink-0"></span>
                        <span>Implement data replication strategies to maintain consistency across regions</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm">
                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary shrink-0"></span>
                        <span>Consider region-specific compliance requirements for data storage</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm">
                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary shrink-0"></span>
                        <span>Use managed database services with cross-region replication capabilities</span>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </section>
      )} */}
    </div>
  );
}