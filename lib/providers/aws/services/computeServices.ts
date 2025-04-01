import { ComponentType } from '@/types/architecture';
import { ProviderServiceDescriptor, ServiceCategory } from '@/lib/providers/providerAdapter';

/**
 * AWS Compute Services
 * 
 * This module provides accurate service descriptors for AWS compute services:
 * - EC2 (Elastic Compute Cloud) - Virtual servers
 * - Lambda - Serverless functions
 * - ECS (Elastic Container Service) - Container orchestration
 * - Elastic Beanstalk - PaaS for web applications
 * - Batch - Batch processing workloads
 * - App Runner - Simplified container deployment
 * - Lightsail - Simplified cloud platform
 */
export const computeServices: ProviderServiceDescriptor[] = [
  // =========================================
  // EC2 (Elastic Compute Cloud)
  // =========================================
  {
    id: 'aws-ec2',
    name: 'Elastic Compute Cloud',
    providerSpecificName: 'Amazon EC2',
    description: 'Virtual servers with resizable compute capacity in the cloud.',
    provider: 'aws',
    type: ComponentType.VM,
    category: 'compute',
    tier: 'standard',
    minComplexityLevel: 'simple',
    isManagedService: false,
    capabilities: [
      'Multiple instance types optimized for different workloads',
      'Support for various operating systems',
      'Auto Scaling capabilities for dynamic workloads',
      'Spot instances for cost optimization (up to 90% savings)',
      'GPU and specialized hardware instances',
      'Placement groups for performance optimization',
      'Instance storage and EBS volume options',
      'Enhanced networking capabilities',
      'Custom AMIs (Amazon Machine Images)'
    ],
    limitations: [
      'Instance quotas apply per region (default limits can be increased)',
      'Some instance types not available in all regions',
      'Requires capacity planning and ongoing monitoring',
      'Auto Scaling requires separate configuration',
      'No built-in high-availability without manual configuration',
      'Instance maintenance requires proper handling of instance state'
    ],
    regions: [
      'us-east-1', 'us-east-2', 'us-west-1', 'us-west-2', 
      'eu-west-1', 'eu-west-2', 'eu-west-3', 'eu-central-1', 
      'ap-southeast-1', 'ap-southeast-2', 'ap-northeast-1', 'ap-northeast-2', 
      'sa-east-1', 'ca-central-1', 'ap-south-1'
    ],
    documentation: 'https://docs.aws.amazon.com/ec2/',
    pricingModels: [
      {
        type: 'on-demand',
        unit: 'hour',
        pricePerUnit: 0.0116, // t3.micro example - varies by instance type
        currency: 'USD',
        conditions: ['Price varies by instance type and region']
      },
      {
        type: 'reserved',
        unit: 'hour',
        pricePerUnit: 0.0066, // t3.micro 1-year commitment
        currency: 'USD',
        conditions: ['1 or 3-year commitment required', 'Upfront payment options available', 'Up to 72% savings over on-demand']
      },
      {
        type: 'spot',
        unit: 'hour',
        pricePerUnit: 0.0035, // Example spot price
        currency: 'USD',
        conditions: ['Dynamic pricing based on demand', 'Can be interrupted with 2-min notification', 'Up to 90% savings over on-demand']
      }
    ],
    providerSpecificDetails: {
      instanceFamilies: [
        'General Purpose (t3, m5, m6i)',
        'Compute Optimized (c5, c6i)',
        'Memory Optimized (r5, r6i, x1, x2)',
        'Storage Optimized (d2, i3, i4i)',
        'Accelerated Computing (p3, p4, g4, g5)'
      ],
      storageOptions: ['EBS volumes', 'Instance Store'],
      networkingFeatures: ['Enhanced Networking', 'Elastic Network Adapter (ENA)', 'Placement Groups'],
      securityFeatures: ['Security Groups', 'IAM Roles', 'Key Pairs'],
      deploymentOptions: ['Auto Scaling Groups', 'Launch Templates', 'EC2 Image Builder'],
      operatingSystems: ['Amazon Linux', 'Windows Server', 'Ubuntu', 'Red Hat', 'SUSE', 'Debian', 'Custom AMIs']
    },
    resourceUrl: 'https://aws.amazon.com/ec2/',
    equivalentServices: [
      {
        provider: 'azure',
        serviceId: 'azure-virtual-machines',
        compatibilityScore: 90
      },
      {
        provider: 'gcp',
        serviceId: 'gcp-compute-engine',
        compatibilityScore: 85
      },
      {
        provider: 'digitalocean',
        serviceId: 'do-droplets',
        compatibilityScore: 70
      }
    ]
  },
  
  // =========================================
  // Lambda
  // =========================================
  {
    id: 'aws-lambda',
    name: 'Lambda',
    providerSpecificName: 'AWS Lambda',
    description: 'Serverless compute service to run code without provisioning or managing servers.',
    provider: 'aws',
    type: ComponentType.FUNCTION,
    category: 'serverless',
    tier: 'standard',
    minComplexityLevel: 'simple',
    isManagedService: true,
    capabilities: [
      'Automatic scaling based on workload',
      'Multiple runtime options (Node.js, Python, Java, Go, etc.)',
      'Event-driven execution via integrations with AWS services',
      'Direct HTTP invocation via API Gateway',
      'Custom runtime support',
      'Container image support (up to 10GB)',
      'Function URLs for HTTP endpoints',
      'Provisioned concurrency for consistent performance',
      'Lambda@Edge for CDN customization'
    ],
    limitations: [
      'Execution time limited to 15 minutes',
      'Memory limited to 10,240 MB (affects CPU allocation)',
      'Deployment package size limited to 50 MB (zipped)',
      'Temporary disk capacity (/tmp) limited to 512 MB (10 GB with ephemeral storage option)',
      'Concurrent executions quota (1000 default, increasable)',
      'Cold start latency for infrequently used functions',
      'Limited local state persistence between invocations'
    ],
    regions: [
      'us-east-1', 'us-east-2', 'us-west-1', 'us-west-2', 
      'eu-west-1', 'eu-west-2', 'eu-west-3', 'eu-central-1', 
      'ap-southeast-1', 'ap-southeast-2', 'ap-northeast-1', 'ap-northeast-2', 
      'sa-east-1', 'ca-central-1', 'ap-south-1'
    ],
    documentation: 'https://docs.aws.amazon.com/lambda/',
    pricingModels: [
      {
        type: 'on-demand',
        unit: 'request',
        pricePerUnit: 0.0000002, // $0.20 per 1M requests
        currency: 'USD',
        conditions: ['Additional cost for compute duration']
      },
      {
        type: 'on-demand',
        unit: 'gb',
        pricePerUnit: 0.0000166667, // $0.0000166667 per GB-second
        currency: 'USD',
        conditions: ['GB-second pricing for memory and execution time']
      },
      {
        type: 'free-tier',
        unit: 'request',
        pricePerUnit: 0,
        currency: 'USD',
        freeUnits: 1000000, // 1M requests
        conditions: ['1M free requests per month', '400,000 GB-seconds of compute time per month']
      }
    ],
    providerSpecificDetails: {
      runtimes: [
        'Node.js 16.x, 18.x, 20.x',
        'Python 3.8, 3.9, 3.10, 3.11',
        'Java 8, 11, 17',
        'Ruby 2.7, 3.2',
        '.NET 6.0',
        'Go 1.x',
        'Custom Runtime'
      ],
      eventSources: [
        'Amazon S3', 'DynamoDB', 'SQS', 'SNS', 'EventBridge',
        'API Gateway', 'CloudFront', 'Kinesis', 'CloudWatch Events'
      ],
      deploymentOptions: ['ZIP upload', 'Container images'],
      integrations: [
        'AWS SDK for calling other AWS services',
        'Lambda Layers for code sharing',
        'Lambda Extensions for monitoring/security tools',
        'AWS X-Ray for tracing',
        'AWS Step Functions for orchestration'
      ],
      scalingBehavior: 'Scales automatically to handle concurrent requests, up to account limit'
    },
    resourceUrl: 'https://aws.amazon.com/lambda/',
    equivalentServices: [
      {
        provider: 'azure',
        serviceId: 'azure-functions',
        compatibilityScore: 85
      },
      {
        provider: 'gcp',
        serviceId: 'gcp-cloud-functions',
        compatibilityScore: 80
      },
      {
        provider: 'firebase',
        serviceId: 'firebase-functions',
        compatibilityScore: 75
      }
    ]
  },
  
  // =========================================
  // Amazon ECS (Elastic Container Service)
  // =========================================
  {
    id: 'aws-ecs',
    name: 'Elastic Container Service',
    providerSpecificName: 'Amazon ECS',
    description: 'Fully managed container orchestration service for Docker containers.',
    provider: 'aws',
    type: ComponentType.CONTAINER,
    category: 'compute',
    tier: 'standard',
    minComplexityLevel: 'balanced',
    isManagedService: true,
    capabilities: [
      'Multiple launch types (EC2, Fargate, External)',
      'Integration with AWS services (ALB, CloudWatch, IAM, etc.)',
      'Service auto-scaling',
      'Task definitions for multi-container applications',
      'Service discovery integration',
      'Spot instance support (EC2 launch type)',
      'Load balancer integration',
      'ECS Anywhere for hybrid deployments',
      'Blue/green deployments via CodeDeploy'
    ],
    limitations: [
      'Service quotas apply per region (increasable)',
      'EC2 launch type requires capacity planning',
      'Fargate has CPU and memory constraints',
      'Limited support for advanced scheduling features compared to EKS',
      'Task definition revisions cannot be deleted (only deregistered)',
      'Container images must be in ECR or accessible registry'
    ],
    regions: [
      'us-east-1', 'us-east-2', 'us-west-1', 'us-west-2', 
      'eu-west-1', 'eu-west-2', 'eu-west-3', 'eu-central-1', 
      'ap-southeast-1', 'ap-southeast-2', 'ap-northeast-1', 'ap-northeast-2', 
      'sa-east-1', 'ca-central-1', 'ap-south-1'
    ],
    documentation: 'https://docs.aws.amazon.com/ecs/',
    pricingModels: [
      {
        type: 'on-demand',
        unit: 'hour',
        pricePerUnit: 0, // ECS service itself is free
        currency: 'USD',
        conditions: ['EC2 launch type: Pay for EC2 instances', 'Fargate launch type: Pay per vCPU and memory']
      },
      {
        type: 'on-demand',
        unit: 'hour',
        pricePerUnit: 0.04446, // Fargate pricing (1 vCPU, 2GB)
        currency: 'USD',
        conditions: ['Fargate per-vCPU and per-GB memory pricing']
      }
    ],
    providerSpecificDetails: {
      launchTypes: ['EC2', 'Fargate', 'External (ECS Anywhere)'],
      deploymentTypes: [
        'Rolling update (default)', 
        'Blue/Green (with CodeDeploy)', 
        'External (custom deployment controller)'
      ],
      schedulingOptions: ['REPLICA', 'DAEMON'],
      integrations: [
        'Amazon ECR',
        'Elastic Load Balancing',
        'CloudWatch',
        'AWS IAM',
        'VPC',
        'Auto Scaling',
        'CloudFormation',
        'AWS X-Ray',
        'Service Discovery'
      ],
      managementTools: ['AWS Management Console', 'AWS CLI', 'AWS SDK', 'AWS Copilot', 'AWS CDK']
    },
    resourceUrl: 'https://aws.amazon.com/ecs/',
    equivalentServices: [
      {
        provider: 'azure',
        serviceId: 'azure-container-instances',
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
  // AWS Elastic Beanstalk
  // =========================================
  {
    id: 'aws-elastic-beanstalk',
    name: 'Elastic Beanstalk',
    providerSpecificName: 'AWS Elastic Beanstalk',
    description: 'Platform as a Service (PaaS) for deploying and managing web applications without managing infrastructure.',
    provider: 'aws',
    type: ComponentType.CONTAINER,
    category: 'compute',
    tier: 'standard',
    minComplexityLevel: 'simple',
    isManagedService: true,
    capabilities: [
      'Support for multiple programming languages and platforms',
      'Automatic capacity provisioning',
      'Load balancing and auto-scaling',
      'Application health monitoring',
      'Automated platform updates',
      'Custom environment configuration',
      'Integration with AWS services',
      'Rolling deployments'
    ],
    limitations: [
      'Limited infrastructure customization compared to direct service use',
      'Depends on underlying AWS resource limits (EC2, RDS, etc.)',
      'Less control than using raw EC2/ECS/other services directly',
      'Only suitable for web applications and services',
      'Limited debugging capabilities compared to direct EC2/container management'
    ],
    regions: [
      'us-east-1', 'us-east-2', 'us-west-1', 'us-west-2', 
      'eu-west-1', 'eu-west-2', 'eu-central-1', 
      'ap-southeast-1', 'ap-southeast-2', 'ap-northeast-1', 
      'sa-east-1', 'ca-central-1', 'ap-south-1'
    ],
    documentation: 'https://docs.aws.amazon.com/elasticbeanstalk/',
    pricingModels: [
      {
        type: 'on-demand',
        unit: 'hour',
        pricePerUnit: 0, // Elastic Beanstalk itself is free
        currency: 'USD',
        conditions: ['Pay only for underlying AWS resources (EC2, ELB, S3, etc.)']
      }
    ],
    providerSpecificDetails: {
      platforms: [
        'Node.js',
        'Python',
        'Ruby',
        'PHP',
        'Java SE',
        'Java with Tomcat',
        '.NET on Windows Server',
        '.NET Core on Linux',
        'Go',
        'Docker'
      ],
      environments: ['Web Server Environment', 'Worker Environment'],
      deploymentOptions: [
        'All at once',
        'Rolling',
        'Rolling with additional batch',
        'Immutable',
        'Traffic splitting'
      ],
      customizationOptions: [
        'Configuration files (.ebextensions)',
        'Environment variables',
        'Platform hooks',
        'Saved configurations',
        'Custom platforms'
      ]
    },
    resourceUrl: 'https://aws.amazon.com/elasticbeanstalk/',
    equivalentServices: [
      {
        provider: 'azure',
        serviceId: 'azure-app-service',
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
        compatibilityScore: 60
      },
      {
        provider: 'digitalocean',
        serviceId: 'do-app-platform',
        compatibilityScore: 75
      }
    ]
  },
  
  // =========================================
  // AWS Batch
  // =========================================
  {
    id: 'aws-batch',
    name: 'Batch',
    providerSpecificName: 'AWS Batch',
    description: 'Fully managed batch processing service for running large-scale batch computing jobs.',
    provider: 'aws',
    type: ComponentType.CONTAINER,
    category: 'compute',
    tier: 'standard',
    minComplexityLevel: 'balanced',
    isManagedService: true,
    capabilities: [
      'Dynamic provisioning based on job requirements',
      'EC2 and Fargate compute environments',
      'Spot instance support for cost optimization',
      'Job queues with priorities',
      'Job dependencies for workflow creation',
      'Array jobs for parallel execution',
      'Automated job retries',
      'Integration with AWS Step Functions for complex workflows',
      'GPU support for compute-intensive workloads'
    ],
    limitations: [
      'Dependent on underlying EC2 or Fargate service limits',
      'Job timeout limited to 14 days',
      'Limited to batch job workloads (not suitable for interactive or real-time applications)',
      'EC2 launch type requires proper IAM setup for instance management',
      'Fargate launch type has memory and CPU constraints'
    ],
    regions: [
      'us-east-1', 'us-east-2', 'us-west-1', 'us-west-2', 
      'eu-west-1', 'eu-central-1', 'ap-southeast-1', 'ap-northeast-1',
      'ca-central-1', 'ap-south-1'
    ],
    documentation: 'https://docs.aws.amazon.com/batch/',
    pricingModels: [
      {
        type: 'on-demand',
        unit: 'hour',
        pricePerUnit: 0, // AWS Batch service itself is free
        currency: 'USD',
        conditions: ['Pay only for the underlying AWS resources (EC2, Fargate, EBS)']
      }
    ],
    providerSpecificDetails: {
      computeEnvironments: ['EC2', 'Fargate', 'Spot Fleet'],
      jobDefinitionFormats: ['Docker container images'],
      integrations: [
        'Amazon ECR',
        'AWS Lambda',
        'Amazon S3',
        'AWS Step Functions',
        'Amazon EventBridge',
        'AWS CloudFormation'
      ],
      useCases: [
        'Scientific simulations',
        'Genomic analysis',
        'Financial risk modeling',
        'Machine learning model training',
        'Image and video processing',
        'Large-scale data transformation'
      ]
    },
    resourceUrl: 'https://aws.amazon.com/batch/',
    equivalentServices: [
      {
        provider: 'azure',
        serviceId: 'azure-batch',
        compatibilityScore: 85
      },
      {
        provider: 'gcp',
        serviceId: 'gcp-cloud-batch',
        compatibilityScore: 80
      }
    ]
  },
  
  // =========================================
  // AWS App Runner
  // =========================================
  {
    id: 'aws-app-runner',
    name: 'App Runner',
    providerSpecificName: 'AWS App Runner',
    description: 'Fully managed service to quickly deploy containerized web applications and APIs at scale.',
    provider: 'aws',
    type: ComponentType.CONTAINER,
    category: 'compute',
    tier: 'standard',
    minComplexityLevel: 'simple',
    isManagedService: true,
    capabilities: [
      'Automatic deployments from source code or container images',
      'Automatic scaling based on traffic',
      'Built-in load balancing',
      'HTTPS by default',
      'Private connectivity with VPC',
      'Continuous deployment from ECR and code repositories',
      'Health checks and error monitoring',
      'Traffic management during deployments'
    ],
    limitations: [
      'Optimized for web applications and APIs (HTTP/HTTPS)',
      'Less customizable than ECS/EKS',
      'Limited to 10 services per region by default',
      'Memory limited to 12GB',
      'vCPU limited to 4 vCPUs',
      'Limited to specific runtime environments for source code deployments'
    ],
    regions: [
      'us-east-1', 'us-east-2', 'us-west-1', 'us-west-2', 
      'eu-west-1', 'eu-central-1', 'ap-northeast-1'
    ],
    documentation: 'https://docs.aws.amazon.com/apprunner/',
    pricingModels: [
      {
        type: 'on-demand',
        unit: 'hour',
        pricePerUnit: 0.064, // Per vCPU per hour
        currency: 'USD',
        conditions: ['Compute pricing based on vCPU and memory usage']
      },
      {
        type: 'on-demand',
        unit: 'gb',
        pricePerUnit: 0.007, // Per GB per hour
        currency: 'USD',
        conditions: ['Memory pricing per GB-hour']
      }
    ],
    providerSpecificDetails: {
      deploymentSources: [
        'Container registry (ECR, Docker Hub)',
        'Source code repository (GitHub, Bitbucket)',
        'AWS CodeCommit'
      ],
      runtimes: [
        'Node.js',
        'Python',
        'Java',
        'Custom container images'
      ],
      autoScalingConfig: {
        minSize: '1 instance',
        maxSize: '25 instances',
        metrics: 'CPU utilization, HTTP request count'
      },
      networkOptions: [
        'Public endpoint',
        'Private VPC connectivity'
      ]
    },
    resourceUrl: 'https://aws.amazon.com/apprunner/',
    equivalentServices: [
      {
        provider: 'azure',
        serviceId: 'azure-container-apps',
        compatibilityScore: 85
      },
      {
        provider: 'gcp',
        serviceId: 'gcp-cloud-run',
        compatibilityScore: 90
      },
      {
        provider: 'digitalocean',
        serviceId: 'do-app-platform',
        compatibilityScore: 80
      }
    ]
  },
  
  // =========================================
  // Amazon Lightsail
  // =========================================
  {
    id: 'aws-lightsail',
    name: 'Lightsail',
    providerSpecificName: 'Amazon Lightsail',
    description: 'Easy-to-use cloud platform offering VMs, storage, databases, and networking in simple bundles.',
    provider: 'aws',
    type: ComponentType.VM,
    category: 'compute',
    tier: 'basic',
    minComplexityLevel: 'simple',
    isManagedService: true,
    capabilities: [
      'Simplified, bundled pricing model',
      'Pre-configured applications (WordPress, LAMP, Node.js, etc.)',
      'Virtual private servers (instances)',
      'Object storage (S3-compatible)',
      'Managed databases (MySQL, PostgreSQL)',
      'Load balancers',
      'Block storage volumes',
      'Content delivery network',
      'Automatic snapshots'
    ],
    limitations: [
      'Limited instance types compared to EC2',
      'Fewer scaling and customization options',
      'Not integrated directly with most advanced AWS services',
      'Fixed bundle sizes',
      'Fewer regions available than core AWS services',
      'Limited database engine options'
    ],
    regions: [
      'us-east-1', 'us-east-2', 'us-west-2', 
      'eu-west-1', 'eu-west-2', 'eu-central-1', 
      'ap-southeast-1', 'ap-southeast-2', 'ap-northeast-1', 
      'ca-central-1'
    ],
    documentation: 'https://docs.aws.amazon.com/lightsail/',
    pricingModels: [
      {
        type: 'on-demand',
        unit: 'month',
        pricePerUnit: 3.50, // $3.50/month for the most basic instance
        currency: 'USD',
        conditions: ['Fixed monthly price per bundle', 'No hidden charges', 'Data transfer included in bundle']
      }
    ],
    providerSpecificDetails: {
      instanceBundles: [
        '$3.50/mo (512MB RAM, 1 vCPU, 20GB SSD)',
        '$5/mo (1GB RAM, 1 vCPU, 40GB SSD)',
        '$10/mo (2GB RAM, 1 vCPU, 60GB SSD)',
        '$20/mo (4GB RAM, 2 vCPU, 80GB SSD)',
        '$40/mo (8GB RAM, 2 vCPU, 160GB SSD)',
        '$80/mo (16GB RAM, 4 vCPU, 320GB SSD)',
        '$160/mo (32GB RAM, 8 vCPU, 640GB SSD)'
      ],
      blueprints: [
        'WordPress',
        'LAMP stack',
        'Node.js',
        'Magento',
        'Drupal',
        'Joomla',
        'Ghost',
        'Redmine',
        'GitLab',
        'Plesk',
        'cPanel & WHM',
        'Windows Server'
      ],
      operatingSystems: [
        'Amazon Linux 2',
        'Ubuntu',
        'Debian',
        'FreeBSD',
        'OpenSUSE',
        'Windows Server'
      ],
      additionalFeatures: [
        'IPv6 support',
        'DNS management',
        'Firewall',
        'Static IP addresses',
        'Snapshots and backups'
      ]
    },
    resourceUrl: 'https://aws.amazon.com/lightsail/',
    equivalentServices: [
      {
        provider: 'digitalocean',
        serviceId: 'do-droplets',
        compatibilityScore: 90
      },
      {
        provider: 'azure',
        serviceId: 'azure-virtual-machines-basic',
        compatibilityScore: 70
      },
      {
        provider: 'gcp',
        serviceId: 'gcp-compute-engine-standard',
        compatibilityScore: 65
      }
    ]
  }
];