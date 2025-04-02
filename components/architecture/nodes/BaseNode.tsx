import React, { useState, useCallback, forwardRef, useMemo } from 'react';
import { motion, MotionValue, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { Handle, NodeProps, Position, NodeToolbar } from 'reactflow';
import { cn } from '@/lib/utils';
import { CloudProvider } from '@/lib/store/applicationState';
import { ArchitectureComponent, ComponentType } from '@/types/architecture';
import { 
  Settings2, MoreHorizontal, Trash2, Edit, ArrowUpRight, 
  AlertTriangle, Lock, Maximize2, Copy 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
  DropdownMenuSeparator, DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

// Provider-specific styling
const providerStyles: Record<CloudProvider, { 
  gradient: string, 
  borderColor: string,
  hoverGradient: string,
  selectedGradient: string
}> = {
  aws: {
    gradient: 'from-orange-500/10 via-orange-400/5 to-yellow-300/10',
    borderColor: 'border-orange-500/30',
    hoverGradient: 'from-orange-500/20 via-orange-400/15 to-yellow-300/20',
    selectedGradient: 'from-orange-500/30 via-orange-400/20 to-yellow-300/30'
  },
  azure: {
    gradient: 'from-blue-500/10 via-blue-400/5 to-blue-300/10',
    borderColor: 'border-blue-500/30',
    hoverGradient: 'from-blue-500/20 via-blue-400/15 to-blue-300/20',
    selectedGradient: 'from-blue-500/30 via-blue-400/25 to-blue-300/30'
  },
  gcp: {
    gradient: 'from-red-500/10 via-red-400/5 to-red-300/10',
    borderColor: 'border-red-500/30',
    hoverGradient: 'from-red-500/20 via-red-400/15 to-red-300/20',
    selectedGradient: 'from-red-500/30 via-red-400/25 to-red-300/30'
  },
  firebase: {
    gradient: 'from-amber-500/10 via-amber-400/5 to-yellow-300/10',
    borderColor: 'border-amber-500/30',
    hoverGradient: 'from-amber-500/20 via-amber-400/15 to-yellow-300/20',
    selectedGradient: 'from-amber-500/30 via-amber-400/25 to-yellow-300/30'
  },
  digitalocean: {
    gradient: 'from-cyan-500/10 via-cyan-400/5 to-blue-300/10',
    borderColor: 'border-cyan-500/30',
    hoverGradient: 'from-cyan-500/20 via-cyan-400/15 to-blue-300/20',
    selectedGradient: 'from-cyan-500/30 via-cyan-400/25 to-blue-300/30'
  }
};

// Component type icons mapping
const componentTypeIcons: Partial<Record<ComponentType, React.ReactNode>> = {
  [ComponentType.VM]: <div className="rounded-sm p-1 bg-gray-500/10">VM</div>,
  [ComponentType.CONTAINER]: <div className="rounded-sm p-1 bg-blue-500/10">CT</div>,
  [ComponentType.FUNCTION]: <div className="rounded-sm p-1 bg-purple-500/10">λ</div>,
  [ComponentType.KUBERNETES]: <div className="rounded-sm p-1 bg-blue-500/10">K8s</div>,
  [ComponentType.OBJECT_STORAGE]: <div className="rounded-sm p-1 bg-amber-500/10">S3</div>,
  [ComponentType.RELATIONAL_DB]: <div className="rounded-sm p-1 bg-green-500/10">DB</div>,
  [ComponentType.LOAD_BALANCER]: <div className="rounded-sm p-1 bg-cyan-500/10">LB</div>,
  // Remaining type icons would be defined similarly
};

// Get the human-readable component type name
const getComponentTypeName = (type: ComponentType): string => {
  return type
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export interface BaseNodeProps extends NodeProps {
  component: ArchitectureComponent;
  isSelected?: boolean;
  isLocked?: boolean;
  hasErrors?: boolean;
  showDetails?: boolean;
  onDelete?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDuplicate?: (id: string) => void;
  onExpand?: (id: string) => void;
  onLockToggle?: (id: string, locked: boolean) => void;
  renderCustomContent?: () => React.ReactNode;
  renderExpandedContent?: () => React.ReactNode;
  children?: React.ReactNode;
}

const BaseNode = forwardRef<HTMLDivElement, BaseNodeProps>((props, ref) => {
  const { 
    component, 
    selected, 
    isLocked = false,
    hasErrors = false,
    showDetails = false,
    onDelete, 
    onEdit, 
    onDuplicate, 
    onExpand,
    onLockToggle,
    ...nodeProps 
  } = props;

  // Local state
  const [isHovered, setIsHovered] = useState(false);
  const [showToolbar, setShowToolbar] = useState(false);
  const [expanded, setExpanded] = useState(showDetails);

  // Calculate styling based on provider
  const providerStyle = useMemo(() => 
    providerStyles[component.provider] || providerStyles.aws,
  [component.provider]);

  // Calculate node dimensions
  const nodeWidth = expanded ? 280 : 220;
  const nodeHeight = expanded ? 180 : 100;

  // Animation values
  const pulseAnimation = useMotionValue(0);
  const pulse = useTransform(pulseAnimation, [0, 1], [1, 1.03]);

  // Callbacks
  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
    setShowToolbar(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    setShowToolbar(false);
  }, []);

  const handleDelete = useCallback(() => {
    onDelete?.(component.id);
  }, [component.id, onDelete]);

  const handleEdit = useCallback(() => {
    onEdit?.(component.id);
  }, [component.id, onEdit]);

  const handleDuplicate = useCallback(() => {
    onDuplicate?.(component.id);
  }, [component.id, onDuplicate]);

  const handleExpand = useCallback(() => {
    setExpanded(!expanded);
    onExpand?.(component.id);
  }, [component.id, expanded, onExpand]);

  const handleLockToggle = useCallback(() => {
    onLockToggle?.(component.id, !isLocked);
  }, [component.id, isLocked, onLockToggle]);

  // Calculate node gradient based on state
  const nodeGradient = useMemo(() => {
    if (selected) return providerStyle.selectedGradient;
    if (isHovered) return providerStyle.hoverGradient;
    return providerStyle.gradient;
  }, [selected, isHovered, providerStyle]);

  // Connection handles for different positions
  const handlePositions = [
    Position.Top,
    Position.Right, 
    Position.Bottom,
    Position.Left
  ];

  // Component type display name
  const typeName = getComponentTypeName(component.type);
  
  // Icon for component type
  const typeIcon = componentTypeIcons[component.type] || 
    <div className="rounded-sm p-1 bg-gray-500/10">?</div>;

  return (
    <>
      {/* Node toolbar with actions */}
      <NodeToolbar
        isVisible={showToolbar && !isLocked}
        position={Position.Top}
        offset={10}
        className="bg-transparent"
      >
        <div className="flex items-center p-1 rounded-md bg-background/80 backdrop-blur-sm border shadow-sm">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={handleEdit}
                >
                  <Edit className="h-3.5 w-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Edit Component</TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={handleDuplicate}
                >
                  <Copy className="h-3.5 w-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Duplicate</TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={handleExpand}
                >
                  <Maximize2 className="h-3.5 w-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>{expanded ? 'Collapse' : 'Expand'}</TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={handleLockToggle}
                >
                  <Lock className="h-3.5 w-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>{isLocked ? 'Unlock' : 'Lock'}</TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={handleDelete}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Delete</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </NodeToolbar>
      
      {/* The main node component */}
      <motion.div
        ref={ref}
        style={{
          width: nodeWidth,
          height: nodeHeight,
          scale: pulse
        }}
        animate={{
          scale: selected ? 1.02 : 1
        }}
        transition={{ 
          type: 'spring',
          stiffness: 500,
          damping: 30
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={cn(
          "bg-gradient-to-br shadow-sm border-2 rounded-lg overflow-hidden flex flex-col relative",
          providerStyle.borderColor,
          nodeGradient,
          "transition-shadow duration-200",
          selected ? "shadow-md" : "",
          isLocked ? "cursor-not-allowed opacity-80" : "cursor-grab active:cursor-grabbing"
        )}
        data-locked={isLocked}
        data-selected={selected}
        data-testid={`node-${component.id}`}
      >
        {/* Status indicators */}
        <div className="absolute top-2 right-2 flex gap-1.5 z-10">
          {hasErrors && (
            <Badge variant="destructive" className="h-5 px-1.5">
              <AlertTriangle className="h-3 w-3 mr-1" />
              <span className="text-xs">Error</span>
            </Badge>
          )}
          
          {isLocked && (
            <Badge variant="outline" className="h-5 px-1.5 bg-muted/50">
              <Lock className="h-3 w-3 mr-1" />
              <span className="text-xs">Locked</span>
            </Badge>
          )}
          
          {component.estimatedCost && component.estimatedCost.monthlyCost.amount > 0 && (
            <Badge variant="outline" className="h-5 px-1.5 bg-primary/5 border-primary/20">
              <span className="text-xs font-mono">
                ${component.estimatedCost.monthlyCost.amount.toFixed(2)}
              </span>
            </Badge>
          )}
        </div>
        
        {/* Node header with component info */}
        <div className="p-3 flex items-start">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 flex-shrink-0 flex items-center justify-center rounded-md bg-background/80 backdrop-blur-sm shadow-sm">
              {typeIcon}
            </div>
            <div className="flex flex-col">
              <div className="font-medium text-sm line-clamp-1">{component.name}</div>
              <div className="text-xs text-muted-foreground line-clamp-1">{typeName}</div>
            </div>
          </div>
        </div>
        {props.renderCustomContent && props.renderCustomContent()}
        {props.children}
        {/* Node content - shown when expanded */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="px-3 pb-3"
            >
              {props.renderExpandedContent ? props.renderExpandedContent() : (
                <div className="text-xs text-muted-foreground">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="font-medium">Region:</span>
                    <div className="truncate">{component.region}</div>
                  </div>
                  <div>
                    <span className="font-medium">Tier:</span>
                    <div className="capitalize truncate">{component.tier}</div>
                  </div>
                  
                  {component.specs.type === 'compute' && (
                    <>
                      <div>
                        <span className="font-medium">CPU:</span>
                        <div>{component.specs.cpu.cores} cores</div>
                      </div>
                      <div>
                        <span className="font-medium">Memory:</span>
                        <div>{component.specs.memory.amount} {component.specs.memory.unit}</div>
                      </div>
                    </>
                  )}
                  
                  {component.specs.type === 'storage' && (
                    <div className="col-span-2">
                      <span className="font-medium">Capacity:</span>
                      <div>{component.specs.capacity.amount} {component.specs.capacity.unit}</div>
                    </div>
                  )}
                  
                  {component.specs.type === 'database' && (
                    <>
                      <div>
                        <span className="font-medium">Engine:</span>
                        <div>{component.specs.engine}</div>
                      </div>
                      <div>
                        <span className="font-medium">Storage:</span>
                        <div>{component.specs.storage.amount} {component.specs.storage.unit}</div>
                      </div>
                    </>
                  )}
                </div>
              </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* More details button at bottom */}
        <div className="mt-auto p-2 text-center">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-6 text-xs opacity-60 hover:opacity-100 w-full"
            onClick={handleExpand}
          >
            {expanded ? "Show Less" : "Show More"}
          </Button>
        </div>
        
        {/* Connection handles */}
        {handlePositions.map(position => (
          <Handle
            key={position}
            type="source"
            position={position}
            className={cn(
              "w-3 h-3 border-2 bg-background backdrop-blur-sm",
              "transition-opacity duration-200",
              isHovered || selected ? "opacity-100" : "opacity-0"
            )}
            style={{
              borderColor: component.provider === 'aws' 
                ? 'rgb(249 115 22 / 0.6)' // orange-500/60
                : component.provider === 'azure'
                ? 'rgb(59 130 246 / 0.6)' // blue-500/60
                : component.provider === 'gcp'
                ? 'rgb(239 68 68 / 0.6)' // red-500/60
                : 'rgb(168 85 247 / 0.6)', // purple-500/60
              zIndex: 20
            }}
          />
        ))}
      </motion.div>
    </>
  );
});

BaseNode.displayName = 'BaseNode';

export default BaseNode;