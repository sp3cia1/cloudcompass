"use client";

import { useEffect, useState, useMemo } from "react";
import { useQuestionnaireStore } from "@/lib/store/questionnaire";
import { SecurityLevel, ComplianceType } from "@/types";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import { AlertTriangle, ShieldCheck, Lock, Key, Info, ChevronDown, ChevronUp } from "lucide-react";
import SecurityLevelSelector from "../ui/SecurityLevelSelector";
import ComplianceFrameworkSelector from "../ui/ComplianceFrameworkSelector";
import SecurityCapabilityPanel from "../ui/SecurityCapabilityPanel";
import { getRecommendedSecurityCapabilities, estimateSecurityCostImpact } from "@/lib/metadata/security-levels";
import { getRequiredSecurityLevel } from "@/lib/metadata/security-utils";
import { AnimatePresence, motion } from "framer-motion";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

export default function SecurityStep() {
  // Connect to the questionnaire state store
  const { 
    security, 
    updateSecurity,
    application, // Used for smart recommendations
    data, // For data-related security suggestions
    geographic // For region-specific compliance suggestions
  } = useQuestionnaireStore();
  
  // Extract security state
  const { 
    securityLevel, 
    complianceRequirements, 
    additionalCapabilities = [],
    requiresVPN,
    requiresWAF,
    requiresDataEncryption,
    requiresPrivateNetworking
  } = security;

  // Local state for UI interactions
  const [showRecommendations, setShowRecommendations] = useState(true);
  const [showCompliance, setShowCompliance] = useState(true);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [animateScore, setAnimateScore] = useState(false);

  // Calculate recommendations based on application characteristics
  const recommendedCapabilities = useMemo(() => 
    getRecommendedSecurityCapabilities(
      securityLevel,
      application.hasPaymentProcessing,
      application.hasFileUploads,
      application.isRealTime
    ),
    [securityLevel, application.hasPaymentProcessing, application.hasFileUploads, application.isRealTime]
  );

  // Calculate required security level based on compliance frameworks
  const requiredSecurityLevel = useMemo(() => 
    getRequiredSecurityLevel(complianceRequirements),
    [complianceRequirements]
  );

  // Check if current security level meets compliance requirements
  const isSecurityLevelSufficient = useMemo(() => {
    if (securityLevel === SecurityLevel.HIGH) return true;
    if (securityLevel === SecurityLevel.ENHANCED && requiredSecurityLevel === SecurityLevel.BASIC) return true;
    return securityLevel === requiredSecurityLevel;
  }, [securityLevel, requiredSecurityLevel]);

  // Cost impact estimate (percentage increase to infrastructure cost)
  const costImpact = useMemo(() => 
    estimateSecurityCostImpact(securityLevel, application.complexityLevel),
    [securityLevel, application.complexityLevel]
  );

  // Handle security level changes
  const handleSecurityLevelChange = (level: SecurityLevel) => {
    updateSecurity('securityLevel', level);
    
    // Trigger score animation
    setAnimateScore(true);
    setTimeout(() => setAnimateScore(false), 1000);
    
    // If changing to a lower level that doesn't meet requirements, show alert
    if (level !== requiredSecurityLevel && getRequiredSecurityLevel(complianceRequirements) > level) {
      setShowCompliance(true);
    }
  };

  // Handle compliance framework changes
  const handleComplianceChange = (frameworks: ComplianceType[]) => {
    updateSecurity('complianceRequirements', frameworks);
  };

  // Handle additional capabilities changes
  const handleCapabilitiesChange = (capabilities: string[]) => {
    updateSecurity('additionalCapabilities', capabilities);
  };

  // Handle toggle changes for specific security requirements
  const handleToggleRequirement = (
    field: 'requiresVPN' | 'requiresWAF' | 'requiresDataEncryption' | 'requiresPrivateNetworking',
    value: boolean
  ) => {
    updateSecurity(field, value);
  };

  // Check if we need to recommend a security level upgrade based on compliance
  useEffect(() => {
    if (requiredSecurityLevel > securityLevel) {
      // Automatically expand the compliance section if there's a mismatch
      setShowCompliance(true);
    }
  }, [requiredSecurityLevel, securityLevel]);

  return (
    <div className="space-y-12">
      {/* Security Level Selection */}
      <section>
        <div className="mb-6">
          <h2 className="text-2xl font-semibold tracking-tight mb-1">
            Security Level
          </h2>
          <p className="text-muted-foreground">
            Select the appropriate security level for your application
          </p>
          <Separator className="mt-2" />
        </div>
        
        <SecurityLevelSelector
          value={securityLevel}
          onChange={handleSecurityLevelChange}
          className="mb-4"
        />

        {!isSecurityLevelSufficient && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Alert variant="default" className="mb-4 border-amber-500 bg-amber-50">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              <AlertTitle className="text-amber-800">Security Level Warning</AlertTitle>
              <AlertDescription className="text-amber-700">
                Your selected compliance frameworks require a minimum security level of <strong>{requiredSecurityLevel}</strong>. 
                Please upgrade your security level to meet these requirements.
              </AlertDescription>
            </Alert>
          </motion.div>
        )}
        
        {/* Cost impact card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <Card className="bg-muted/20">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-primary" />
                <CardTitle className="text-base">Security Impact</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground mb-2">
                  Selected security level increases infrastructure costs by:
                </p>
                <p className="text-3xl font-bold">
                  +{Math.round(costImpact * 100)}%
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-muted/20">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-primary" />
                <CardTitle className="text-base">Data Protection</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground mb-1">
                  {securityLevel === SecurityLevel.HIGH ? (
                    "Full protection for sensitive data"
                  ) : securityLevel === SecurityLevel.ENHANCED ? (
                    "Strong protection for most data types"
                  ) : (
                    "Basic protection for non-sensitive data"
                  )}
                </p>
                
                <div className="flex items-center gap-2">
                  <div className="h-2 bg-muted flex-1 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-primary"
                      initial={{ width: "0%" }}
                      animate={{ 
                        width: securityLevel === SecurityLevel.HIGH 
                          ? "100%" 
                          : securityLevel === SecurityLevel.ENHANCED 
                            ? "66%" 
                            : "33%" 
                      }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                    />
                  </div>
                  <span className="text-xs font-medium">
                    {securityLevel === SecurityLevel.HIGH 
                      ? "High" 
                      : securityLevel === SecurityLevel.ENHANCED 
                        ? "Medium" 
                        : "Basic"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-muted/20">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Key className="h-5 w-5 text-primary" />
                <CardTitle className="text-base">Access Controls</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground mb-1">
                  {securityLevel === SecurityLevel.HIGH ? (
                    "Advanced privilege management & MFA"
                  ) : securityLevel === SecurityLevel.ENHANCED ? (
                    "Multi-factor authentication & role-based access"
                  ) : (
                    "Basic authentication & authorization"
                  )}
                </p>
                
                <div className="flex items-center gap-2">
                  <div className="h-2 bg-muted flex-1 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-primary"
                      initial={{ width: "0%" }}
                      animate={{ 
                        width: securityLevel === SecurityLevel.HIGH 
                          ? "100%" 
                          : securityLevel === SecurityLevel.ENHANCED 
                            ? "66%" 
                            : "33%" 
                      }}
                      transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
                    />
                  </div>
                  <span className="text-xs font-medium">
                    {securityLevel === SecurityLevel.HIGH 
                      ? "High" 
                      : securityLevel === SecurityLevel.ENHANCED 
                        ? "Medium" 
                        : "Basic"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
      
      {/* Recommendations based on app characteristics */}
      <Collapsible 
        open={showRecommendations} 
        onOpenChange={setShowRecommendations}
        className="border bg-muted/10 rounded-lg overflow-hidden"
      >
        <CollapsibleTrigger className="flex items-center justify-between w-full p-4">
          <div className="flex items-center gap-2">
            <Info className="h-4 w-4 text-primary" />
            <h3 className="text-lg font-medium">Security Recommendations</h3>
          </div>
          {showRecommendations ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="px-4 pb-4">
            <p className="text-sm text-muted-foreground mb-3">
              Based on your application characteristics, we recommend the following security enhancements:
            </p>
            
            <div className="space-y-2">
              {application.hasPaymentProcessing && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-md">
                  <h4 className="font-medium text-amber-900 mb-1">Payment Processing</h4>
                  <p className="text-sm text-amber-700">
                    Your application processes payments, requiring PCI DSS compliance and enhanced security measures.
                  </p>
                  {securityLevel === SecurityLevel.BASIC && (
                    <div className="mt-2">
                      <Button
                        size="sm"
                        variant="outline" 
                        className="text-xs border-amber-500 text-amber-700 hover:bg-amber-100 hover:text-amber-900"
                        onClick={() => handleSecurityLevelChange(SecurityLevel.ENHANCED)}
                      >
                        Upgrade to Enhanced Security
                      </Button>
                    </div>
                  )}
                </div>
              )}
              
              {application.hasFileUploads && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                  <h4 className="font-medium text-blue-900 mb-1">File Uploads</h4>
                  <p className="text-sm text-blue-700">
                    Your application allows file uploads, requiring additional security controls to prevent malicious uploads.
                  </p>
                  {recommendedCapabilities.includes("waf") && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                        Web Application Firewall (WAF)
                      </Badge>
                      <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                        Vulnerability Scanning
                      </Badge>
                    </div>
                  )}
                </div>
              )}
              
              {application.isRealTime && (
                <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-md">
                  <h4 className="font-medium text-indigo-900 mb-1">Real-time Capabilities</h4>
                  <p className="text-sm text-indigo-700">
                    Your real-time application may be susceptible to DDoS and other availability attacks.
                  </p>
                  {recommendedCapabilities.includes("ddos-protection") && (
                    <div className="mt-2 flex gap-2">
                      <Badge variant="outline" className="bg-indigo-100 text-indigo-800 hover:bg-indigo-200">
                        DDoS Protection
                      </Badge>
                    </div>
                  )}
                </div>
              )}
              
              {!application.hasPaymentProcessing && !application.hasFileUploads && !application.isRealTime && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                  <p className="text-sm text-green-700">
                    Based on your application characteristics, the current security level appears appropriate.
                  </p>
                </div>
              )}
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
      
      {/* Compliance Requirements */}
      <section>
        <div className="mb-6">
          <h2 className="text-2xl font-semibold tracking-tight mb-1">
            Compliance Requirements
          </h2>
          <p className="text-muted-foreground">
            Select the regulatory frameworks your application must comply with
          </p>
          <Separator className="mt-2" />
        </div>
        
        <ComplianceFrameworkSelector
          values={complianceRequirements}
          onChange={handleComplianceChange}
          currentSecurityLevel={securityLevel}
          className="mb-4"
        />
      </section>
      
      {/* Security Capabilities */}
      <section>
        <div className="mb-6">
          <h2 className="text-2xl font-semibold tracking-tight mb-1">
            Security Capabilities
          </h2>
          <p className="text-muted-foreground">
            Configure the security capabilities for your application
          </p>
          <Separator className="mt-2" />
        </div>
        
        <SecurityCapabilityPanel
          securityLevel={securityLevel}
          complianceTypes={complianceRequirements}
          additionalCapabilities={additionalCapabilities || []}
          onAdditionalCapabilitiesChange={handleCapabilitiesChange}
          className="mb-6"
        />
      </section>
      
      {/* Advanced Security Options */}
      <Collapsible 
        open={showAdvanced} 
        onOpenChange={setShowAdvanced}
        className="border bg-muted/10 rounded-lg overflow-hidden"
      >
        <CollapsibleTrigger className="flex items-center justify-between w-full p-4">
          <div className="flex items-center gap-2">
            <Key className="h-4 w-4 text-primary" />
            <h3 className="text-lg font-medium">Advanced Security Options</h3>
          </div>
          {showAdvanced ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className={`cursor-pointer transition-all ${requiresVPN ? 'bg-primary/5 border-primary/50' : ''}`}
                onClick={() => handleToggleRequirement('requiresVPN', !requiresVPN)}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">VPN Access</CardTitle>
                  <CardDescription>Secure access through virtual private network</CardDescription>
                </CardHeader>
                <CardFooter className="pt-0">
                  <div className="flex items-center justify-between w-full">
                    <span className="text-sm text-muted-foreground">
                      {requiresVPN ? 'Enabled' : 'Disabled'}
                    </span>
                    <div className={`h-4 w-8 rounded-full ${requiresVPN ? 'bg-primary' : 'bg-muted'} relative transition-colors`}>
                      <div className={`absolute h-3 w-3 rounded-full bg-white top-0.5 transition-transform ${requiresVPN ? 'translate-x-4' : 'translate-x-0.5'}`} />
                    </div>
                  </div>
                </CardFooter>
              </Card>
              
              <Card className={`cursor-pointer transition-all ${requiresWAF ? 'bg-primary/5 border-primary/50' : ''}`}
                onClick={() => handleToggleRequirement('requiresWAF', !requiresWAF)}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Web Application Firewall</CardTitle>
                  <CardDescription>Protection against common web vulnerabilities</CardDescription>
                </CardHeader>
                <CardFooter className="pt-0">
                  <div className="flex items-center justify-between w-full">
                    <span className="text-sm text-muted-foreground">
                      {requiresWAF ? 'Enabled' : 'Disabled'}
                    </span>
                    <div className={`h-4 w-8 rounded-full ${requiresWAF ? 'bg-primary' : 'bg-muted'} relative transition-colors`}>
                      <div className={`absolute h-3 w-3 rounded-full bg-white top-0.5 transition-transform ${requiresWAF ? 'translate-x-4' : 'translate-x-0.5'}`} />
                    </div>
                  </div>
                </CardFooter>
              </Card>
              
              <Card className={`cursor-pointer transition-all ${requiresDataEncryption ? 'bg-primary/5 border-primary/50' : ''}`}
                onClick={() => handleToggleRequirement('requiresDataEncryption', !requiresDataEncryption)}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Data Encryption</CardTitle>
                  <CardDescription>Encrypt data at rest and in transit</CardDescription>
                </CardHeader>
                <CardFooter className="pt-0">
                  <div className="flex items-center justify-between w-full">
                    <span className="text-sm text-muted-foreground">
                      {requiresDataEncryption ? 'Enabled' : 'Disabled'}
                    </span>
                    <div className={`h-4 w-8 rounded-full ${requiresDataEncryption ? 'bg-primary' : 'bg-muted'} relative transition-colors`}>
                      <div className={`absolute h-3 w-3 rounded-full bg-white top-0.5 transition-transform ${requiresDataEncryption ? 'translate-x-4' : 'translate-x-0.5'}`} />
                    </div>
                  </div>
                </CardFooter>
              </Card>
              
              <Card className={`cursor-pointer transition-all ${requiresPrivateNetworking ? 'bg-primary/5 border-primary/50' : ''}`}
                onClick={() => handleToggleRequirement('requiresPrivateNetworking', !requiresPrivateNetworking)}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Private Networking</CardTitle>
                  <CardDescription>Isolated network for enhanced security</CardDescription>
                </CardHeader>
                <CardFooter className="pt-0">
                  <div className="flex items-center justify-between w-full">
                    <span className="text-sm text-muted-foreground">
                      {requiresPrivateNetworking ? 'Enabled' : 'Disabled'}
                    </span>
                    <div className={`h-4 w-8 rounded-full ${requiresPrivateNetworking ? 'bg-primary' : 'bg-muted'} relative transition-colors`}>
                      <div className={`absolute h-3 w-3 rounded-full bg-white top-0.5 transition-transform ${requiresPrivateNetworking ? 'translate-x-4' : 'translate-x-0.5'}`} />
                    </div>
                  </div>
                </CardFooter>
              </Card>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
      
      {/* Security Summary and Implications */}
      <section>
        <div className="mb-6">
          <h2 className="text-2xl font-semibold tracking-tight mb-1">
            Security Summary
          </h2>
          <p className="text-muted-foreground">
            Overview of your security configuration and implications
          </p>
          <Separator className="mt-2" />
        </div>
        
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-1">
                <div className="text-sm font-medium text-muted-foreground">Security Level</div>
                <div className="text-lg font-semibold">{securityLevel}</div>
                <div className="text-xs text-muted-foreground">
                  {securityLevel === SecurityLevel.HIGH ? 
                    "Maximum protection for sensitive data" :
                    securityLevel === SecurityLevel.ENHANCED ?
                    "Strong protection for sensitive applications" :
                    "Basic protection for non-critical systems"}
                </div>
              </div>
              
              <div className="space-y-1">
                <div className="text-sm font-medium text-muted-foreground">Compliance</div>
                <div className="text-lg font-semibold">
                  {complianceRequirements.includes(ComplianceType.NONE) ? 
                    "None Required" : 
                    `${complianceRequirements.length} Framework${complianceRequirements.length !== 1 ? 's' : ''}`}
                </div>
                <div className="text-xs text-muted-foreground">
                  {complianceRequirements.includes(ComplianceType.NONE) ?
                    "No specific compliance requirements" :
                    `Including ${complianceRequirements.slice(0, 2).map(c => c).join(', ')}${complianceRequirements.length > 2 ? '...' : ''}`}
                </div>
              </div>
              
              <div className="space-y-1">
                <div className="text-sm font-medium text-muted-foreground">Capabilities</div>
                <div className="text-lg font-semibold">
                  {(additionalCapabilities?.length || 0) + (securityLevel === SecurityLevel.HIGH ? 17 : securityLevel === SecurityLevel.ENHANCED ? 10 : 4)}
                </div>
                <div className="text-xs text-muted-foreground">
                  Security capabilities enabled
                </div>
              </div>
              
              <div className="space-y-1">
                <div className="text-sm font-medium text-muted-foreground">Cost Impact</div>
                <div className="text-lg font-semibold">
                  +{Math.round(costImpact * 100)}%
                </div>
                <div className="text-xs text-muted-foreground">
                  Estimated additional cost
                </div>
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-border/60">
              <p className="text-sm text-muted-foreground">
                Your security configuration focuses on 
                {securityLevel === SecurityLevel.HIGH ? 
                  " maximum protection with comprehensive controls across all security domains" :
                  securityLevel === SecurityLevel.ENHANCED ?
                  " balanced security with strong protections for sensitive components" :
                  " essential security controls for basic protection"}.
                {!complianceRequirements.includes(ComplianceType.NONE) && 
                  ` Your selected compliance frameworks add specific requirements to meet ${complianceRequirements.join(', ')} standards.`}
              </p>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}