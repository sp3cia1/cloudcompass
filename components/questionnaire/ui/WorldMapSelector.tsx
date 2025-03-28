"use client";

import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { GeographicRegion } from "@/types";
import { REGION_COLORS, getRegionInfo } from "@/lib/metadata/geographic-regions";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StarIcon, XIcon, GlobeIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useTheme } from "@/components/theme/ThemeProvider";

// Improved geographic region definitions with better SVG paths and coordinates
const GEOGRAPHIC_REGIONS = [
  {
    id: "north-america" as GeographicRegion,
    name: "North America",
    svgPath: "M 50,55 L 75,40 L 95,45 L 120,45 L 135,55 L 140,70 L 130,85 L 140,95 L 130,110 L 95,110 L 80,120 L 65,115 L 45,105 L 35,85 L 45,65 L 50,55 Z",
    centerPoint: [85, 80]
  },
  {
    id: "south-america" as GeographicRegion,
    name: "South America",
    svgPath: "M 80,125 L 95,115 L 110,125 L 115,140 L 110,160 L 100,175 L 90,190 L 80,185 L 70,165 L 75,145 L 80,125 Z",
    centerPoint: [95, 160]
  },
  {
    id: "europe" as GeographicRegion,
    name: "Europe",
    svgPath: "M 155,45 L 165,35 L 180,40 L 195,45 L 210,50 L 220,60 L 215,75 L 205,80 L 190,85 L 175,80 L 165,75 L 155,65 L 155,45 Z",
    centerPoint: [185, 70]
  },
  {
    id: "africa" as GeographicRegion,
    name: "Africa",
    svgPath: "M 155,90 L 175,85 L 195,95 L 215,100 L 225,110 L 225,130 L 210,155 L 190,175 L 170,180 L 155,170 L 145,145 L 150,120 L 155,90 Z",
    centerPoint: [185, 135]
  },
  {
    id: "asia-pacific" as GeographicRegion,
    name: "Asia-Pacific",
    // Main Asia shape
    svgPath: "M 220,40 L 250,35 L 275,40 L 300,50 L 320,65 L 330,85 L 320,105 L 300,115 L 280,105 L 260,95 L 245,85 L 230,80 L 220,70 L 220,40 Z" +
    // Australia shape (still part of Asia-Pacific region)
    " M 310,145 L 330,140 L 345,145 L 350,155 L 340,165 L 325,170 L 310,165 L 305,155 L 310,145 Z" +
    // Indonesia/Philippines archipelago suggestion
    " M 290,120 L 300,125 L 310,120 L 320,125 L 310,130 L 300,135 L 290,130 L 290,120 Z",
    centerPoint: [290, 85]
  },
  {
    id: "middle-east" as GeographicRegion,
    name: "Middle East",
    svgPath: "M 220,70 L 230,80 L 245,85 L 255,95 L 250,110 L 235,120 L 220,115 L 215,100 L 215,85 L 220,70 Z",
    centerPoint: [240, 100]
  }
];

// Add ocean background path for better context
const OCEAN_PATH = "M 0,0 L 500,0 L 500,250 L 0,250 Z";

export interface WorldMapSelectorProps {
  selectedRegions: GeographicRegion[];
  primaryRegion?: GeographicRegion | null;
  onChange: (regions: GeographicRegion[]) => void;
  onPrimaryChange: (region: GeographicRegion | null) => void;
  className?: string;
  showLabels?: boolean;
  disabled?: boolean;
}

export default function WorldMapSelector({
  selectedRegions,
  primaryRegion,
  onChange,
  onPrimaryChange,
  className,
  showLabels = true,
  disabled = false,
}: WorldMapSelectorProps) {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  // Local UI state with explicit typing
  const [hoveredRegion, setHoveredRegion] = useState<GeographicRegion | null>(null);
  const [animatingRegions, setAnimatingRegions] = useState<Record<string, boolean>>({});
  
  // Ref for tracking and cleaning up animation timeouts
  const animationTimeoutsRef = useRef<NodeJS.Timeout[]>([]);
  
  // Cleanup animation timeouts on unmount
  useEffect(() => {
    return () => {
      animationTimeoutsRef.current.forEach(clearTimeout);
    };
  }, []);

  // Trigger animation for a region with proper timeout management
  const triggerRegionAnimation = useCallback((regionId: GeographicRegion) => {
    // Set animation state
    setAnimatingRegions(prev => ({
      ...prev,
      [regionId.toString()]: true
    }));
    
    // Create timeout and store its reference
    const timeoutId = setTimeout(() => {
      setAnimatingRegions(prev => ({
        ...prev,
        [regionId.toString()]: false
      }));
    }, 300);
    
    // Store timeout ID for cleanup
    animationTimeoutsRef.current.push(timeoutId);
  }, []);

  // Toggle region selection with proper primary region handling
  const handleRegionClick = useCallback((regionId: GeographicRegion, event: React.MouseEvent) => {
    if (disabled) return;
    
    // Prevent propagation to avoid double triggers
    event.stopPropagation();
    
    // Trigger animation
    triggerRegionAnimation(regionId);
    
    // Handle selection/deselection logic
    if (selectedRegions.includes(regionId)) {
      // If this is the primary region, clear the primary first
      if (primaryRegion === regionId) {
        // Find alternative primary or set to null
        const newPrimary = selectedRegions.filter(r => r !== regionId)[0] || null;
        onPrimaryChange(newPrimary);
      }
      
      // Remove from selection
      onChange(selectedRegions.filter(r => r !== regionId));
    } else {
      // Add to selection
      const newSelectedRegions = [...selectedRegions, regionId];
      onChange(newSelectedRegions);
      
      // If this is the first region or there's no primary, make it primary
      if (newSelectedRegions.length === 1 || !primaryRegion) {
        onPrimaryChange(regionId);
      }
    }
  }, [selectedRegions, primaryRegion, onChange, onPrimaryChange, disabled, triggerRegionAnimation]);
  
  // Set primary region (must be already selected)
  const handleSetPrimary = useCallback((regionId: GeographicRegion, event: React.MouseEvent) => {
    if (disabled) return;
    
    event.stopPropagation(); // Prevent toggling selection
    
    if (selectedRegions.includes(regionId)) {
      // Trigger animation
      triggerRegionAnimation(regionId);
      
      onPrimaryChange(regionId);
    }
  }, [selectedRegions, onPrimaryChange, disabled, triggerRegionAnimation]);
  
  // Handle keyboard navigation
  const handleKeyDown = useCallback((regionId: GeographicRegion, event: React.KeyboardEvent) => {
    if (disabled) return;
    
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleRegionClick(regionId, event as unknown as React.MouseEvent);
    }
  }, [handleRegionClick, disabled]);
  
  // Get the fill color for a region based on its state
  const getRegionFill = useCallback((regionId: GeographicRegion) => {
    if (hoveredRegion === regionId) {
      return REGION_COLORS.hovered;
    }
    
    if (primaryRegion === regionId) {
      return REGION_COLORS.primary;
    }
    
    if (selectedRegions.includes(regionId)) {
      return REGION_COLORS.selected;
    }
    
    return REGION_COLORS.unselected;
  }, [hoveredRegion, primaryRegion, selectedRegions]);

  // Get the appropriate label style based on region state
  const getLabelStyle = useCallback((regionId: GeographicRegion) => {
    const isSelected = selectedRegions.includes(regionId);
    const isPrimary = primaryRegion === regionId;
    
    return {
      fontWeight: isPrimary ? 700 : isSelected ? 600 : 500, // Increased weight for better visibility
      fontSize: isPrimary ? '0.85rem' : '0.75rem',
      opacity: isSelected ? 1 : 0.9, // Increased opacity for better visibility
    };
  }, [selectedRegions, primaryRegion]);
  
  // Memoize region paths for performance
  const regionPaths = useMemo(() => {
    return GEOGRAPHIC_REGIONS.map(region => {
      const isSelected = selectedRegions.includes(region.id);
      const isPrimary = primaryRegion === region.id;
      const isHovered = hoveredRegion === region.id;
      const isAnimating = animatingRegions[region.id.toString()];
      const labelStyle = getLabelStyle(region.id);
      
      return (
        <g key={region.id}>
          {/* Region path with improved styling */}
          <path
            d={region.svgPath}
            fill={getRegionFill(region.id)}
            stroke="#fff"
            strokeWidth={isPrimary ? 2 : 1}
            className={cn(
              "transition-all duration-200 cursor-pointer",
              disabled ? "opacity-60 cursor-not-allowed" : "hover:opacity-90",
              isSelected ? "opacity-100" : "opacity-70",
              isAnimating && "scale-[1.03]",
            )}
            onClick={(e) => handleRegionClick(region.id, e)}
            onMouseEnter={() => !disabled && setHoveredRegion(region.id)}
            onMouseLeave={() => !disabled && setHoveredRegion(null)}
            onKeyDown={(e) => handleKeyDown(region.id, e)}
            tabIndex={disabled ? -1 : 0}
            aria-label={`${region.name} ${isSelected ? 'selected' : 'unselected'}${isPrimary ? ', primary region' : ''}`}
            role="button"
            aria-pressed={isSelected ? "true" : "false"}
            data-region-id={region.id}
          />
          
          {/* Selection indicator */}
          {isSelected && (
            <circle
              cx={region.centerPoint[0]}
              cy={region.centerPoint[1]}
              r={6}
              fill={isPrimary ? REGION_COLORS.primary : REGION_COLORS.selected}
              stroke="#fff"
              strokeWidth={1.5}
              className="opacity-90"
            />
          )}
          
          {/* Primary region star indicator */}
          {isPrimary && (
            <g transform={`translate(${region.centerPoint[0]}, ${region.centerPoint[1]})`}>
              <circle
                r={12}
                fill="none"
                stroke={REGION_COLORS.primary}
                strokeWidth={1.5}
                className="animate-pulse opacity-70"
              />
              <path
                d="M0,-8 L1.5,-2.5 L7.5,-2.5 L2.5,1 L4,7 L0,3.5 L-4,7 L-2.5,1 L-7.5,-2.5 L-1.5,-2.5 Z"
                fill={REGION_COLORS.primary}
                className="opacity-90"
                style={{ transform: 'scale(0.7)' }}
              />
            </g>
          )}
          
          {/* Text labels with improved positioning */}
          {showLabels && (
            <g className="pointer-events-none">
              {/* Single text element with filter for better readability */}
              <defs>
                <filter id={`glow-${region.id}`} x="-20%" y="-20%" width="140%" height="140%">
                  {/* Use stronger glow in dark mode for text */}
                  <feFlood 
                    floodColor={isDarkMode ? "#ffffff" : "currentColor"} 
                    floodOpacity={isDarkMode ? "0.3" : "0.15"} 
                    result="flood" 
                  />
                  <feComposite in="flood" in2="SourceGraphic" operator="in" result="text-comp" />
                  <feGaussianBlur in="text-comp" stdDeviation={isDarkMode ? "1.5" : "1"} result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>
              
              <text
                x={region.centerPoint[0]}
                y={region.centerPoint[1] - (isSelected ? 15 : 10)}
                textAnchor="middle"
                dominantBaseline="middle"
                filter={`url(#glow-${region.id})`}
                className={cn(
                  "select-none",
                  isSelected 
                    ? isDarkMode ? "fill-blue-100" : "fill-foreground" 
                    : isDarkMode ? "fill-gray-200" : "fill-muted-foreground"
                )}
                style={labelStyle}
              >
                {region.name}
              </text>
            </g>
          )}
        </g>
      );
    });
  }, [
    selectedRegions,
    primaryRegion,
    hoveredRegion,
    animatingRegions,
    getRegionFill,
    getLabelStyle,
    handleRegionClick,
    handleKeyDown,
    showLabels,
    disabled,
    isDarkMode
  ]);

  return (
    <Card className={cn("p-4 bg-gradient-to-b from-background to-muted/30", className)}>
      {/* Map Container with responsive aspect ratio */}
      <div className="relative w-full h-0 mb-4" style={{ paddingBottom: "50%" }}>
        <svg
          viewBox="0 0 400 200"
          className="absolute inset-0 w-full h-full"
          preserveAspectRatio="xMidYMid meet"
          aria-label="World map for region selection"
          role="graphics-document"
        >
          {/* Ocean background with subtle grid */}
          <defs>
            <linearGradient id="oceanGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#e0f2fe" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#bae6fd" stopOpacity="0.2" />
            </linearGradient>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(148,163,184,0.1)" strokeWidth="0.5" />
            </pattern>
          </defs>
          
          {/* Ocean background */}
          <rect width="400" height="200" fill="url(#oceanGradient)" />
          <rect width="400" height="200" fill="url(#grid)" />
          
          {/* World map outline for context */}
          <path 
            d={OCEAN_PATH} 
            fill="none" 
            stroke="rgba(148,163,184,0.3)" 
            strokeWidth="0.5" 
            strokeDasharray="2,2"
          />
          
          {/* Longitude/Latitude reference lines */}
          <path d="M 0,100 L 400,100" stroke="rgba(148,163,184,0.2)" strokeWidth="0.5" strokeDasharray="3,3" />
          <path d="M 200,0 L 200,200" stroke="rgba(148,163,184,0.2)" strokeWidth="0.5" strokeDasharray="3,3" />
          
          {/* Region paths and labels */}
          {regionPaths}
          
          {/* Map title */}
          <text 
            x="15" 
            y="20" 
            className="fill-muted-foreground text-xs font-medium"
          >
            Geographic Region Selection
          </text>
        </svg>
      </div>
      
      {/* Selected Region Pills */}
      <div className="space-y-2">
        <div className="text-sm font-medium pl-1 flex items-center gap-2">
          <GlobeIcon className="h-4 w-4 text-muted-foreground" />
          <span>Selected Regions</span>
          {primaryRegion && (
            <span className="text-xs text-muted-foreground">
              (★ = Primary region)
            </span>
          )}
        </div>
        
        {selectedRegions.length > 0 ? (
          <div className="flex flex-wrap gap-2 p-2 rounded-md border bg-background/70">
            {selectedRegions.map(regionId => {
              const region = getRegionInfo(regionId);
              const isPrimary = primaryRegion === regionId;
              
              if (!region) return null;
              
              return (
                <Badge 
                  key={`selection-${regionId}`}
                  variant={isPrimary ? "default" : "outline"}
                  className={cn(
                    "flex items-center gap-1 px-3 py-1.5 transition-all",
                    isPrimary ? "font-medium" : ""
                  )}
                >
                  {isPrimary && <StarIcon className="h-3 w-3 mr-0.5" />}
                  <span>{region.name}</span>
                  
                  {/* Primary star button */}
                  {!isPrimary && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 ml-1 p-0 text-muted-foreground hover:text-foreground"
                      onClick={(e) => handleSetPrimary(regionId, e)}
                      title="Set as primary region"
                      aria-label={`Set ${region.name} as primary region`}
                      disabled={disabled}
                    >
                      <StarIcon className="h-3 w-3" />
                    </Button>
                  )}
                  
                  {/* Remove button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 ml-1 p-0 text-muted-foreground hover:text-destructive"
                    onClick={(e) => handleRegionClick(regionId, e)}
                    title="Remove region"
                    aria-label={`Remove ${region.name}`}
                    disabled={disabled}
                  >
                    <XIcon className="h-3 w-3" />
                  </Button>
                </Badge>
              );
            })}
          </div>
        ) : (
          <div className="text-center p-3 text-muted-foreground text-sm border rounded-md bg-background/70">
            Click on a region on the map to select it
          </div>
        )}
      </div>
    </Card>
  );
}