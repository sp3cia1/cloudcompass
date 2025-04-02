import React, { useState, useCallback, useMemo } from 'react';
import { EdgeProps, getBezierPath, EdgeLabelRenderer, useReactFlow, MarkerType } from 'reactflow';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { CloudProvider } from '@/lib/store/applicationState';
import { ConnectionType } from '@/types/architecture';
import { 
  AlertTriangle, Zap, Server, Database, Globe, Network, ArrowUpDown, 
  Trash2, ActivitySquare, MessageSquare, Lock
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';

// Provider-specific styling
const providerEdgeStyles: Record<CloudProvider, { 
  stroke: string, 
  selectedStroke: string,
  hoverStroke: string,
  animationColor: string,
  gradientStart: string,
  gradientEnd: string
}> = {
  aws: {
    stroke: '#f97316', // orange-500
    selectedStroke: '#ea580c', // orange-600
    hoverStroke: '#fb923c', // orange-400
    animationColor: 'rgba(249, 115, 22, 0.8)', // orange-500 with opacity
    gradientStart: '#f97316', // orange-500
    gradientEnd: '#fbbf24' // amber-400
  },
  azure: {
    stroke: '#3b82f6', // blue-500
    selectedStroke: '#2563eb', // blue-600
    hoverStroke: '#60a5fa', // blue-400
    animationColor: 'rgba(59, 130, 246, 0.8)', // blue-500 with opacity
    gradientStart: '#3b82f6', // blue-500
    gradientEnd: '#818cf8' // indigo-400
  },
  gcp: {
    stroke: '#ef4444', // red-500
    selectedStroke: '#dc2626', // red-600
    hoverStroke: '#f87171', // red-400
    animationColor: 'rgba(239, 68, 68, 0.8)', // red-500 with opacity
    gradientStart: '#ef4444', // red-500
    gradientEnd: '#f97316' // orange-500
  },
  firebase: {
    stroke: '#f59e0b', // amber-500
    selectedStroke: '#d97706', // amber-600
    hoverStroke: '#fbbf24', // amber-400
    animationColor: 'rgba(245, 158, 11, 0.8)', // amber-500 with opacity
    gradientStart: '#f59e0b', // amber-500
    gradientEnd: '#f97316' // orange-500
  },
  digitalocean: {
    stroke: '#06b6d4', // cyan-500
    selectedStroke: '#0891b2', // cyan-600
    hoverStroke: '#22d3ee', // cyan-400
    animationColor: 'rgba(6, 182, 212, 0.8)', // cyan-500 with opacity
    gradientStart: '#06b6d4', // cyan-500
    gradientEnd: '#3b82f6' // blue-500
  }
};

// Fix: Align with the ConnectionType enum from architecture.ts
const connectionTypeStyles: Record<string, { 
  icon: React.ReactNode, 
  label: string,
  strokeWidth: number,
  strokeDasharray: string | null,
  animationSpeed: number,
  showArrowhead: boolean
}> = {
  [ConnectionType.NETWORK]: {
    icon: <Network className="h-3 w-3" />,
    label: 'Network',
    strokeWidth: 2,
    strokeDasharray: null,
    animationSpeed: 0.8,
    showArrowhead: true
  },
  [ConnectionType.DATA_FLOW]: {
    icon: <Database className="h-3 w-3" />,
    label: 'Data Flow',
    strokeWidth: 3,
    strokeDasharray: null,
    animationSpeed: 1,
    showArrowhead: true
  },
  [ConnectionType.DEPENDENCY]: {
    icon: <Server className="h-3 w-3" />,
    label: 'Dependency',
    strokeWidth: 2,
    strokeDasharray: '5,5',
    animationSpeed: 0,
    showArrowhead: true
  },
  [ConnectionType.EVENT]: {
    icon: <MessageSquare className="h-3 w-3" />,
    label: 'Event',
    strokeWidth: 2.5,
    strokeDasharray: '3,2',
    animationSpeed: 1.2,
    showArrowhead: true
  },
  [ConnectionType.AUTHENTICATION]: {
    icon: <Lock className="h-3 w-3" />,
    label: 'Authentication',
    strokeWidth: 2,
    strokeDasharray: '10,5',
    animationSpeed: 0.6,
    showArrowhead: true
  },
  // Adding special display styles that don't match enum for visualization flexibility
  'high-traffic': {
    icon: <Zap className="h-3 w-3" />,
    label: 'High Traffic',
    strokeWidth: 4,
    strokeDasharray: null,
    animationSpeed: 1.5,
    showArrowhead: true
  },
  'bidirectional': {
    icon: <ArrowUpDown className="h-3 w-3" />,
    label: 'Bidirectional',
    strokeWidth: 2.5,
    strokeDasharray: null,
    animationSpeed: 0.9,
    showArrowhead: true
  }
};

export interface BaseEdgeData {
  provider?: CloudProvider;
  type?: ConnectionType;
  label?: string;
  hasError?: boolean;
  errorMessage?: string;
  isBidirectional?: boolean;
  bandwidth?: {
    amount: number;
    unit: 'Kbps' | 'Mbps' | 'Gbps';
  };
  latency?: {
    amount: number;
    unit: 'ms';
  };
  monthlyCost?: {
    amount: number;
    currency: 'USD';
  };
}

export interface BaseEdgeProps extends EdgeProps {
  data?: BaseEdgeData;
  isSelected?: boolean;
  onDelete?: (id: string) => void;
  renderCustomLabel?: () => React.ReactNode;
  renderCustomPath?: (path: string) => React.ReactNode;
}

export default function BaseEdge({
  id,
  source,
  target,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  selected,
  onDelete,
  ...props
}: BaseEdgeProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { setEdges } = useReactFlow();
  
  // Default provider and connection type if not provided
  const provider = data?.provider || 'aws';
  const connectionType = data?.type || ConnectionType.NETWORK;
  
  // Get styling information
  const edgeStyle = useMemo(() => 
    providerEdgeStyles[provider] || providerEdgeStyles.aws,
  [provider]);
  
  const typeStyle = useMemo(() => 
    connectionTypeStyles[connectionType] || connectionTypeStyles[ConnectionType.NETWORK],
  [connectionType]);
  
  // Create a unique gradient ID for this edge
  const gradientId = useMemo(() => `edge-gradient-${id}`, [id]);
  
  // Fix: Ensure we get a string path, not an array
  const [edgePath, labelX, labelY] = useMemo(() => {
    const [path, x, y] = getBezierPath({
      sourceX,
      sourceY,
      sourcePosition,
      targetX,
      targetY,
      targetPosition,
      curvature: 0.25
    });
    
    return [path, x, y];
  }, [sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition]);

  // Fix: Use marker IDs for markers instead of complex objects
  const markerStartId = useMemo(() => `marker-start-${id}`, [id]);
  const markerEndId = useMemo(() => `marker-end-${id}`, [id]);
  
  // Handle mouse events
  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);
  
  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  // Handle deletion
  const handleDelete = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (onDelete) {
      onDelete(id);
    } else {
      setEdges((edges) => edges.filter((edge) => edge.id !== id));
    }
  }, [id, onDelete, setEdges]);
  
  // Calculate if we should show the animated flow
  const showFlowAnimation = typeStyle.animationSpeed > 0 && (isHovered || selected);
  
  // Calculate if we should show detailed labels
  const showDetailedLabel = isHovered || selected || data?.hasError;
  
  // Calculate stroke color
  const strokeColor = selected ? edgeStyle.selectedStroke : (isHovered ? edgeStyle.hoverStroke : edgeStyle.stroke);
  
  return (
    <>
      {/* Gradient definition for beautiful edges */}
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={edgeStyle.gradientStart} />
          <stop offset="100%" stopColor={edgeStyle.gradientEnd} />
        </linearGradient>
        
        {/* Fix: Define SVG markers for arrowheads */}
        {typeStyle.showArrowhead && (
          <>
            <marker
              id={markerEndId}
              viewBox="0 0 10 10"
              refX="5"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path
                d="M 0 0 L 10 5 L 0 10 z"
                fill={strokeColor}
              />
            </marker>
            
            {data?.isBidirectional && (
              <marker
                id={markerStartId}
                viewBox="0 0 10 10"
                refX="5"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto"
              >
                <path
                  d="M 0 0 L 10 5 L 0 10 z"
                  fill={strokeColor}
                />
              </marker>
            )}
          </>
        )}
      </defs>
      
      {/* Base Edge Path */}
      <path
        id={id}
        className="react-flow__edge-path transition-all duration-300"
        d={edgePath}
        stroke={`url(#${gradientId})`}
        strokeWidth={typeStyle.strokeWidth * (isHovered || selected ? 1.5 : 1)}
        strokeDasharray={typeStyle.strokeDasharray || undefined}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        markerEnd={typeStyle.showArrowhead ? `url(#${markerEndId})` : undefined}
        markerStart={typeStyle.showArrowhead && data?.isBidirectional ? `url(#${markerStartId})` : undefined}
        style={{
          cursor: isHovered ? 'pointer' : 'default',
          filter: selected ? `drop-shadow(0 0 3px ${edgeStyle.stroke})` : 'none',
          opacity: isHovered || selected ? 1 : 0.85
        }}
      />

      {props.renderCustomPath && edgePath && props.renderCustomPath(edgePath)}
      
      {/* Error indicator */}
      {data?.hasError && (
        <motion.circle
          cx={labelX}
          cy={labelY}
          r="6"
          fill="white"
          stroke="#ef4444"
          strokeWidth="1.5"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
      
      {/* Animated flow particles - forward direction */}
      {showFlowAnimation && (
        <>
          <motion.circle
            r={3}
            fill={edgeStyle.animationColor}
            filter={`drop-shadow(0 0 2px ${edgeStyle.animationColor})`}
            animate={{
              offsetDistance: ["0%", "100%"],
            }}
            transition={{
              duration: 2 / typeStyle.animationSpeed,
              ease: "linear",
              repeat: Infinity,
            }}
            style={{
              offsetPath: `path("${edgePath}")`,
            }}
          />
          
          {/* Second particle for smoother animation */}
          <motion.circle
            r={3}
            fill={edgeStyle.animationColor}
            filter={`drop-shadow(0 0 2px ${edgeStyle.animationColor})`}
            animate={{
              offsetDistance: ["0%", "100%"],
            }}
            transition={{
              duration: 2 / typeStyle.animationSpeed,
              delay: 1 / typeStyle.animationSpeed,
              ease: "linear",
              repeat: Infinity,
            }}
            style={{
              offsetPath: `path("${edgePath}")`,
            }}
          />
        </>
      )}
      
      {/* Bidirectional flow particles */}
      {data?.isBidirectional && showFlowAnimation && (
        <>
          <motion.circle
            r={3}
            fill={edgeStyle.animationColor}
            filter={`drop-shadow(0 0 2px ${edgeStyle.animationColor})`}
            animate={{
              offsetDistance: ["100%", "0%"],
            }}
            transition={{
              duration: 2 / typeStyle.animationSpeed,
              ease: "linear",
              repeat: Infinity,
              delay: 0.5 / typeStyle.animationSpeed,
            }}
            style={{
              offsetPath: `path("${edgePath}")`,
            }}
          />
          
          {/* Second return particle for smoother animation */}
          <motion.circle
            r={3}
            fill={edgeStyle.animationColor}
            filter={`drop-shadow(0 0 2px ${edgeStyle.animationColor})`}
            animate={{
              offsetDistance: ["100%", "0%"],
            }}
            transition={{
              duration: 2 / typeStyle.animationSpeed,
              ease: "linear",
              repeat: Infinity,
              delay: 1.5 / typeStyle.animationSpeed,
            }}
            style={{
              offsetPath: `path("${edgePath}")`,
            }}
          />
        </>
      )}
      
      {/* Connection Label and Details */}
      <EdgeLabelRenderer>
        <AnimatePresence>
          {showDetailedLabel && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.15 }}
              className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none flex items-center gap-1.5 z-50"
              style={{
                left: labelX,
                top: labelY,
              }}
            >
              {/* Edge info card */}
              {props.renderCustomLabel ? (
                props.renderCustomLabel()
              ) : (

              <div className="flex items-center gap-1.5 p-1.5 bg-background/80 backdrop-blur-sm rounded-md shadow-sm text-xs border overflow-hidden">
                {/* Connection type icon */}
                <div
                  className="rounded-sm p-1 flex items-center justify-center"
                  style={{ backgroundColor: `${edgeStyle.stroke}20` }}
                >
                  {typeStyle.icon}
                </div>
                
                {/* Connection details - only show if there's a label or we're in error state */}
                {(data?.label || data?.hasError || isHovered || selected) && (
                  <div className="flex items-center gap-1.5">
                    {/* Connection label */}
                    {data?.label && (
                      <span className="font-medium truncate max-w-[120px]">
                        {data.label}
                      </span>
                    )}
                    
                    {/* Error indicator */}
                    {data?.hasError && (
                      <Badge variant="destructive" className="h-5 px-1.5">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        <span className="text-[10px]">{data.errorMessage || 'Error'}</span>
                      </Badge>
                    )}
                    
                    {/* Connection metrics - only show on hover/select or if important */}
                    {(isHovered || selected) && (
                      <>
                        {/* Bandwidth */}
                        {data?.bandwidth && (
                          <Badge variant="outline" className="h-5 px-1.5 border-primary/20 bg-primary/5">
                            <span className="text-[10px]">{data.bandwidth.amount} {data.bandwidth.unit}</span>
                          </Badge>
                        )}
                        
                        {/* Latency */}
                        {data?.latency && (
                          <Badge variant="outline" className="h-5 px-1.5 border-amber-500/20 bg-amber-500/5">
                            <span className="text-[10px]">{data.latency.amount} {data.latency.unit}</span>
                          </Badge>
                        )}
                        
                        {/* Cost */}
                        {data?.monthlyCost && data.monthlyCost.amount > 0 && (
                          <Badge variant="outline" className="h-5 px-1.5 border-primary/20 bg-primary/5">
                            <span className="text-[10px] font-mono">${data.monthlyCost.amount.toFixed(2)}/mo</span>
                          </Badge>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>
              )}
              
              {/* Delete button - only show when actively interacting with the edge */}
              {(isHovered || selected) && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="pointer-events-auto">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-5 w-5 rounded-full bg-background/80 backdrop-blur-sm border shadow-sm hover:bg-destructive/10 hover:text-destructive"
                          onClick={handleDelete}
                        >
                          <span className="sr-only">Delete connection</span>
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="top">Delete connection</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </EdgeLabelRenderer>
    </>
  );
}