"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { useQuestionnaireStore } from "@/lib/store/questionnaire";
import { ApplicationType, ComplexityLevel } from "@/types";
import CardSelector, { CardOption } from "../ui/CardSelector";
import ComplexitySlider from "../ui/ComplexitySlider";
import FeatureToggleGroup, { FeatureToggle } from "../ui/FeatureToggleGroup";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlusIcon, Cross2Icon, ChevronRightIcon } from "@radix-ui/react-icons";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// Application type options with rich visual metadata
const applicationTypeOptions: CardOption<ApplicationType>[] = [
  {
    value: ApplicationType.WEB,
    label: "Web Application",
    description: "Browser-based application accessible via internet browsers",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    )
  },
  {
    value: ApplicationType.MOBILE,
    label: "Mobile Application",
    description: "Native or hybrid application for smartphones and tablets",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
        <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
        <line x1="12" y1="18" x2="12" y2="18" />
      </svg>
    )
  },
  {
    value: ApplicationType.API,
    label: "API / Service",
    description: "Backend service that provides data and functionality to other applications",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
        <path d="M18 20V10" />
        <path d="M12 20V4" />
        <path d="M6 20v-6" />
      </svg>
    )
  },
  {
    value: ApplicationType.ECOMMERCE,
    label: "E-Commerce Platform",
    description: "Online storefront with product catalog and checkout functionality",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
      </svg>
    )
  },
  {
    value: ApplicationType.CONTENT,
    label: "Content Management",
    description: "Platform for creating, managing and publishing digital content",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    )
  },
  {
    value: ApplicationType.ANALYTICS,
    label: "Analytics Platform",
    description: "Data analysis and visualization tools for business intelligence",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
        <line x1="2" y1="20" x2="22" y2="20" />
      </svg>
    )
  }
];

// Define business features that typically leverage cloud infrastructure
const commonBusinessFeatures = [
  // Data Management Category
  { 
    id: "user-profiles", 
    label: "User Profiles", 
    description: "User account data storage and management",
    category: "Data Management"
  },
  { 
    id: "content-management", 
    label: "Content Management", 
    description: "Creation, storage and delivery of digital content",
    category: "Data Management"
  },
  { 
    id: "document-storage", 
    label: "Document Storage", 
    description: "Secure storage and retrieval of documents",
    category: "Data Management"
  },
  
  // Integration Category
  { 
    id: "third-party-apis", 
    label: "Third-party API Integration", 
    description: "Connect with external services and data sources",
    category: "Integration"
  },
  { 
    id: "payment-gateway", 
    label: "Payment Gateway", 
    description: "Process payments through external providers",
    category: "Integration"
  },
  { 
    id: "social-integration", 
    label: "Social Media Integration", 
    description: "Connect with social platforms for sharing or login",
    category: "Integration"
  },
  
  // Scalability Category
  { 
    id: "search-functionality", 
    label: "Search Engine", 
    description: "Advanced search across application data",
    category: "Scalability"
  },
  { 
    id: "recommendation-engine", 
    label: "Recommendation Engine", 
    description: "ML-powered content or product recommendations",
    category: "Scalability"
  },
  { 
    id: "analytics-dashboard", 
    label: "Analytics Dashboard", 
    description: "Data visualization and business intelligence",
    category: "Scalability"
  },
  
  // Communication Category
  { 
    id: "notifications", 
    label: "Notification System", 
    description: "Push, email, and in-app notifications",
    category: "Communication"
  },
  { 
    id: "chat-messaging", 
    label: "Chat & Messaging", 
    description: "Real-time communication between users",
    category: "Communication"
  },
  { 
    id: "email-integration", 
    label: "Email Communications", 
    description: "Transactional and marketing email delivery",
    category: "Communication"
  },
  
  // Security & Compliance  
  { 
    id: "gdpr-compliance", 
    label: "GDPR Compliance", 
    description: "Data protection and privacy controls",
    category: "Security & Compliance"
  },
  { 
    id: "audit-logs", 
    label: "Audit Logs", 
    description: "Track and review system activity",
    category: "Security & Compliance"
  },
  { 
    id: "multi-language", 
    label: "Multi-language Support", 
    description: "Internationalization and localization",
    category: "Accessibility"
  }
];

export default function ApplicationStep() {
  // Connect to the questionnaire state store
  const { application, updateApplication } = useQuestionnaireStore();
  
  // Local state for business features
  const [selectedBusinessFeatures, setSelectedBusinessFeatures] = useState<string[]>(
    application.coreFeatures || []
  );
  const [customFeature, setCustomFeature] = useState("");
  const [businessFeatureCategories, setBusinessFeatureCategories] = useState<string[]>([]);
  
  // Get unique categories for business features
  useEffect(() => {
    const categories = [...new Set(commonBusinessFeatures.map(feature => feature.category))];
    setBusinessFeatureCategories(categories);
  });
  
  // Configure feature toggles with their respective icons and descriptions
  const systemCapabilities: FeatureToggle[] = useMemo(()=>[
    {
      id: "hasAuthentication",
      label: "User Authentication",
      description: "Enable user registration, login and profile management",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      ),
      value: application.hasAuthentication
    },
    {
      id: "hasFileUploads",
      label: "File Uploads",
      description: "Allow users to upload and manage files or media",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
      ),
      value: application.hasFileUploads
    },
    {
      id: "hasPaymentProcessing",
      label: "Payment Processing",
      description: "Process credit cards, subscriptions or other financial transactions",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
          <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
          <line x1="1" y1="10" x2="23" y2="10" />
        </svg>
      ),
      value: application.hasPaymentProcessing
    },
    {
      id: "isRealTime",
      label: "Real-time Capabilities",
      description: "Enable live updates, notifications, or collaborative features",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
          <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
        </svg>
      ),
      value: application.isRealTime
    }
  ], [
    // Include all dependencies that should trigger recreation
    application.hasAuthentication,
    application.hasFileUploads,
    application.hasPaymentProcessing,
    application.isRealTime
  ]);
  
  // Memoize the callback function to prevent recreation on every render
  const handleCapabilityToggle = useCallback((id: string, value: boolean) => {
    updateApplication(id as keyof typeof application, value);
  }, [updateApplication]);
  
  // Handle business feature selection
  const handleBusinessFeatureToggle = (featureId: string) => {
    setSelectedBusinessFeatures(prev => {
      const isSelected = prev.includes(featureId);
      
      if (isSelected) {
        return prev.filter(id => id !== featureId);
      } else {
        return [...prev, featureId];
      }
    });
  };
  
  // Sync selected business features with application state
  useEffect(() => {
    updateApplication("coreFeatures", selectedBusinessFeatures);
  }, [selectedBusinessFeatures]);
  
  // Handle adding a custom business feature
  const handleAddCustomFeature = () => {
    if (!customFeature.trim()) return;
    
    // Add prefixed custom feature to distinguish from predefined ones
    const customFeatureId = `custom-${customFeature.trim().toLowerCase().replace(/\s+/g, '-')}`;
    
    if (!selectedBusinessFeatures.includes(customFeatureId)) {
      setSelectedBusinessFeatures(prev => [...prev, customFeatureId]);
      setCustomFeature("");
    }
  };
  
  return (
    <div className="space-y-12">
      {/* Application Type Selection */}
      <section>
        <div className="mb-6">
          <h2 className="text-2xl font-semibold tracking-tight mb-1">
            Application Type
          </h2>
          <p className="text-muted-foreground">
            Select the option that best describes your application's primary purpose
          </p>
          <Separator className="mt-2" />
        </div>
        
        <div className="space-y-6">
          <CardSelector<ApplicationType>
            options={applicationTypeOptions}
            value={application.applicationType}
            onChange={(value: ApplicationType) => updateApplication("applicationType", value)}
          />
          
          {/* "More Application Types" Card - for future expansion */}
          <div className="flex justify-end">
            <Button 
              variant="default" 
              className="flex items-center gap-1 text-background hover:text-muted-background text-lg "
              aria-label="Show more application types (coming soon)"
            >
              More application types 
              <ChevronRightIcon className="h-5 w-5" />
            </Button>
          </div>
        </div>

        
      </section>
      
      {/* Complexity Level Selection */}
      <section>
        <div className="mb-6">
          <h2 className="text-2xl font-semibold tracking-tight mb-1">
            Complexity Level
          </h2>
          <p className="text-muted-foreground">
            This helps us recommend the right architecture for your needs
          </p>
          <Separator className="mt-2" />
        </div>
        
        <ComplexitySlider
          value={application.complexityLevel}
          onChange={(value: ComplexityLevel) => updateApplication("complexityLevel", value)}
          // Remove duplicated label/description as they're now in the section header
        />
      </section>
      
      {/* System Capabilities Section - renamed from "Required Features" */}
      <section>
        <div className="mb-6">
          <h2 className="text-2xl font-semibold tracking-tight mb-1">
            System Capabilities
          </h2>
          <p className="text-muted-foreground">
            Select the technical infrastructure requirements your application needs to function properly.
            These selections directly influence the core cloud architecture components.
          </p>
          <Separator className="mt-2" />
        </div>
        
        <div className="space-y-6">
          <FeatureToggleGroup
            features={systemCapabilities}
            onChange={handleCapabilityToggle}
          />
          
          <div className="flex justify-end">
            <Button 
              variant="outline" 
              className="flex items-center gap-1 text-muted-foreground hover:text-foreground"
              aria-label="Show more system capabilities (coming soon)"
            >
              More capabilities 
              <ChevronRightIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>
      
      {/* Business Functionality - replaced "Core Features" with structured selection */}
      <section>
        <div className="mb-6">
          <h2 className="text-2xl font-semibold tracking-tight mb-1">
            Business Functionality
          </h2>
          <p className="text-muted-foreground">
            Select the business features your application will provide to users.
            These selections help us recommend specific cloud services to support your functionality.
          </p>
          <Separator className="mt-2" />
        </div>
        
        {/* Business feature categories */}
        <div className="space-y-8">
          {businessFeatureCategories.map(category => (
            <div key={category} className="space-y-3">
              <h3 className="text-lg font-medium">{category}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {commonBusinessFeatures
                  .filter(feature => feature.category === category)
                  .map(feature => {
                    const isSelected = selectedBusinessFeatures.includes(feature.id);
                    return (
                      <Card 
                        key={feature.id}
                        className={`cursor-pointer transition-all hover:shadow-sm ${
                          isSelected ? 'bg-primary/5 border-primary/50' : ''
                        }`}
                        onClick={() => handleBusinessFeatureToggle(feature.id)}
                      >
                        <CardHeader className="pb-2">
                          <div className="flex items-start justify-between">
                            <div>
                              <CardTitle className="text-base">{feature.label}</CardTitle>
                              <CardDescription className="mt-1">
                                {feature.description}
                              </CardDescription>
                            </div>
                            
                            {/* Selection indicator */}
                            <div className={`h-5 w-5 rounded-full border-2 flex-shrink-0 ${
                              isSelected ? 'bg-primary border-primary' : 'border-muted-foreground'
                            }`}>
                              {isSelected && (
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-full w-full text-background">
                                  <polyline points="20 6 9 17 4 12" />
                                </svg>
                              )}
                            </div>
                          </div>
                        </CardHeader>
                      </Card>
                    );
                  })}
              </div>
            </div>
          ))}
          
          {/* Custom business feature input */}
          {/* <div className="pt-4 border-t">
            <h3 className="text-lg font-medium mb-3">Custom Business Feature</h3>
            <div className="flex gap-2">
              <Input
                value={customFeature}
                onChange={(e) => setCustomFeature(e.target.value)}
                placeholder="Enter a custom feature (e.g., Customer Loyalty Program)"
                className="flex-1"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddCustomFeature();
                  }
                }}
              />
              <Button type="button" onClick={handleAddCustomFeature}>
                <PlusIcon className="h-4 w-4 mr-2" />
                Add
              </Button>
            </div> */}
            
            {/* Custom features display */}
            {/* {selectedBusinessFeatures.some(f => f.startsWith('custom-')) && (
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">Your Custom Features:</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedBusinessFeatures
                    .filter(f => f.startsWith('custom-'))
                    .map(customId => {
                      const displayName = customId.replace('custom-', '').replace(/-/g, ' ');
                      return (
                        <Badge key={customId} variant="secondary" className="flex items-center gap-1 px-3 py-1.5">
                          <span className="capitalize">{displayName}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-4 w-4 p-0 hover:bg-transparent"
                            onClick={() => handleBusinessFeatureToggle(customId)}
                          >
                            <Cross2Icon className="h-3 w-3" />
                            <span className="sr-only">Remove {displayName}</span>
                          </Button>
                        </Badge>
                      );
                    })}
                </div>
              </div>
            )} */}
          {/* </div> */}
        </div>
      </section>
    </div>
  );
}