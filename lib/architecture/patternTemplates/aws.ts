import { 
  BaseProviderPatternTemplate,
  CloudPatternTemplate,
  ConcreteTemplateComponent,
  createEmptyPatternTemplate,
  createTemplateConnection,
  ArchitecturePatternType
} from './base';
import { 
  ArchitectureTemplate, 
  ComponentType, 
  ComplexityPreference, 
  ConnectionType, 
  CloudArchitecture,
  ArchitectureComponent,
  ComponentConnection,
  ComponentSpecs,
  ComputeSpecs,
  DatabaseSpecs,
  StorageSpecs,
  NetworkSpecs,
  SecuritySpecs,
  TemplateComponent,
  PricingModel
} from '@/types/architecture';

import { CloudProvider } from '@/lib/store/applicationState';
import { 
  ApplicationType, 
  SecurityLevel, 
  TrafficPattern, 
  AvailabilityLevel, 
  DataType,
  GeographicRegion
} from '@/types';

import { 
  ProviderServiceDescriptor, 
  getProvider
} from '@/lib/providers/providerAdapter';

import { 
  getAwsServiceById, 
  EC2, 
  S3, 
  RDS, 
  LAMBDA, 
  DYNAMODB, 
  VPC,
  // ELB,
  // ECS,
  // ROUTE53,
  // CLOUDFRONT,
  // ELASTICACHE,
  // WAF,
  // CLOUDWATCH,
  // SNS
} from '@/lib/providers/aws/services';

/**
 * AWS Pattern Template Implementation
 * 
 * Provides pre-configured architecture patterns optimized for AWS
 * with best practices and AWS-specific optimizations.
 */
export class AWSPatternTemplate extends BaseProviderPatternTemplate {
  constructor() {
    super('aws');
    
    // Register all predefined patterns
    this.registerAllPatterns();
  }
  
  /**
   * Generate concrete architecture from template
   */
  generateArchitectureFromTemplate(
    template: CloudPatternTemplate,
    region: string,
    additionalRequirements?: Record<string, any>
  ): CloudArchitecture {
    // Get provider implementation for service instantiation
    const providerImpl = getProvider('aws');
    if (!providerImpl) {
      throw new Error('AWS provider implementation not found');
    }
    
    // Start with an empty architecture
    const architecture: CloudArchitecture = {
      id: `aws-arch-${Date.now()}`,
      name: template.name,
      description: template.description,
      provider: 'aws',
      components: [],
      connections: [],
      regions: [{
        id: region,
        name: this.getRegionDisplayName(region),
        provider: 'aws',
        continent: this.getRegionContinent(region),
        latitude: this.getRegionLatitude(region),
        longitude: this.getRegionLongitude(region),
        services: [] // Available services in this region
      }],
      estimatedCost: {
        monthlyCost: {
          amount: template.estimatedCostRange.min,
          currency: template.estimatedCostRange.currency,
          confidence: 'low'
        },
        breakdown: [],
        assumptions: [
          `Based on ${template.complexity} implementation`,
          'Actual costs may vary based on usage patterns',
          `Estimated from pattern: ${template.name}`
        ]
      },
      complexityLevel: template.complexity,
      tags: ['aws', template.patternType, template.complexity],
      generatedAt: new Date(),
      lastUpdated: new Date()
    };
    
    // Create component ID mapping for connections
    const componentIdMap: Record<string, string> = {};
    
    // Transform template components into concrete architecture components
    for (const templateComponent of template.components) {
      // Skip if component is conditional and condition not met
      if (
        templateComponent.conditionalOn && 
        additionalRequirements && 
        additionalRequirements[templateComponent.conditionalOn.feature] !== 
        templateComponent.conditionalOn.value
      ) {
        continue;
      }
      
      // Get concrete service for this template component
      const concreteComponent = this.getServiceForTemplateComponent(templateComponent);
      if (!concreteComponent) {
        console.warn(`No concrete service found for component: ${templateComponent.id}`);
        continue;
      }
      
      // Create component specs based on type
      const specs = this.createComponentSpecs(
        templateComponent.type, 
        template.complexity,
        additionalRequirements
      );
      
      // Create the architecture component
      const component = providerImpl.createComponent(
        concreteComponent.id,
        specs,
        region,
        templateComponent.position
      );
      
      // Apply custom configurations if component is a ConcreteTemplateComponent
      if ('serviceId' in templateComponent) {
        const concreteTemplateComponent = templateComponent as ConcreteTemplateComponent;
        
        // Apply default configuration
        component.configuration = {
          ...component.configuration,
          ...concreteTemplateComponent.defaultConfig
        };
        
        // Apply scaling configuration if defined
        if (concreteTemplateComponent.scalingConfig) {
          component.configuration.scaling = concreteTemplateComponent.scalingConfig;
        }
        
        // Set tier from template
        component.tier = concreteTemplateComponent.tier;
      }
      
      // Add custom naming
      component.name = this.generateComponentName(
        templateComponent.name, 
        template.patternType,
        component.type
      );
      
      // Store mapping from template ID to concrete ID
      componentIdMap[templateComponent.id] = component.id;
      
      // Add to architecture
      architecture.components.push(component);
    }
    
    // Create connections
    for (const templateConnection of template.connections) {
      // Skip if either source or target component was not created
      if (
        !componentIdMap[templateConnection.sourceId] || 
        !componentIdMap[templateConnection.targetId]
      ) {
        continue;
      }
      
      // Create the connection
      const connection: ComponentConnection = {
        id: `conn-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        sourceId: componentIdMap[templateConnection.sourceId],
        targetId: componentIdMap[templateConnection.targetId],
        type: templateConnection.type,
        configuration: {},
        description: this.generateConnectionDescription(
          templateConnection.type,
          componentIdMap[templateConnection.sourceId],
          componentIdMap[templateConnection.targetId]
        )
      };
      
      architecture.connections.push(connection);
    }
    
    return architecture;
  }
  
  /**
   * Get service for a template component
   */
  getServiceForTemplateComponent(
    component: TemplateComponent
  ): ProviderServiceDescriptor | null {
    if ('serviceId' in component) {
      // If it's already a ConcreteTemplateComponent, just get the service
      const concreteComponent = component as ConcreteTemplateComponent;
      return getAwsServiceById(concreteComponent.serviceId);
    }
    
    // Otherwise, recommend the best service for this component type
    return this.recommendServiceForComponent(component.type);
  }
  
  /**
   * Recommend the best AWS service for a component type
   */
  private recommendServiceForComponent(
    componentType: ComponentType
  ): ProviderServiceDescriptor | null {
    // Map component types to specific AWS services
    switch (componentType) {
      case ComponentType.VM:
        return EC2;
      case ComponentType.OBJECT_STORAGE:
        return S3;
      case ComponentType.RELATIONAL_DB:
        return RDS;
      case ComponentType.FUNCTION:
        return LAMBDA;
      case ComponentType.KEY_VALUE_DB:
        return DYNAMODB;
      case ComponentType.VPC:
        return VPC;
      case ComponentType.LOAD_BALANCER:
        return getAwsServiceById('aws-elb');
      case ComponentType.CDN:
        return getAwsServiceById('aws-cloudfront');
      case ComponentType.CACHE:
        return getAwsServiceById('aws-elasticache');
      case ComponentType.DNS:
        return getAwsServiceById('aws-route53');
      case ComponentType.WAF:
        return getAwsServiceById('aws-waf');
      case ComponentType.MONITORING:
        return getAwsServiceById('aws-cloudwatch');
      case ComponentType.NOTIFICATION:
        return getAwsServiceById('aws-sns');
      
      default:
        // Try to find a matching service by type
        const service = getAwsServiceById(`aws-${componentType}`);
        return service;
    }
  }
  
  /**
   * Create component specifications based on component type and complexity
   */
  private createComponentSpecs(
    type: ComponentType,
    complexity: ComplexityPreference,
    additionalRequirements?: Record<string, any>
  ): ComponentSpecs {
    // Complexity multipliers
    const complexityMultiplier = {
      'simple': 1,
      'balanced': 2,
      'advanced': 4
    }[complexity] || 1;
    
    switch (type) {
      case ComponentType.VM:
        return {
          type: 'compute',
          cpu: {
            cores: 2 * complexityMultiplier
          },
          memory: {
            amount: 4 * complexityMultiplier,
            unit: 'GB'
          },
          scalingPolicy: complexity !== 'simple' ? {
            min: 2,
            max: 5 * complexityMultiplier,
            targetCpuUtilization: 70
          } : undefined
        } as ComputeSpecs;
        
      case ComponentType.RELATIONAL_DB:
        return {
          type: 'database',
          engine: 'mysql',
          version: '8.0',
          storage: {
            amount: 20 * complexityMultiplier,
            unit: 'GB'
          },
          replicas: complexity === 'simple' ? 0 : complexity === 'balanced' ? 1 : 2,
          backupEnabled: true,
          encryptionEnabled: true,
          highAvailability: complexity !== 'simple'
        } as DatabaseSpecs;
        
      case ComponentType.OBJECT_STORAGE:
        return {
          type: 'storage',
          capacity: {
            amount: 100 * complexityMultiplier,
            unit: 'GB'
          },
          redundancy: 'region'
        } as StorageSpecs;
        
      case ComponentType.VPC:
        return {
          type: 'network',
          publicAccess: true,
          encryption: true
        } as NetworkSpecs;
        
      case ComponentType.FIREWALL:
      case ComponentType.WAF:
        return {
          type: 'security',
          encryptionInTransit: true,
          encryptionAtRest: true,
          networkIsolation: complexity !== 'simple'
        } as SecuritySpecs;
        
      default:
        // Default specs based on category
        if (type.includes('database')) {
          return {
            type: 'database',
            engine: 'default',
            version: 'latest',
            storage: {
              amount: 20 * complexityMultiplier,
              unit: 'GB'
            }
          } as DatabaseSpecs;
        }
        
        if (type.includes('storage')) {
          return {
            type: 'storage',
            capacity: {
              amount: 100 * complexityMultiplier,
              unit: 'GB'
            }
          } as StorageSpecs;
        }
        
        // Fallback to compute
        return {
          type: 'compute',
          cpu: {
            cores: 2
          },
          memory: {
            amount: 4,
            unit: 'GB'
          }
        } as ComputeSpecs;
    }
  }
  
  /**
   * Register all predefined patterns
   */
  private registerAllPatterns(): void {
    // Register web application patterns
    this.registerWebApplicationPatterns();
    
    // In future implementation parts, we'll register:
    // this.registerEcommercePatterns();
    // this.registerCMSPatterns();
    // this.registerAPIServicePatterns();
    // this.registerMobileBackendPatterns();
    // etc.
  }
  
  /**
   * Register web application patterns
   */
  private registerWebApplicationPatterns(): void {
    // Simple web application pattern (single EC2 + RDS + S3)
    const simpleWebPattern = createEmptyPatternTemplate(
      'aws',
      ArchitecturePatternType.WEB_APPLICATION,
      'simple'
    );
    
    // Update with AWS-specific properties
    simpleWebPattern.name = 'AWS Simple Web Application';
    simpleWebPattern.description = 'Basic web application with single EC2 instance, RDS database, and S3 for static assets';
    simpleWebPattern.requiredServices = [
      ComponentType.VM,
      ComponentType.RELATIONAL_DB,
      ComponentType.OBJECT_STORAGE
    ];
    simpleWebPattern.optionalServices = [
      ComponentType.VPC,
      ComponentType.CACHE
    ];
    simpleWebPattern.recommendedRegions = [
      'us-east-1', 'us-west-2', 'eu-west-1', 'ap-southeast-1'
    ];
    simpleWebPattern.estimatedCostRange = {
      min: 60,
      max: 100,
      currency: 'USD'
    };
    
    // Add best practices
    simpleWebPattern.bestPractices = [
      'Use parameter store for configuration',
      'Enable CloudWatch monitoring for EC2 and RDS',
      'Configure regular RDS snapshots',
      'Use S3 to host static content',
      'Configure SSL for your domain'
    ];
    
    // Add security considerations
    simpleWebPattern.securityConsiderations = [
      'Restrict SSH access to your EC2 instance',
      'Place RDS in a private subnet',
      'Use security groups to control traffic',
      'Enable encryption for RDS and S3',
      'Regularly patch EC2 instance'
    ];
    
    // Add scalability considerations
    simpleWebPattern.scalabilityConsiderations = [
      'Manually scale EC2 instance size for traffic increases',
      'Consider upgrading to standard architecture when load increases',
      'Vertical scaling has limits - plan for horizontal scaling',
      'Cache database queries at application level',
      'Monitor RDS performance metrics for bottlenecks'
    ];
    
    // Add reliability considerations
    simpleWebPattern.reliabilityConsiderations = [
      'Single EC2 instance is a single point of failure',
      'Consider regular AMI backups of your EC2',
      'Enable automatic RDS backups',
      'Implement application-level retry logic',
      'Simple architecture has reduced resilience to failures'
    ];
    
    // Add components
    simpleWebPattern.components = [
      // VPC component
      {
        id: 'vpc',
        type: ComponentType.VPC,
        name: 'Main VPC',
        required: true,
        position: { x: 400, y: 100 }
      },
      
      // EC2 instance
      {
        id: 'web-server',
        type: ComponentType.VM,
        name: 'Web Server',
        required: true,
        serviceId: 'aws-ec2',
        tier: 'standard',
        defaultConfig: {
          instanceType: 't3.small',
          ami: 'amazon-linux-2',
          securityGroupRules: [
            { protocol: 'tcp', fromPort: 80, toPort: 80, cidrIp: '0.0.0.0/0' },
            { protocol: 'tcp', fromPort: 443, toPort: 443, cidrIp: '0.0.0.0/0' }
          ]
        },
        position: { x: 400, y: 250 }
      } as ConcreteTemplateComponent,
      
      // RDS instance
      {
        id: 'database',
        type: ComponentType.RELATIONAL_DB,
        name: 'Application Database',
        required: true,
        serviceId: 'aws-rds',
        tier: 'standard',
        defaultConfig: {
          engine: 'mysql',
          version: '8.0',
          instanceClass: 'db.t3.small',
          multiAZ: false,
          allocatedStorage: 20,
          backupRetentionPeriod: 7
        },
        position: { x: 400, y: 400 }
      } as ConcreteTemplateComponent,
      
      // S3 bucket
      {
        id: 'storage',
        type: ComponentType.OBJECT_STORAGE,
        name: 'Static Assets',
        required: true,
        serviceId: 'aws-s3',
        tier: 'standard',
        defaultConfig: {
          versioning: true,
          publicAccess: false,
          encryption: true,
          lifecycleRules: []
        },
        position: { x: 600, y: 250 }
      } as ConcreteTemplateComponent
    ];
    
    // Add connections
    simpleWebPattern.connections = [
      // Web Server to Database
      createTemplateConnection('web-server', 'database', ConnectionType.DATA_FLOW),
      
      // Web Server to S3
      createTemplateConnection('web-server', 'storage', ConnectionType.DATA_FLOW),
      
      // Components to VPC
      createTemplateConnection('web-server', 'vpc', ConnectionType.DEPENDENCY),
      createTemplateConnection('database', 'vpc', ConnectionType.DEPENDENCY)
    ];
    
    // Register the pattern
    this.registerPattern(simpleWebPattern);
    
            // Balanced (Standard) Web Application Pattern with improved HA and scaling
            const balancedWebPattern = createEmptyPatternTemplate(
              'aws',
              ArchitecturePatternType.WEB_APPLICATION,
              'balanced'
            );
            
            // Update with AWS-specific properties
            balancedWebPattern.name = 'AWS Standard Web Application';
            balancedWebPattern.description = 'Production-ready web application with load balancing, auto-scaling, multi-AZ database, and CDN';
            balancedWebPattern.requiredServices = [
              ComponentType.LOAD_BALANCER,
              ComponentType.VM,
              ComponentType.RELATIONAL_DB,
              ComponentType.OBJECT_STORAGE,
              ComponentType.CDN,
              ComponentType.VPC
            ];
            balancedWebPattern.optionalServices = [
              ComponentType.CACHE,
              ComponentType.DNS,
              ComponentType.WAF,
              ComponentType.MONITORING
            ];
            balancedWebPattern.recommendedRegions = [
              'us-east-1', 'us-west-2', 'eu-west-1', 'ap-southeast-1', 'ap-northeast-1'
            ];
            balancedWebPattern.estimatedCostRange = {
              min: 150,
              max: 300,
              currency: 'USD'
            };
            
            // Add best practices
            balancedWebPattern.bestPractices = [
              'Configure CloudWatch alarms for key metrics',
              'Use EC2 Auto Scaling Groups for horizontal scaling',
              'Implement Multi-AZ RDS for high availability',
              'Set up regular automated backups',
              'Use CloudFront to reduce latency and improve security',
              'Implement proper security groups and NACLs',
              'Use parameter store for sensitive configuration',
              'Implement proper logging and monitoring',
              'Set up separate environments (dev/stage/prod)'
            ];
            
            // Add security considerations
            balancedWebPattern.securityConsiderations = [
              'Use security groups to restrict traffic between tiers',
              'Place web tier in public subnets, app/data tiers in private subnets',
              'Implement AWS WAF for protection against common attacks',
              'Enable AWS Shield Standard for DDoS protection',
              'Use TLS for all connections (Load Balancer, CloudFront)',
              'Enable encryption at rest for all data stores',
              'Implement proper IAM roles with least privilege',
              'Regularly rotate credentials and audit access'
            ];
            
            // Add scalability considerations
            balancedWebPattern.scalabilityConsiderations = [
              'Implement auto-scaling groups for web and application tiers',
              'Scale horizontally with additional EC2 instances under load',
              'Configure CloudWatch alarms to trigger scaling events',
              'Use ElastiCache to reduce database load',
              'Implement read replicas for the database to handle read-heavy workloads',
              'Use CloudFront to offload static content delivery',
              'Consider scheduled scaling for predictable traffic patterns'
            ];
            
            // Add reliability considerations
            balancedWebPattern.reliabilityConsiderations = [
              'Use Multi-AZ deployments for the database',
              'Distribute EC2 instances across multiple Availability Zones',
              'Implement health checks and auto-recovery',
              'Configure proper backup and restore procedures',
              'Implement graceful degradation for component failures',
              'Use Route 53 for DNS failover if needed',
              'Design for failure - assume components will fail'
            ];
            
            // Add components
            balancedWebPattern.components = [
              // VPC with public and private subnets
              {
                id: 'vpc',
                type: ComponentType.VPC,
                name: 'Web Application VPC',
                required: true,
                serviceId: 'aws-vpc',
                tier: 'standard',
                defaultConfig: {
                  cidrBlock: '10.0.0.0/16',
                  enableDnsSupport: true,
                  enableDnsHostnames: true,
                  subnets: [
                    { type: 'public', cidrBlock: '10.0.0.0/24', availabilityZone: 'a' },
                    { type: 'public', cidrBlock: '10.0.1.0/24', availabilityZone: 'b' },
                    { type: 'private', cidrBlock: '10.0.2.0/24', availabilityZone: 'a' },
                    { type: 'private', cidrBlock: '10.0.3.0/24', availabilityZone: 'b' },
                    { type: 'database', cidrBlock: '10.0.4.0/24', availabilityZone: 'a' },
                    { type: 'database', cidrBlock: '10.0.5.0/24', availabilityZone: 'b' }
                  ]
                },
                position: { x: 400, y: 100 }
              } as ConcreteTemplateComponent,
            
              // Load Balancer
              {
                id: 'alb',
                type: ComponentType.LOAD_BALANCER,
                name: 'Application Load Balancer',
                required: true,
                serviceId: 'aws-elb',
                tier: 'standard',
                defaultConfig: {
                  type: 'application',
                  scheme: 'internet-facing',
                  securityGroups: ['allow-http-https'],
                  listeners: [
                    { protocol: 'HTTPS', port: 443, defaultAction: 'forward-to-web-target-group' },
                    { protocol: 'HTTP', port: 80, defaultAction: 'redirect-to-https' }
                  ],
                  targetGroups: [
                    { name: 'web-target-group', protocol: 'HTTP', port: 80, healthCheck: { path: '/health', interval: 30 } }
                  ]
                },
                position: { x: 400, y: 200 }
              } as ConcreteTemplateComponent,
            
              // Auto Scaling Group with EC2 instances
              {
                id: 'web-asg',
                type: ComponentType.VM,
                name: 'Web Server Auto Scaling Group',
                required: true,
                serviceId: 'aws-ec2',
                tier: 'standard',
                defaultConfig: {
                  instanceType: 't3.small',
                  ami: 'amazon-linux-2',
                  autoScalingGroup: {
                    minSize: 2,
                    maxSize: 6,
                    desiredCapacity: 2,
                    healthCheckType: 'ELB',
                    healthCheckGracePeriod: 300,
                    targetGroups: ['web-target-group']
                  },
                  scalingPolicies: [
                    { 
                      type: 'target-tracking', 
                      metric: 'CPUUtilization', 
                      targetValue: 70, 
                      scaleOutCooldown: 300, 
                      scaleInCooldown: 300 
                    }
                  ],
                  securityGroupRules: [
                    { protocol: 'tcp', fromPort: 80, toPort: 80, source: 'alb-security-group' }
                  ]
                },
                position: { x: 400, y: 300 }
              } as ConcreteTemplateComponent,
            
              // RDS Multi-AZ
              {
                id: 'database',
                type: ComponentType.RELATIONAL_DB,
                name: 'Application Database (Multi-AZ)',
                required: true,
                serviceId: 'aws-rds',
                tier: 'standard',
                defaultConfig: {
                  engine: 'mysql',
                  version: '8.0',
                  instanceClass: 'db.t3.medium',
                  multiAZ: true,
                  allocatedStorage: 50,
                  storageType: 'gp2',
                  backupRetentionPeriod: 7,
                  autoMinorVersionUpgrade: true,
                  deletionProtection: true,
                  enablePerformanceInsights: true,
                  securityGroupRules: [
                    { protocol: 'tcp', fromPort: 3306, toPort: 3306, source: 'web-security-group' }
                  ]
                },
                position: { x: 400, y: 500 }
              } as ConcreteTemplateComponent,
            
              // S3 for static assets
              {
                id: 'storage',
                type: ComponentType.OBJECT_STORAGE,
                name: 'Static Assets Bucket',
                required: true,
                serviceId: 'aws-s3',
                tier: 'standard',
                defaultConfig: {
                  versioning: true,
                  publicAccess: false,
                  encryption: true,
                  lifecycleRules: [
                    {
                      prefix: 'logs/',
                      transitionDays: 30,
                      transitionStorage: 'STANDARD_IA',
                      expirationDays: 90
                    }
                  ]
                },
                position: { x: 200, y: 300 }
              } as ConcreteTemplateComponent,
            
              // CloudFront Distribution
              {
                id: 'cdn',
                type: ComponentType.CDN,
                name: 'Content Delivery Network',
                required: true,
                serviceId: 'aws-cloudfront',
                tier: 'standard',
                defaultConfig: {
                  priceClass: 'PriceClass_100', // US, Canada, Europe
                  httpVersion: 'http2',
                  defaultTTL: 86400, // 1 day
                  minTTL: 0,
                  maxTTL: 31536000, // 1 year
                  origins: [
                    { id: 's3-origin', domainName: '${storage}.s3.amazonaws.com', s3OriginConfig: true },
                    { id: 'alb-origin', domainName: '${alb}.amazonaws.com', customOriginConfig: { httpPort: 80, httpsPort: 443 } }
                  ],
                  defaultBehavior: {
                    targetOriginId: 'alb-origin',
                    compress: true,
                    viewerProtocolPolicy: 'redirect-to-https',
                    allowedMethods: ['GET', 'HEAD', 'OPTIONS', 'PUT', 'POST', 'PATCH', 'DELETE']
                  },
                  orderedCacheBehaviors: [
                    {
                      pathPattern: '/static/*',
                      targetOriginId: 's3-origin',
                      compress: true,
                      viewerProtocolPolicy: 'redirect-to-https',
                      allowedMethods: ['GET', 'HEAD', 'OPTIONS'],
                      cachedMethods: ['GET', 'HEAD', 'OPTIONS'],
                      forwardedValues: { queryString: false, cookies: { forward: 'none' } }
                    }
                  ]
                },
                position: { x: 600, y: 200 }
              } as ConcreteTemplateComponent,
            
              // ElastiCache (Optional)
              {
                id: 'cache',
                type: ComponentType.CACHE,
                name: 'Redis Cache',
                required: false,
                conditionalOn: { feature: 'dataCaching', value: true },
                serviceId: 'aws-elasticache',
                tier: 'standard',
                defaultConfig: {
                  engine: 'redis',
                  nodeType: 'cache.t3.small',
                  numNodes: 1,
                  subnetGroup: 'private-subnet-group',
                  securityGroups: ['cache-security-group'],
                  autoMinorVersionUpgrade: true
                },
                position: { x: 600, y: 400 }
              } as ConcreteTemplateComponent,
            
              // Route 53 (Optional)
              {
                id: 'dns',
                type: ComponentType.DNS,
                name: 'DNS Management',
                required: false,
                conditionalOn: { feature: 'dnsManagement', value: true },
                serviceId: 'aws-route53',
                tier: 'standard',
                defaultConfig: {
                  recordSets: [
                    { name: 'www.example.com', type: 'A', alias: { target: '${cdn}' } },
                    { name: 'api.example.com', type: 'A', alias: { target: '${alb}' } }
                  ],
                  healthChecks: [
                    { target: 'HTTPS:443/health', interval: 30, failureThreshold: 3 }
                  ]
                },
                position: { x: 600, y: 100 }
              } as ConcreteTemplateComponent,
            
              // CloudWatch
              {
                id: 'monitoring',
                type: ComponentType.MONITORING,
                name: 'Monitoring & Alerting',
                required: true,
                serviceId: 'aws-cloudwatch',
                tier: 'standard',
                defaultConfig: {
                  dashboards: ['web-application-dashboard'],
                  alarms: [
                    { name: 'high-cpu-utilization', metric: 'CPUUtilization', threshold: 80, period: 300, evaluationPeriods: 2 },
                    { name: 'high-error-rate', metric: 'HTTPCode_ELB_5XX_Count', threshold: 10, period: 60, evaluationPeriods: 5 }
                  ],
                  logGroups: ['web-application-logs', 'alb-logs', 'rds-logs'],
                  snsTopics: ['web-application-alerts']
                },
                position: { x: 200, y: 100 }
              } as ConcreteTemplateComponent
            ];
            
            // Add connections
            balancedWebPattern.connections = [
              // Internet to CloudFront
              createTemplateConnection('cdn', 'alb', ConnectionType.NETWORK),
              
              // CloudFront to S3
              createTemplateConnection('cdn', 'storage', ConnectionType.DATA_FLOW),
              
              // Load Balancer to EC2 ASG
              createTemplateConnection('alb', 'web-asg', ConnectionType.NETWORK),
              
              // EC2 to RDS
              createTemplateConnection('web-asg', 'database', ConnectionType.DATA_FLOW),
              
              // EC2 to S3
              createTemplateConnection('web-asg', 'storage', ConnectionType.DATA_FLOW),
              
              // Optional connections to ElastiCache
              createTemplateConnection('web-asg', 'cache', ConnectionType.DATA_FLOW, false),
              
              // Optional connections to Route 53
              createTemplateConnection('dns', 'cdn', ConnectionType.DEPENDENCY, false),
              createTemplateConnection('dns', 'alb', ConnectionType.DEPENDENCY, false),
              
              // Components to VPC
              createTemplateConnection('alb', 'vpc', ConnectionType.DEPENDENCY),
              createTemplateConnection('web-asg', 'vpc', ConnectionType.DEPENDENCY),
              createTemplateConnection('database', 'vpc', ConnectionType.DEPENDENCY),
              createTemplateConnection('cache', 'vpc', ConnectionType.DEPENDENCY, false),
              
              // Monitoring connections
              createTemplateConnection('monitoring', 'alb', ConnectionType.DEPENDENCY),
              createTemplateConnection('monitoring', 'web-asg', ConnectionType.DEPENDENCY),
              createTemplateConnection('monitoring', 'database', ConnectionType.DEPENDENCY),
              createTemplateConnection('monitoring', 'cache', ConnectionType.DEPENDENCY, false)
            ];
            
            // Register the pattern
            this.registerPattern(balancedWebPattern);

        // Add this to the registerWebApplicationPatterns() method after the registerPattern(balancedWebPattern); line
    
    // Advanced (Enterprise-Grade) Web Application Pattern with microservices and advanced security
    const advancedWebPattern = createEmptyPatternTemplate(
      'aws',
      ArchitecturePatternType.WEB_APPLICATION,
      'advanced'
    );
    
    // Update with AWS-specific properties
    advancedWebPattern.name = 'AWS Enterprise Web Application';
    advancedWebPattern.description = 'Enterprise-grade web application with microservices architecture, global distribution, advanced security, and high resilience';
    advancedWebPattern.requiredServices = [
      ComponentType.API_GATEWAY,
      ComponentType.CONTAINER,
      ComponentType.RELATIONAL_DB,
      ComponentType.KEY_VALUE_DB,
      ComponentType.OBJECT_STORAGE,
      ComponentType.CDN,
      ComponentType.VPC,
      ComponentType.LOAD_BALANCER,
      ComponentType.CACHE,
      ComponentType.WAF,
      ComponentType.MONITORING
    ];
    advancedWebPattern.optionalServices = [
      ComponentType.SEARCH,
      ComponentType.QUEUE,
      ComponentType.FUNCTION,
      ComponentType.DNS,
      ComponentType.LOGGING,
      ComponentType.AUTH
    ];
    advancedWebPattern.recommendedRegions = [
      'us-east-1', 'us-west-2', 'eu-west-1', 'ap-southeast-1', 'ap-northeast-1'
    ];
    advancedWebPattern.estimatedCostRange = {
      min: 1000,
      max: 5000,
      currency: 'USD'
    };
    
    // Add best practices
    advancedWebPattern.bestPractices = [
      'Implement infrastructure as code using AWS CloudFormation or Terraform',
      'Use container orchestration (ECS/EKS) for microservices',
      'Implement CI/CD pipelines for automated deployment',
      'Use AWS X-Ray for distributed tracing and debugging',
      'Implement blue/green or canary deployments for updates',
      'Use AWS Config and AWS Organizations for governance',
      'Implement comprehensive monitoring and alerting with CloudWatch',
      'Use Service Quotas and Trusted Advisor for capacity management',
      'Use multi-region deployments for disaster recovery',
      'Implement API versioning and backward compatibility strategies'
    ];
    
    // Add security considerations
    advancedWebPattern.securityConsiderations = [
      'Implement a comprehensive security strategy using AWS Well-Architected Framework',
      'Use AWS Shield Advanced for DDoS protection',
      'Implement AWS WAF with custom and managed rule sets',
      'Use AWS Security Hub for security posture management',
      'Implement fine-grained IAM policies following least privilege principle',
      'Use AWS GuardDuty for threat detection',
      'Implement AWS Macie for data classification and PII detection',
      'Use AWS KMS for encryption key management',
      'Implement security groups, NACLs, and VPC Flow Logs for network monitoring',
      'Use AWS Config Rules for compliance monitoring',
      'Implement regular security assessments and penetration testing'
    ];
    
    // Add scalability considerations
    advancedWebPattern.scalabilityConsiderations = [
      'Implement microservices architecture for independent scaling',
      'Use container orchestration with auto-scaling for compute resources',
      'Implement DynamoDB for highly scalable NoSQL needs',
      'Use Aurora for relational database scalability',
      'Implement multi-region deployment for global scale',
      'Use AWS Global Accelerator for optimized global routing',
      'Implement caching at multiple layers (CloudFront, API Gateway, ElastiCache)',
      'Use SQS/SNS for decoupling and async processing',
      'Implement data partitioning strategies for database scaling',
      'Use AWS Auto Scaling for predictive scaling based on patterns'
    ];
    
    // Add reliability considerations
    advancedWebPattern.reliabilityConsiderations = [
      'Implement multi-AZ and multi-region deployment for high availability',
      'Use Route 53 health checks and failover routing',
      'Implement circuit breakers and bulkheads in microservices',
      'Use AWS Fault Injection Simulator for chaos engineering',
      'Implement comprehensive backup and recovery procedures',
      'Use database replication across regions',
      'Implement health checks and auto-healing for all components',
      'Use AWS Step Functions for complex workflows with error handling',
      'Implement retries with exponential backoff and jitter',
      'Design for graceful degradation of non-critical components'
    ];
    
    // Add components for the advanced pattern
    advancedWebPattern.components = [
      // VPC with advanced networking
      {
        id: 'vpc',
        type: ComponentType.VPC,
        name: 'Enterprise Application VPC',
        required: true,
        serviceId: 'aws-vpc',
        tier: 'advanced',
        defaultConfig: {
          cidrBlock: '10.0.0.0/16',
          enableDnsSupport: true,
          enableDnsHostnames: true,
          subnets: [
            { type: 'public', cidrBlock: '10.0.0.0/24', availabilityZone: 'a' },
            { type: 'public', cidrBlock: '10.0.1.0/24', availabilityZone: 'b' },
            { type: 'public', cidrBlock: '10.0.2.0/24', availabilityZone: 'c' },
            { type: 'private-app', cidrBlock: '10.0.3.0/24', availabilityZone: 'a' },
            { type: 'private-app', cidrBlock: '10.0.4.0/24', availabilityZone: 'b' },
            { type: 'private-app', cidrBlock: '10.0.5.0/24', availabilityZone: 'c' },
            { type: 'private-data', cidrBlock: '10.0.6.0/24', availabilityZone: 'a' },
            { type: 'private-data', cidrBlock: '10.0.7.0/24', availabilityZone: 'b' },
            { type: 'private-data', cidrBlock: '10.0.8.0/24', availabilityZone: 'c' }
          ],
          natGateways: ['a', 'b', 'c'],
          flowLogs: true,
          transitGateway: true
        },
        position: { x: 400, y: 100 }
      } as ConcreteTemplateComponent,
    
      // CloudFront Distribution with WAF
      {
        id: 'cdn',
        type: ComponentType.CDN,
        name: 'Global Content Delivery Network',
        required: true,
        serviceId: 'aws-cloudfront',
        tier: 'advanced',
        defaultConfig: {
          priceClass: 'PriceClass_All',
          httpVersion: 'http2and3',
          enabledIPv6: true,
          defaultTTL: 86400,
          minTTL: 0,
          maxTTL: 31536000,
          originGroups: {
            enabled: true,
            failoverCriteria: {
              statusCodes: [500, 502, 503, 504]
            }
          },
          origins: [
            { id: 's3-origin', domainName: '${storage}.s3.amazonaws.com', s3OriginConfig: true },
            { id: 'api-origin', domainName: '${api-gateway}.execute-api.amazonaws.com', customOriginConfig: { httpPort: 80, httpsPort: 443 } },
            { id: 'app-origin', domainName: '${load-balancer}.amazonaws.com', customOriginConfig: { httpPort: 80, httpsPort: 443 } }
          ],
          defaultBehavior: {
            targetOriginId: 'app-origin',
            compress: true,
            viewerProtocolPolicy: 'redirect-to-https',
            allowedMethods: ['GET', 'HEAD', 'OPTIONS', 'PUT', 'POST', 'PATCH', 'DELETE'],
            cachePolicyId: 'managed-caching-optimized',
            originRequestPolicyId: 'managed-all-viewer-except-host-header'
          },
          orderedCacheBehaviors: [
            {
              pathPattern: '/static/*',
              targetOriginId: 's3-origin',
              compress: true,
              viewerProtocolPolicy: 'redirect-to-https',
              allowedMethods: ['GET', 'HEAD', 'OPTIONS'],
              cachePolicyId: 'managed-caching-optimized'
            },
            {
              pathPattern: '/api/*',
              targetOriginId: 'api-origin',
              compress: true,
              viewerProtocolPolicy: 'https-only',
              allowedMethods: ['GET', 'HEAD', 'OPTIONS', 'PUT', 'POST', 'PATCH', 'DELETE'],
              cachePolicyId: 'managed-caching-disabled'
            }
          ],
          webACLId: '${waf}'
        },
        position: { x: 400, y: 200 }
      } as ConcreteTemplateComponent,
    
      // WAF
      {
        id: 'waf',
        type: ComponentType.WAF,
        name: 'Web Application Firewall',
        required: true,
        serviceId: 'aws-waf',
        tier: 'advanced',
        defaultConfig: {
          scope: 'CLOUDFRONT',
          managedRuleSets: [
            'AWSManagedRulesCommonRuleSet',
            'AWSManagedRulesAdminProtectionRuleSet',
            'AWSManagedRulesKnownBadInputsRuleSet',
            'AWSManagedRulesSQLiRuleSet'
          ],
          ipSets: {
            allowList: [],
            denyList: []
          },
          rateBasedRules: [
            {
              name: 'general-rate-limit',
              limit: 3000,
              aggregateKey: 'IP'
            }
          ],
          customRules: []
        },
        position: { x: 600, y: 200 }
      } as ConcreteTemplateComponent,
    
      // API Gateway for microservices
      {
        id: 'api-gateway',
        type: ComponentType.API_GATEWAY,
        name: 'API Management Layer',
        required: true,
        serviceId: 'aws-apigateway',
        tier: 'advanced',
        defaultConfig: {
          endpointType: 'REGIONAL',
          apiType: 'REST',
          authorizationType: 'COGNITO_USER_POOLS',
          apiKeys: true,
          usagePlans: [
            {
              name: 'standard',
              throttle: {
                rateLimit: 100,
                burstLimit: 200
              },
              quota: {
                limit: 1000000,
                period: 'MONTH'
              }
            }
          ],
          caching: {
            enabled: true,
            size: '0.5',
            ttl: 300
          },
          throttling: {
            rateLimit: 1000,
            burstLimit: 2000
          },
          routes: [
            {
              path: '/users',
              method: 'GET',
              integration: {
                type: 'HTTP_PROXY',
                uri: 'http://${container-service-user}/users',
                integrationMethod: 'GET'
              }
            },
            {
              path: '/products',
              method: 'GET',
              integration: {
                type: 'HTTP_PROXY',
                uri: 'http://${container-service-product}/products',
                integrationMethod: 'GET'
              }
            }
          ]
        },
        position: { x: 400, y: 300 }
      } as ConcreteTemplateComponent,
    
      // Load Balancer for container services
      {
        id: 'load-balancer',
        type: ComponentType.LOAD_BALANCER,
        name: 'Application Load Balancer',
        required: true,
        serviceId: 'aws-elb',
        tier: 'advanced',
        defaultConfig: {
          type: 'application',
          scheme: 'internal',
          securityGroups: ['microservices-security-group'],
          listeners: [
            { protocol: 'HTTP', port: 80, defaultAction: 'forward-to-default-target-group' }
          ],
          targetGroups: [
            { name: 'user-service-tg', protocol: 'HTTP', port: 8080, healthCheck: { path: '/health', interval: 30 } },
            { name: 'product-service-tg', protocol: 'HTTP', port: 8080, healthCheck: { path: '/health', interval: 30 } },
            { name: 'order-service-tg', protocol: 'HTTP', port: 8080, healthCheck: { path: '/health', interval: 30 } }
          ],
          routing: {
            rules: [
              { path: '/users*', targetGroup: 'user-service-tg' },
              { path: '/products*', targetGroup: 'product-service-tg' },
              { path: '/orders*', targetGroup: 'order-service-tg' }
            ]
          }
        },
        position: { x: 400, y: 400 }
      } as ConcreteTemplateComponent,
    
      // Container Services (ECS)
      {
        id: 'container-service-user',
        type: ComponentType.CONTAINER,
        name: 'User Service',
        required: true,
        serviceId: 'aws-ecs',
        tier: 'advanced',
        defaultConfig: {
          launchType: 'FARGATE',
          taskDefinition: {
            cpu: '1 vCPU',
            memory: '2 GB',
            containers: [
              {
                name: 'user-service',
                image: 'user-service:latest',
                port: 8080,
                environment: [
                  { name: 'SPRING_PROFILES_ACTIVE', value: 'production' },
                  { name: 'DB_HOST', value: '${aurora.endpoint}' }
                ],
                logging: {
                  driver: 'awslogs',
                  options: {
                    'awslogs-group': '/ecs/user-service',
                    'awslogs-region': '${region}',
                    'awslogs-stream-prefix': 'user'
                  }
                }
              }
            ]
          },
          service: {
            desiredCount: 3,
            minCount: 2,
            maxCount: 10,
            deploymentConfiguration: {
              deploymentType: 'BLUE_GREEN',
              rollbackOnFailure: true
            },
            autoScalingPolicy: {
              targetValue: 70,
              scaleOutCooldown: 60,
              scaleInCooldown: 300,
              metricType: 'ECSServiceAverageCPUUtilization'
            },
            loadBalancer: {
              targetGroupArn: 'user-service-tg',
              containerName: 'user-service',
              containerPort: 8080
            }
          }
        },
        position: { x: 200, y: 500 }
      } as ConcreteTemplateComponent,
    
      // Container for Product Service
      {
        id: 'container-service-product',
        type: ComponentType.CONTAINER,
        name: 'Product Service',
        required: true,
        serviceId: 'aws-ecs',
        tier: 'advanced',
        defaultConfig: {
          launchType: 'FARGATE',
          taskDefinition: {
            cpu: '1 vCPU',
            memory: '2 GB',
            containers: [
              {
                name: 'product-service',
                image: 'product-service:latest',
                port: 8080,
                environment: [
                  { name: 'SPRING_PROFILES_ACTIVE', value: 'production' },
                  { name: 'DB_HOST', value: '${dynamodb}' }
                ],
                logging: {
                  driver: 'awslogs',
                  options: {
                    'awslogs-group': '/ecs/product-service',
                    'awslogs-region': '${region}',
                    'awslogs-stream-prefix': 'product'
                  }
                }
              }
            ]
          },
          service: {
            desiredCount: 3,
            minCount: 2,
            maxCount: 10,
            deploymentConfiguration: {
              deploymentType: 'BLUE_GREEN',
              rollbackOnFailure: true
            },
            autoScalingPolicy: {
              targetValue: 70,
              scaleOutCooldown: 60,
              scaleInCooldown: 300,
              metricType: 'ECSServiceAverageCPUUtilization'
            },
            loadBalancer: {
              targetGroupArn: 'product-service-tg',
              containerName: 'product-service',
              containerPort: 8080
            }
          }
        },
        position: { x: 400, y: 500 }
      } as ConcreteTemplateComponent,
    
              // Aurora Database
        {
          id: 'aurora',
          type: ComponentType.RELATIONAL_DB,
          name: 'Aurora PostgreSQL Cluster',
          required: true,
          serviceId: 'aws-aurora',
          tier: 'advanced',
          defaultConfig: {
            engine: 'aurora-postgresql',
            engineVersion: '14.6',
            instanceClass: 'db.r6g.large',
            instances: 3, // 1 writer, 2 readers
            multiAZ: true,
            storageEncrypted: true,
            deletionProtection: true,
            backupRetentionPeriod: 35,
            enablePerformanceInsights: true,
            performanceInsightsRetention: 7,
            monitoringInterval: 10,
            enableCloudwatchLogsExport: ['postgresql'],
            parameterGroup: {
              family: 'aurora-postgresql14',
              parameters: {
                'shared_buffers': '{DBInstanceClassMemory/32768}',
                'max_connections': '1000',
                'log_statement': 'ddl',
                'log_min_duration_statement': '1000'
              }
            },
            securityGroupRules: [
              { protocol: 'tcp', fromPort: 5432, toPort: 5432, source: 'container-services-sg' }
            ]
          },
          position: { x: 200, y: 600 }
        } as ConcreteTemplateComponent,
      
        // DynamoDB
        {
          id: 'dynamodb',
          type: ComponentType.KEY_VALUE_DB,
          name: 'Product Catalog Database',
          required: true,
          serviceId: 'aws-dynamodb',
          tier: 'advanced',
          defaultConfig: {
            billingMode: 'PAY_PER_REQUEST',
            tableClass: 'STANDARD',
            tables: [
              {
                name: 'Products',
                attributes: [
                  { name: 'productId', type: 'S' },
                  { name: 'category', type: 'S' },
                  { name: 'price', type: 'N' },
                  { name: 'createdAt', type: 'N' }
                ],
                keySchema: [
                  { attributeName: 'productId', keyType: 'HASH' }
                ],
                globalSecondaryIndexes: [
                  {
                    indexName: 'CategoryIndex',
                    keySchema: [
                      { attributeName: 'category', keyType: 'HASH' },
                      { attributeName: 'createdAt', keyType: 'RANGE' }
                    ],
                    projection: { projectionType: 'ALL' }
                  }
                ],
                pointInTimeRecovery: true,
                encryption: 'KMS'
              }
            ],
            streams: {
              enabled: true,
              viewType: 'NEW_AND_OLD_IMAGES'
            },
            daxEnabled: true
          },
          position: { x: 400, y: 600 }
        } as ConcreteTemplateComponent,
      
        // ElastiCache
        {
          id: 'cache',
          type: ComponentType.CACHE,
          name: 'Distributed Cache Cluster',
          required: true,
          serviceId: 'aws-elasticache',
          tier: 'advanced',
          defaultConfig: {
            engine: 'redis',
            engineVersion: '6.x',
            nodeType: 'cache.r6g.large',
            numNodes: 3,
            replicationGroups: {
              numReplicas: 2,
              multiAZ: true,
              automaticFailover: true
            },
            securityGroupRules: [
              { protocol: 'tcp', fromPort: 6379, toPort: 6379, source: 'container-services-sg' }
            ],
            parameterGroup: {
              family: 'redis6.x',
              parameters: {
                'maxmemory-policy': 'volatile-lru'
              }
            },
            autoMinorVersionUpgrade: true,
            maintenanceWindow: 'sun:05:00-sun:07:00',
            transitEncryption: true,
            atRestEncryption: true
          },
          position: { x: 600, y: 500 }
        } as ConcreteTemplateComponent,
      
        // S3 Bucket
        {
          id: 'storage',
          type: ComponentType.OBJECT_STORAGE,
          name: 'Static Assets & Media Bucket',
          required: true,
          serviceId: 'aws-s3',
          tier: 'advanced',
          defaultConfig: {
            versioning: true,
            lifecycleRules: [
              {
                prefix: 'logs/',
                transitions: [
                  { days: 30, storageClass: 'STANDARD_IA' },
                  { days: 90, storageClass: 'GLACIER' }
                ],
                expiration: { days: 365 }
              },
              {
                prefix: 'uploads/temp/',
                expiration: { days: 1 }
              }
            ],
            corsConfiguration: {
              allowedMethods: ['GET', 'HEAD'],
              allowedOrigins: ['*'],
              maxAge: 3600
            },
            encryption: {
              serverSide: 'AES256'
            },
            logging: {
              enabled: true,
              destination: 'access-logs'
            },
            publicAccess: false,
            replication: {
              enabled: true,
              destination: {
                bucket: 'backup-region-bucket',
                storageClass: 'STANDARD'
              }
            },
            intelligentTiering: {
              enabled: true,
              daysUntilArchive: 90
            }
          },
          position: { x: 600, y: 300 }
        } as ConcreteTemplateComponent,
      
        // SQS Queues
        {
          id: 'queue',
          type: ComponentType.QUEUE,
          name: 'Message Queues',
          required: false,
          conditionalOn: { feature: 'eventDriven', value: true },
          serviceId: 'aws-sqs',
          tier: 'advanced',
          defaultConfig: {
            queues: [
              {
                name: 'order-processing',
                delaySeconds: 0,
                receiveMessageWaitTime: 20,
                visibilityTimeout: 60,
                messageRetention: 345600,
                fifo: true,
                contentBasedDeduplication: true,
                dlq: {
                  name: 'order-processing-dlq',
                  maxReceiveCount: 5
                }
              }
            ],
            encryption: true
          },
          position: { x: 600, y: 400 }
        } as ConcreteTemplateComponent,
      
        // Monitoring
        {
          id: 'monitoring',
          type: ComponentType.MONITORING,
          name: 'Operations Monitoring',
          required: true,
          serviceId: 'aws-cloudwatch',
          tier: 'advanced',
          defaultConfig: {
            dashboards: ['application-dashboard', 'infrastructure-dashboard', 'business-dashboard'],
            alarms: [
              { name: 'high-api-latency', metric: 'ApiGateway-Latency', threshold: 1000, period: 60, evaluationPeriods: 3 },
              { name: 'error-rate-high', metric: 'ALB-5XX-Error-Rate', threshold: 5, period: 60, evaluationPeriods: 2 },
              { name: 'db-high-cpu', metric: 'Aurora-CPU-Utilization', threshold: 80, period: 300, evaluationPeriods: 3 },
              { name: 'cache-evictions', metric: 'ElastiCache-Evictions', threshold: 100, period: 60, evaluationPeriods: 5 }
            ],
            logGroups: [
              '/aws/apigateway/access',
              '/aws/lambda/processors',
              '/aws/ecs/user-service',
              '/aws/ecs/product-service'
            ],
            logRetention: 90,
            snsTopics: ['urgent-alerts', 'daily-summary'],
            anomalyDetection: true,
            insightRules: [
              {
                name: 'ApiErrorRateSpike',
                definition: 'SUM(METRICS(4XX)) + SUM(METRICS(5XX))'
              }
            ]
          },
          position: { x: 200, y: 200 }
        } as ConcreteTemplateComponent
      ];
      
      // Add connections for advanced pattern
      advancedWebPattern.connections = [
        // Frontend user flow
        createTemplateConnection('cdn', 'waf', ConnectionType.NETWORK),
        createTemplateConnection('cdn', 'storage', ConnectionType.DATA_FLOW),
        createTemplateConnection('cdn', 'api-gateway', ConnectionType.DATA_FLOW),
        createTemplateConnection('cdn', 'load-balancer', ConnectionType.DATA_FLOW),
        
        // API layer
        createTemplateConnection('api-gateway', 'container-service-user', ConnectionType.DATA_FLOW),
        createTemplateConnection('api-gateway', 'container-service-product', ConnectionType.DATA_FLOW),
        
        // Load balancer to services
        createTemplateConnection('load-balancer', 'container-service-user', ConnectionType.NETWORK),
        createTemplateConnection('load-balancer', 'container-service-product', ConnectionType.NETWORK),
        
        // Services to databases
        createTemplateConnection('container-service-user', 'aurora', ConnectionType.DATA_FLOW),
        createTemplateConnection('container-service-product', 'dynamodb', ConnectionType.DATA_FLOW),
        
        // Services to cache
        createTemplateConnection('container-service-user', 'cache', ConnectionType.DATA_FLOW),
        createTemplateConnection('container-service-product', 'cache', ConnectionType.DATA_FLOW),
        
        // Services to storage
        createTemplateConnection('container-service-user', 'storage', ConnectionType.DATA_FLOW),
        createTemplateConnection('container-service-product', 'storage', ConnectionType.DATA_FLOW),
        
        // Async messaging
        createTemplateConnection('container-service-user', 'queue', ConnectionType.EVENT, false),
        createTemplateConnection('container-service-product', 'queue', ConnectionType.EVENT, false),
        
        // VPC connections
        createTemplateConnection('load-balancer', 'vpc', ConnectionType.DEPENDENCY),
        createTemplateConnection('container-service-user', 'vpc', ConnectionType.DEPENDENCY),
        createTemplateConnection('container-service-product', 'vpc', ConnectionType.DEPENDENCY),
        createTemplateConnection('aurora', 'vpc', ConnectionType.DEPENDENCY),
        createTemplateConnection('cache', 'vpc', ConnectionType.DEPENDENCY),
        
        // Monitoring connections
        createTemplateConnection('monitoring', 'api-gateway', ConnectionType.DEPENDENCY),
        createTemplateConnection('monitoring', 'load-balancer', ConnectionType.DEPENDENCY),
        createTemplateConnection('monitoring', 'container-service-user', ConnectionType.DEPENDENCY),
        createTemplateConnection('monitoring', 'container-service-product', ConnectionType.DEPENDENCY),
        createTemplateConnection('monitoring', 'aurora', ConnectionType.DEPENDENCY),
        createTemplateConnection('monitoring', 'dynamodb', ConnectionType.DEPENDENCY),
        createTemplateConnection('monitoring', 'cache', ConnectionType.DEPENDENCY)
      ];
      
      // Register the advanced pattern
      this.registerPattern(advancedWebPattern);
  }
  
  /**
   * Generate human-readable name for component based on pattern
   */
  private generateComponentName(
    baseName: string, 
    patternType: ArchitecturePatternType,
    componentType: ComponentType
  ): string {
    // Clean up the pattern type for display
    const patternName = patternType
      .replace(/-/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());
    
    return `${patternName} ${baseName}`;
  }
  
  /**
   * Generate description for connection between components
   */
  private generateConnectionDescription(
    connectionType: ConnectionType,
    sourceId: string,
    targetId: string
  ): string {
    switch (connectionType) {
      case ConnectionType.DATA_FLOW:
        return 'Data flow connection for read/write operations';
      case ConnectionType.DEPENDENCY:
        return 'Resource dependency relationship';
      case ConnectionType.NETWORK:
        return 'Network traffic connection';
      case ConnectionType.EVENT:
        return 'Event-based communication';
      case ConnectionType.AUTHENTICATION:
        return 'Authentication/authorization flow';
      default:
        return 'Connection between components';
    }
  }
  
  /**
   * Get display name for AWS region
   */
  private getRegionDisplayName(regionId: string): string {
    const regionMap: Record<string, string> = {
      'us-east-1': 'US East (N. Virginia)',
      'us-east-2': 'US East (Ohio)',
      'us-west-1': 'US West (N. California)',
      'us-west-2': 'US West (Oregon)',
      'eu-west-1': 'EU West (Ireland)',
      'eu-central-1': 'EU Central (Frankfurt)',
      'ap-northeast-1': 'Asia Pacific (Tokyo)',
      'ap-southeast-1': 'Asia Pacific (Singapore)',
      'ap-southeast-2': 'Asia Pacific (Sydney)',
      'sa-east-1': 'South America (São Paulo)'
    };
    
    return regionMap[regionId] || regionId;
  }

    /**
   * Get continent for AWS region
   */
    private getRegionContinent(regionId: string): GeographicRegion {
      const continentMap: Record<string, GeographicRegion> = {
        // North America
        'us-east-1': GeographicRegion.NORTH_AMERICA,
        'us-east-2': GeographicRegion.NORTH_AMERICA,
        'us-west-1': GeographicRegion.NORTH_AMERICA,
        'us-west-2': GeographicRegion.NORTH_AMERICA,
        'ca-central-1': GeographicRegion.NORTH_AMERICA,
        // Europe
        'eu-west-1': GeographicRegion.EUROPE,
        'eu-west-2': GeographicRegion.EUROPE, 
        'eu-west-3': GeographicRegion.EUROPE,
        'eu-central-1': GeographicRegion.EUROPE,
        'eu-north-1': GeographicRegion.EUROPE,
        'eu-south-1': GeographicRegion.EUROPE,
        // Asia Pacific
        'ap-northeast-1': GeographicRegion.ASIA_PACIFIC,
        'ap-northeast-2': GeographicRegion.ASIA_PACIFIC,
        'ap-northeast-3': GeographicRegion.ASIA_PACIFIC,
        'ap-southeast-1': GeographicRegion.ASIA_PACIFIC,
        'ap-southeast-2': GeographicRegion.ASIA_PACIFIC,
        'ap-south-1': GeographicRegion.ASIA_PACIFIC,
        'ap-east-1': GeographicRegion.ASIA_PACIFIC,
        // South America
        'sa-east-1': GeographicRegion.SOUTH_AMERICA,
        // Africa
        'af-south-1': GeographicRegion.AFRICA,
        // Middle East
        'me-south-1': GeographicRegion.MIDDLE_EAST
      };
      
      return continentMap[regionId] || GeographicRegion.NORTH_AMERICA; // Default to North America
    }
  
  /**
   * Get approximate latitude for AWS region
   */
  private getRegionLatitude(regionId: string): number {
    const latitudeMap: Record<string, number> = {
      'us-east-1': 38.13, // Virginia
      'us-east-2': 40.42, // Ohio
      'us-west-1': 37.78, // N. California
      'us-west-2': 45.52, // Oregon
      'eu-west-1': 53.33, // Ireland
      'eu-central-1': 50.11, // Frankfurt
      'ap-northeast-1': 35.69, // Tokyo
      'ap-southeast-1': 1.37, // Singapore
      'ap-southeast-2': -33.86, // Sydney
      'sa-east-1': -23.55 // São Paulo
      // Add more as needed
    };
    
    return latitudeMap[regionId] || 0;
  }
  
  /**
   * Get approximate longitude for AWS region
   */
  private getRegionLongitude(regionId: string): number {
    const longitudeMap: Record<string, number> = {
      'us-east-1': -78.14, // Virginia
      'us-east-2': -82.68, // Ohio
      'us-west-1': -122.42, // N. California
      'us-west-2': -122.68, // Oregon
      'eu-west-1': -6.25, // Ireland
      'eu-central-1': 8.68, // Frankfurt
      'ap-northeast-1': 139.69, // Tokyo
      'ap-southeast-1': 103.80, // Singapore
      'ap-southeast-2': 151.20, // Sydney
      'sa-east-1': -46.63 // São Paulo
      // Add more as needed
    };
    
    return longitudeMap[regionId] || 0;
  }

}

// Export the AWS pattern template implementation
export default new AWSPatternTemplate();