"use client";

import { useEffect, useState } from "react";
import { useQuestionnaireStore } from "@/lib/store/questionnaire";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { 
  BudgetOptimizationIcon, 
  CostSavingsIcon 
} from "../icons/BudgetIcons";
import { motion, AnimatePresence } from "framer-motion";
import BudgetSlider from "../ui/BudgetSlider";
import BudgetFlexibilitySelector from "../ui/BudgetFlexibilitySelector";
import CostOptimizationSelector from "../ui/CostOptimizationSelector";
import BudgetQualityImpact from "../ui/BudgetQualityImpact";
import { calculatePotentialSavings } from "@/lib/metadata/budget";

export default function BudgetStep() {
  // Connect to the questionnaire state store
  const { 
    budget, 
    updateBudget,
    application,
    scaling,
    security
  } = useQuestionnaireStore();
  
  // Extract budget state
  const { 
    monthlyBudgetUSD, 
    budgetFlexibilityPercent, 
    prioritizeCostSavings,
    selectedOptimizationStrategies = [] // Use default empty array for backward compatibility
  } = budget;

  // Local state for animations
  const [animateBudget, setAnimateBudget] = useState(false);
  
  // Estimated annual costs with and without optimization
  const annualCost = monthlyBudgetUSD * 12;
  const potentialSavings = calculatePotentialSavings(
    monthlyBudgetUSD,
    selectedOptimizationStrategies, // Use the array of strategies directly
    scaling.trafficPattern,
    security.securityLevel,
    scaling.expectedConcurrentUsers
  );
  
  // Annual cost after savings
  const optimizedAnnualCost = annualCost - (potentialSavings.totalSavingsAmount * 12);
  
  // Calculate total budget including flexibility
  const totalBudgetWithFlexibility = monthlyBudgetUSD * (1 + budgetFlexibilityPercent / 100);
  
  // Animate budget changes
  useEffect(() => {
    setAnimateBudget(true);
    const timer = setTimeout(() => setAnimateBudget(false), 700);
    return () => clearTimeout(timer);
  }, [monthlyBudgetUSD, budgetFlexibilityPercent]);

  // Handle budget amount changes
  const handleBudgetChange = (value: number) => {
    updateBudget('monthlyBudgetUSD', value);
  };
  
  // Handle flexibility changes
  const handleFlexibilityChange = (value: number) => {
    updateBudget('budgetFlexibilityPercent', value);
  };
  
  // Format currency for display
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      maximumFractionDigits: 0 
    }).format(amount);
  };
  
  return (
    <div className="space-y-12">
      {/* Budget Overview: Engaging Header Animation */}
      <section>
        <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10">
          <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,#fff)]" />
          <div className="relative px-6 py-8 md:px-8">
            {/* Visual overview - animated */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Monthly Budget */}
              <Card className="bg-card/60 backdrop-blur-sm border-primary/10">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-full">
                      <BudgetOptimizationIcon />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-0.5">Monthly Budget</p>
                      <motion.p 
                        key={monthlyBudgetUSD}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-xl font-bold"
                      >
                        {formatCurrency(monthlyBudgetUSD)}
                        {budgetFlexibilityPercent > 0 && (
                          <span className="text-sm font-normal text-muted-foreground ml-1">
                            (+{budgetFlexibilityPercent}% flex)
                          </span>
                        )}
                      </motion.p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Annual Budget */}
              <Card className="bg-card/60 backdrop-blur-sm border-primary/10">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/10 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
                        <rect x="3" y="4" width="18" height="16" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-0.5">Annual Budget</p>
                      <motion.p 
                        key={annualCost}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-xl font-bold"
                      >
                        {formatCurrency(annualCost)}
                      </motion.p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Potential Savings */}
              <Card className="bg-card/60 backdrop-blur-sm border-primary/10">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-500/10 rounded-full">
                      <CostSavingsIcon />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-0.5">Potential Savings</p>
                      <motion.p 
                        key={potentialSavings.totalSavingsAmount}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-xl font-bold text-green-500"
                      >
                        {formatCurrency(potentialSavings.totalSavingsAmount * 12)}/year
                      </motion.p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
      
      {/* Monthly Budget Section */}
      <section>
        <div className="mb-6">
          <h2 className="text-2xl font-semibold tracking-tight mb-1">
            Monthly Budget
          </h2>
          <p className="text-muted-foreground">
            Define your monthly cloud infrastructure budget
          </p>
          <Separator className="mt-2" />
        </div>
        
        <BudgetSlider
          value={monthlyBudgetUSD}
          onChange={handleBudgetChange}
        />
      </section>
      
      {/* Budget Flexibility Section */}
      <section>
        <div className="mb-6">
          <h2 className="text-2xl font-semibold tracking-tight mb-1">
            Budget Flexibility
          </h2>
          <p className="text-muted-foreground">
            Define how much your budget can flex to accommodate optimal solutions
          </p>
          <Separator className="mt-2" />
        </div>
        
        <BudgetFlexibilitySelector
          value={budgetFlexibilityPercent}
          onChange={handleFlexibilityChange}
        />
      </section>
      
      {/* Cost Optimization Section */}
      <section>
        <div className="mb-6">
          <h2 className="text-2xl font-semibold tracking-tight mb-1">
            Cost Optimization
          </h2>
          <p className="text-muted-foreground">
            Select strategies to reduce your cloud infrastructure costs
          </p>
          <Separator className="mt-2" />
        </div>
        
        <CostOptimizationSelector />
      </section>
      
      {/* Budget Impact Section */}
      <section>
        <div className="mb-6">
          <h2 className="text-2xl font-semibold tracking-tight mb-1">
            Budget Impact Analysis
          </h2>
          <p className="text-muted-foreground">
            Understand how your budget affects architectural quality
          </p>
          <Separator className="mt-2" />
        </div>
        
        <BudgetQualityImpact />
      </section>
      
      {/* Budget Summary with Visual Flair */}
      <section>
        <div className="mb-6">
          <h2 className="text-2xl font-semibold tracking-tight mb-1">
            Budget Summary
          </h2>
          <p className="text-muted-foreground">
            Overview of your budget configuration
          </p>
          <Separator className="mt-2" />
        </div>
        
        <div className="bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 rounded-lg p-6 border border-primary/10">
          <div className="grid grid-cols-1 gap-8">
            {/* Budget visualization */}
            <div>
              <h3 className="text-base font-medium mb-4">Expected Annual Costs</h3>
              <div className="relative pt-6">
                {/* Base budget bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Base Budget</span>
                    <span className="font-medium">{formatCurrency(annualCost)}</span>
                  </div>
                  <div className="h-3 w-full bg-muted rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-primary"
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 1, delay: 0.1 }}
                    />
                  </div>
                </div>
                
                {/* Savings bar */}
                {potentialSavings.totalSavingsAmount > 0 && (
                  <div className="space-y-2 mt-4">
                    <div className="flex justify-between text-sm">
                      <span>With Optimizations</span>
                      <motion.span 
                        key={optimizedAnnualCost}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="font-medium"
                      >
                        {formatCurrency(optimizedAnnualCost)}
                      </motion.span>
                    </div>
                    <div className="h-3 w-full bg-muted rounded-full overflow-hidden">
                      <motion.div 
                        className="h-full bg-green-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${100 - potentialSavings.totalSavingsPercentage}%` }}
                        transition={{ duration: 1, delay: 0.4 }}
                      />
                    </div>
                  </div>
                )}
                
                {/* Flexibility indicator */}
                {budgetFlexibilityPercent > 0 && (
                  <div className="space-y-2 mt-4">
                    <div className="flex justify-between text-sm">
                      <span>Maximum Flexibility</span>
                      <motion.span 
                        key={totalBudgetWithFlexibility}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="font-medium"
                      >
                        {formatCurrency(totalBudgetWithFlexibility * 12)}
                      </motion.span>
                    </div>
                    <div className="h-3 w-full bg-muted rounded-full overflow-hidden relative">
                      <div className="h-full bg-primary/30" style={{ width: "100%" }} />
                      <motion.div 
                        className="absolute top-0 right-0 h-full border-l-2 border-primary border-dashed"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.7 }}
                        style={{ left: "100%" }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Recommendations based on budget selections */}
            {/* <div className="pt-4 border-t border-border/50">
              <h3 className="text-base font-medium mb-3">Recommendations</h3>
              <div className="space-y-2">
                {monthlyBudgetUSD < 1000 && (
                  <p className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    Consider serverless architecture to minimize costs with your limited budget
                  </p>
                )}
                
                {budgetFlexibilityPercent < 10 && (
                  <p className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    With limited budget flexibility, prioritize core infrastructure components and minimize optional features
                  </p>
                )}
                
                {monthlyBudgetUSD >= 5000 && !willConsiderReservedInstances && (
                  <p className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    Your budget level would benefit significantly from reserved instances, enabling substantial cost savings
                  </p>
                )}
                
                {potentialSavings.totalSavingsPercentage < 10 && (
                  <p className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    Explore additional cost optimization strategies to maximize your infrastructure budget efficiency
                  </p>
                )}
                
               
                <p className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  Regularly monitor and optimize resource usage to ensure you're getting maximum value from your cloud budget
                </p>
              </div>
            </div> */}
          </div>
        </div>
      </section>
    </div>
  );
}