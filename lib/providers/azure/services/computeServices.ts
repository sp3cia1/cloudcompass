import { ComponentType } from '@/types/architecture';
import { ProviderServiceDescriptor, ServiceCategory } from '@/lib/providers/providerAdapter';

/**
 * Azure Compute Services
 * 
 * This module provides comprehensive service descriptors for core Azure compute offerings:
 * - Azure Virtual Machines - IaaS compute instances
 * - Azure Functions - Serverless compute service
 * - Azure App Service - PaaS for web applications and APIs
 * - Azure Container Instances - Serverless container runtime
 * - Azure Kubernetes Service - Managed Kubernetes service
 * - Azure Container Apps - Serverless containers with microservices features
 */
export const computeServices: ProviderServiceDescriptor[] = [
  // =========================================
  // Azure Virtual Machines
  // =========================================
  {
    id: 'azure-virtual-machines',
    name: 'Virtual Machines',
    providerSpecificName: 'Azure Virtual Machines',
    description: 'On-demand, scalable virtual machines in the cloud.',
    provider: 'azure',
    type: ComponentType.VM,
    category: 'compute',
    tier: 'standard',
    minComplexityLevel: 'simple',
    isManagedService: false,
    capabilities: [
      'Windows and Linux operating systems',
      'Multiple VM series optimized for different workloads',
      'Vertical and horizontal scaling options',
      'Integrated with Azure networking and storage services',
      'Support for high-performance computing clusters',
      'VM Scale Sets for auto-scaling applications',
      'Availability Sets and Zones for high availability',
      'Hybrid benefits for Windows Server and SQL Server licenses',
      'Burstable VMs for cost-effective workloads',
      'Spot instances for significant cost savings on non-critical workloads'
    ],
    limitations: [
      'Limits on number of VMs per subscription/region (increasable)',
      'Cost can be higher than equivalent PaaS solutions',
      'Requires OS and application patching/maintenance',
      'VM deployment time may be several minutes',
      'Some VM sizes not available in all regions'
    ],
    regions: [
      'eastus', 'eastus2', 'westus', 'westus2', 'centralus', 
      'northeurope', 'westeurope', 'uksouth', 
      'southeastasia', 'eastasia', 'japaneast', 
      'australiaeast', 'southcentralus', 'brazilsouth'
    ],
    documentation: 'https://learn.microsoft.com/azure/virtual-machines/',
    pricingModels: [
      {
        type: 'on-demand',
        unit: 'hour',
        pricePerUnit: 0.104, // D2s v3 in East US (example)
        currency: 'USD',
        conditions: ['Pay-as-you-go pricing with per-second billing']
      },
      {
        type: 'reserved',
        unit: 'hour',
        pricePerUnit: 0.062, // Same VM with 1-year reservation
        currency: 'USD',
        conditions: ['1-year reserved instances', 'Prepayment required']
      },
      {
        type: 'spot',
        unit: 'hour',
        pricePerUnit: 0.031, // Spot pricing (can vary)
        currency: 'USD',
        conditions: ['Subject to eviction with 30-second notice', 'Variable pricing']
      }
    ],
    providerSpecificDetails: {
      vmSeries: [
        'General Purpose (B, D, Dv2, Dv3, Dsv3)',
        'Compute Optimized (F, Fs, Fsv2)',
        'Memory Optimized (E, Ev3, Esv3, M)',
        'Storage Optimized (Ls, Lsv2)',
        'GPU Optimized (NC, NCv2, NCv3, ND, NDv2)',
        'HPC (H, HB, HC, HBv2)'
      ],
      availabilityOptions: [
        'Virtual Machine Scale Sets',
        'Availability Sets',
        'Availability Zones',
        'Azure Site Recovery'
      ],
      diskTypes: [
        'Ultra Disk Storage (most premium)',
        'Premium SSD Managed Disks',
        'Standard SSD Managed Disks',
        'Standard HDD Managed Disks',
        'Ephemeral OS Disks (temporary)'
      ],
      hybridBenefits: [
        'Azure Hybrid Benefit for Windows Server',
        'Azure Hybrid Benefit for SQL Server',
        'Azure Hybrid Benefit for Linux'
      ]
    },
    resourceUrl: 'https://azure.microsoft.com/services/virtual-machines/',
    equivalentServices: [
      {
        provider: 'aws',
        serviceId: 'aws-ec2',
        compatibilityScore: 95
      },
      {
        provider: 'gcp',
        serviceId: 'gcp-compute-engine',
        compatibilityScore: 95
      },
      {
        provider: 'digitalocean',
        serviceId: 'do-droplets',
        compatibilityScore: 85
      }
    ]
  },
  
  // =========================================
  // Azure Functions
  // =========================================
  {
    id: 'azure-functions',
    name: 'Functions',
    providerSpecificName: 'Azure Functions',
    description: 'Serverless compute service to run code on-demand without managing infrastructure.',
    provider: 'azure',
    type: ComponentType.FUNCTION,
    category: 'serverless',
    tier: 'standard',
    minComplexityLevel: 'simple',
    isManagedService: true,
    capabilities: [
      'Event-driven, serverless compute platform',
      'Support for multiple languages (C#, JavaScript, Python, Java, PowerShell)',
      'Multiple hosting plans (Consumption, Premium, App Service)',
      'Automatic scaling based on demand',
      'Built-in integrations with Azure and third-party services',
      'Durable Functions for long-running workflows',
      'Local development and debugging tools',
      'HTTP triggers, timers, queues, and event-based triggers',
      'Custom bindings for connecting to data sources',
      'Integration with App Service and deployment slots'
    ],
    limitations: [
      'Execution time limits (5-10 minutes on Consumption, 60 minutes on Premium)',
      'Memory limits (1.5GB on Consumption, 14GB on Premium)',
      'Cold start latency can be an issue for infrequently executed functions',
      'Limited VM instance sizes in Consumption plan',
      'Local disk storage is temporary'
    ],
    regions: [
      'eastus', 'eastus2', 'westus', 'westus2', 'centralus',
      'northeurope', 'westeurope', 'uksouth',
      'southeastasia', 'eastasia', 'japaneast',
      'australiaeast', 'southcentralus', 'brazilsouth'
    ],
    documentation: 'https://learn.microsoft.com/azure/azure-functions/',
    pricingModels: [
      {
        type: 'on-demand',
        unit: 'request',
        pricePerUnit: 0.0000002, // $0.20 per million executions
        currency: 'USD',
        conditions: ['Consumption plan', 'Additional charges for memory and execution time']
      },
      {
        type: 'on-demand',
        unit: 'hour',
        pricePerUnit: 0.173, // EP1 Premium plan in East US
        currency: 'USD',
        conditions: ['Premium plan', 'Pre-warmed instances', 'Enhanced performance']
      },
      {
        type: 'free-tier',
        unit: 'request',
        pricePerUnit: 0,
        freeUnits: 1000000, // 1 million executions
        currency: 'USD',
        conditions: ['1 million executions free per month', '400,000 GB-s free per month']
      }
    ],
    providerSpecificDetails: {
      hostingPlans: [
        {
          name: 'Consumption Plan',
          description: 'Serverless, automatic scaling, pay per execution',
          limits: '5-minute execution, 1.5GB memory, limited concurrency'
        },
        {
          name: 'Premium Plan',
          description: 'Pre-warmed instances, enhanced performance, VNet connectivity',
          limits: '60-minute execution, up to 14GB memory, no concurrency limits'
        },
        {
          name: 'App Service Plan',
          description: 'Run on shared or dedicated VMs, predictable cost',
          limits: 'No execution time limits, memory based on VM size'
        }
      ],
      triggerTypes: [
        'HTTP trigger', 'Timer trigger', 'Blob storage trigger',
        'Queue storage trigger', 'Event Hub trigger', 'Service Bus trigger',
        'Cosmos DB trigger', 'Event Grid trigger', 'IoT Hub trigger'
      ],
      runtimes: [
        '.NET Core', 'Node.js', 'Python', 'Java', 'PowerShell'
      ],
      durableFunctionsPatterns: [
        'Function chaining', 'Fan-out/fan-in', 'Async HTTP APIs',
        'Monitoring', 'Human interaction', 'Aggregator'
      ]
    },
    resourceUrl: 'https://azure.microsoft.com/services/functions/',
    equivalentServices: [
      {
        provider: 'aws',
        serviceId: 'aws-lambda',
        compatibilityScore: 90
      },
      {
        provider: 'gcp',
        serviceId: 'gcp-cloud-functions',
        compatibilityScore: 85
      },
      {
        provider: 'firebase',
        serviceId: 'firebase-functions',
        compatibilityScore: 80
      },
      {
        provider: 'digitalocean',
        serviceId: 'do-functions',
        compatibilityScore: 75
      }
    ]
  },
  
  // =========================================
  // Azure App Service
  // =========================================
  {
    id: 'azure-app-service',
    name: 'App Service',
    providerSpecificName: 'Azure App Service',
    description: 'PaaS platform for building and hosting web apps, mobile backends, and APIs.',
    provider: 'azure',
    type: ComponentType.VM,
    category: 'compute',
    tier: 'standard',
    minComplexityLevel: 'simple',
    isManagedService: true,
    capabilities: [
      'Fully managed platform for web applications',
      'Support for multiple languages and frameworks (.NET, Java, Node.js, Python, PHP)',
      'Built-in CI/CD integration with GitHub, Azure DevOps, and other tools',
      'Auto-scaling and load balancing capabilities',
      'SSL certificates and custom domain support',
      'Authentication and authorization',
      'VNet integration for secure connectivity',
      'Deployment slots for zero-downtime deployments',
      'Integrated diagnostics and monitoring',
      'Automatic OS and runtime patching'
    ],
    limitations: [
      'Resource limits vary by service tier',
      'Limited direct file system access in some scenarios',
      'Limited OS customization (Windows/Linux provided images)',
      'Shared infrastructure in lower tiers may impact performance',
      'Some features only available in Windows or Linux plans'
    ],
    regions: [
      'eastus', 'eastus2', 'westus', 'westus2', 'centralus', 
      'northeurope', 'westeurope', 'uksouth', 
      'southeastasia', 'eastasia', 'japaneast', 
      'australiaeast', 'southcentralus', 'brazilsouth'
    ],
    documentation: 'https://learn.microsoft.com/azure/app-service/',
    pricingModels: [
      {
        type: 'free-tier',
        unit: 'month',
        pricePerUnit: 0,
        currency: 'USD',
        conditions: ['Shared infrastructure', 'Limited compute hours', 'No SLA', 'No custom domains']
      },
      {
        type: 'on-demand',
        unit: 'hour',
        pricePerUnit: 0.10, // Basic B1 tier
        currency: 'USD',
        conditions: ['Pay-as-you-go pricing', 'Per-hour billing']
      },
      {
        type: 'on-demand',
        unit: 'hour',
        pricePerUnit: 0.20, // Standard S1 tier
        currency: 'USD',
        conditions: ['Auto-scaling', 'Daily backups', 'Traffic manager']
      },
      {
        type: 'on-demand',
        unit: 'hour',
        pricePerUnit: 0.40, // Premium P1v2 tier
        currency: 'USD',
        conditions: ['Enhanced performance', 'More instances', 'VNet integration']
      }
    ],
    providerSpecificDetails: {
      serviceTiers: [
        'Free', 'Shared', 'Basic', 'Standard', 'Premium', 'PremiumV2', 'PremiumV3', 'Isolated', 'IsolatedV2'
      ],
      runtimeStacks: [
        'ASP.NET', 'ASP.NET Core', 'Java', 'Node.js', 'PHP', 'Python', 'Ruby', 'Docker'
      ],
      deploymentOptions: [
        'FTP/FTPS', 'Git (local)', 'GitHub', 'Bitbucket', 'Azure DevOps',
        'OneDrive', 'Dropbox', 'Container Registry',
        'ZIP/WAR deployment', 'Run from Package'
      ],
      appTypes: [
        'Web App', 'Web API', 'Mobile backend', 'WebJobs',
        'Container Web App'
      ],
      advancedFeatures: [
        'Deployment slots', 'Custom domains/SSL', 'Authentication',
        'Hybrid connections', 'VNet integration', 'App Service Environment'
      ]
    },
    resourceUrl: 'https://azure.microsoft.com/services/app-service/',
    equivalentServices: [
      {
        provider: 'aws',
        serviceId: 'aws-elastic-beanstalk',
        compatibilityScore: 85
      },
      {
        provider: 'gcp',
        serviceId: 'gcp-app-engine',
        compatibilityScore: 80
      },
      {
        provider: 'firebase',
        serviceId: 'firebase-hosting',
        compatibilityScore: 65
      },
      {
        provider: 'digitalocean',
        serviceId: 'do-app-platform',
        compatibilityScore: 80
      }
    ]
  },
  
  // =========================================
  // Azure Container Instances
  // =========================================
  {
    id: 'azure-container-instances',
    name: 'Container Instances',
    providerSpecificName: 'Azure Container Instances',
    description: 'Run Docker containers on-demand in a serverless environment without managing infrastructure.',
    provider: 'azure',
    type: ComponentType.CONTAINER,
    category: 'compute',
    tier: 'standard',
    minComplexityLevel: 'simple',
    isManagedService: true,
    capabilities: [
      'Serverless containers with per-second billing',
      'Fast startup times (seconds)',
      'Custom sizing for CPU and memory',
      'Persistent storage through Azure Files',
      'Linux and Windows container support',
      'Virtual network deployment',
      'Container groups for multi-container deployment',
      'Integrated authentication with Azure Container Registry',
      'GPU-enabled containers',
      'Integrated logging and monitoring'
    ],
    limitations: [
      'Less orchestration features compared to AKS',
      'Limited load balancing capabilities',
      'Limited scaling features (primarily manual)',
      'Resource quotas per region/subscription',
      'Networking constraints in some configurations'
    ],
    regions: [
      'eastus', 'eastus2', 'westus', 'westus2', 'centralus', 
      'northeurope', 'westeurope', 'uksouth', 
      'southeastasia', 'eastasia', 'japaneast', 
      'australiaeast', 'southcentralus', 'brazilsouth'
    ],
    documentation: 'https://learn.microsoft.com/azure/container-instances/',
    pricingModels: [
      {
        type: 'on-demand',
        unit: 'hour',
        pricePerUnit: 0.0000215, // Per vCPU-second
        currency: 'USD',
        conditions: ['Per-second billing for vCPU', 'Minimum of 1 second']
      },
      {
        type: 'on-demand',
        unit: 'hour',
        pricePerUnit: 0.0000023, // Per GB-second of memory
        currency: 'USD',
        conditions: ['Per-second billing for memory', 'Minimum of 1 second']
      }
    ],
    providerSpecificDetails: {
      resourceAllocation: {
        cpu: 'Custom from 1 to 4 vCPU',
        memory: 'Custom from 1 to 16 GB',
        gpu: 'Optional NVIDIA Tesla K80, P100, or V100',
        storage: 'Optional Azure Files mount'
      },
      containerGroupFeatures: [
        'Multiple containers sharing a lifecycle',
        'Shared network address and port space',
        'Shared storage volumes',
        'Common deployment model'
      ],
      networkingOptions: [
        'Public IP with DNS label',
        'Virtual network deployment',
        'Private network with VNet integration'
      ],
      commonUseCases: [
        'Simple applications',
        'Task automation',
        'Batch jobs',
        'CI/CD workloads',
        'Event-driven processing'
      ]
    },
    resourceUrl: 'https://azure.microsoft.com/services/container-instances/',
    equivalentServices: [
      {
        provider: 'aws',
        serviceId: 'aws-fargate',
        compatibilityScore: 80
      },
      {
        provider: 'aws',
        serviceId: 'aws-app-runner',
        compatibilityScore: 70
      },
      {
        provider: 'gcp',
        serviceId: 'gcp-cloud-run',
        compatibilityScore: 75
      },
      {
        provider: 'digitalocean',
        serviceId: 'do-app-platform',
        compatibilityScore: 60
      }
    ]
  },
  
  // =========================================
  // Azure Kubernetes Service
  // =========================================
  {
    id: 'azure-kubernetes-service',
    name: 'Kubernetes Service',
    providerSpecificName: 'Azure Kubernetes Service',
    description: 'Managed Kubernetes service for deploying and managing containerized applications.',
    provider: 'azure',
    type: ComponentType.KUBERNETES,
    category: 'compute',
    tier: 'standard',
    minComplexityLevel: 'balanced',
    isManagedService: true,
    capabilities: [
      'Fully managed Kubernetes control plane',
      'Automated upgrades and patching',
      'Integration with Azure AD for authentication',
      'Azure Monitor integration for container insights',
      'Integration with Azure Networking (CNI or kubenet)',
      'Multiple node pools with different VM sizes',
      'Cluster autoscaling',
      'Pod autoscaling (horizontal and vertical)',
      'GPU-enabled nodes support',
      'Azure Policy integration for governance'
    ],
    limitations: [
      'Requires Kubernetes expertise for effective use',
      'Node pool limits per cluster',
      'Pods per node limits',
      'API request rate limits',
      'Complexity of management for some scenarios'
    ],
    regions: [
      'eastus', 'eastus2', 'westus', 'westus2', 'centralus', 
      'northeurope', 'westeurope', 'uksouth', 
      'southeastasia', 'eastasia', 'japaneast', 
      'australiaeast', 'southcentralus', 'brazilsouth'
    ],
    documentation: 'https://learn.microsoft.com/azure/aks/',
    pricingModels: [
      {
        type: 'free-tier',
        unit: 'month',
        pricePerUnit: 0,
        currency: 'USD',
        conditions: ['Managed control plane is free', 'Pay only for VM instances, storage, and networking']
      },
      {
        type: 'on-demand',
        unit: 'hour',
        pricePerUnit: 0.10, // Cost for D2s v3 nodes (example)
        currency: 'USD',
        conditions: ['Pay for underlying VMs', 'Per-second billing for worker nodes']
      },
      {
        type: 'reserved',
        unit: 'hour',
        pricePerUnit: 0.06, // With reservations (example)
        currency: 'USD',
        conditions: ['Reserved Instances for underlying VMs', '1-year or 3-year commitments']
      }
    ],
    providerSpecificDetails: {
      nodeTypes: [
        'General purpose', 'Compute optimized', 'Memory optimized',
        'GPU-enabled', 'Storage optimized'
      ],
      clusterConfigOptions: [
        'Multi-node pools', 'Availability Zones support',
        'Private clusters', 'API server IP ranges',
        'Authorized IP ranges', 'Custom VNET integration'
      ],
      securityFeatures: [
        'Azure AD integration', 'RBAC', 'Network policies',
        'Pod identity', 'Secret Store CSI driver integration',
        'Azure Policy integration'
      ],
      advancedFeatures: [
        'Virtual nodes with ACI', 'Application Gateway Ingress Controller',
        'Azure Monitor for containers', 'DevSpaces integration',
        'GitOps with Flux', 'Azure Arc for hybrid Kubernetes'
      ],
      storageOptions: [
        'Azure Disk (Premium SSD, Standard SSD, Standard HDD)',
        'Azure Files Premium', 'Azure Files Standard',
        'Azure NetApp Files', 'Azure Blob storage CSI'
      ]
    },
    resourceUrl: 'https://azure.microsoft.com/services/kubernetes-service/',
    equivalentServices: [
      {
        provider: 'aws',
        serviceId: 'aws-eks',
        compatibilityScore: 90
      },
      {
        provider: 'gcp',
        serviceId: 'gcp-gke',
        compatibilityScore: 90
      },
      {
        provider: 'digitalocean',
        serviceId: 'do-kubernetes',
        compatibilityScore: 85
      }
    ]
  }
];