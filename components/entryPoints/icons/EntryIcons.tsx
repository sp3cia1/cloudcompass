import React from 'react';

export const QuestionnaireIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    {...props}
  >
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <line x1="9" y1="8" x2="15" y2="8" />
    <line x1="9" y1="12" x2="15" y2="12" />
    <line x1="9" y1="16" x2="13" y2="16" />
    <path d="M4 3h16a2 2 0 0 1 2 2v4a0 0 0 0 1 0 0H2a0 0 0 0 1 0 0V5a2 2 0 0 1 2-2z" />
  </svg>
);

export const RepositoryIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    {...props}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

export const IdeaIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    {...props}
  >
    <path d="M9.663 17h4.673M12 3v1M5.5 5.5l.5.5M3 12h1M5.5 18.5l.5-.5M12 19v2M18.5 18.5l-.5-.5M19 12h2M18.5 5.5l-.5.5" />
    <path d="M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0z" />
    <path d="M10 16.5V17a2 2 0 0 0 4 0v-.5" />
  </svg>
);

export const CirclePattern: React.FC<{ className?: string }> = ({ className }) => (
  <div className={className} aria-hidden="true">
    <svg 
      width="100" 
      height="100" 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <g opacity="0.2">
        <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />
        <circle cx="50" cy="50" r="30" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />
        <circle cx="50" cy="50" r="15" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />
      </g>
    </svg>
  </div>
);

export const GridPattern: React.FC<{ className?: string }> = ({ className }) => (
  <div className={className} aria-hidden="true">
    <svg 
      width="100%" 
      height="100%" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern 
          id="grid-pattern" 
          width="20" 
          height="20" 
          patternUnits="userSpaceOnUse"
        >
          <path 
            d="M 20 0 L 0 0 0 20" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="0.5" 
            opacity="0.15" 
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid-pattern)" />
    </svg>
  </div>
);

// Additional decorative elements for enhanced visual appeal
export const WavePattern: React.FC<{ className?: string }> = ({ className }) => (
  <div className={className} aria-hidden="true">
    <svg 
      width="100%" 
      height="40" 
      viewBox="0 0 1440 40" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <path 
        d="M0 20C48 8.86658 96 2.26651 144 0.333217C192 -1.60007 240 1.13321 288 5.99988C336 10.8666 384 17.8665 432 25.9999C480 34.1332 528 43.3332 576 39.9999C624 36.6665 672 20.7999 720 14.6665C768 8.53324 816 12.1332 864 13.9999C912 15.8665 960 15.9999 1008 15.9999C1056 15.9999 1104 15.9999 1152 15.9999C1200 15.9999 1248 15.9999 1296 13.3332C1344 10.6666 1392 5.33325 1416 2.66659L1440 0V40H0V20Z" 
        fill="currentColor" 
        fillOpacity="0.1"
      />
    </svg>
  </div>
);

export const DotsPattern: React.FC<{ className?: string }> = ({ className }) => (
  <div className={className} aria-hidden="true">
    <svg 
      width="100%" 
      height="100%" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern 
          id="dots-pattern" 
          width="20" 
          height="20" 
          patternUnits="userSpaceOnUse"
        >
          <circle 
            cx="2" 
            cy="2" 
            r="1" 
            fill="currentColor" 
            opacity="0.3" 
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#dots-pattern)" />
    </svg>
  </div>
);

// Cloud provider icons for the footer section
export const AWSIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    viewBox="0 0 24 24" // Standard 24x24 viewbox
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    {...props}
  >
    {/* Existing AWS Path - Generally looks like the AWS wordmark shape */}
    <path d="M6.763 10.036c0 .296.032.535.088.71.064.176.144.368.256.576.04.063.056.127.056.183 0 .08-.048.16-.152.24l-.503.335a.383.383 0 0 1-.208.072c-.08 0-.16-.04-.239-.112a2.47 2.47 0 0 1-.287-.375 6.18 6.18 0 0 1-.248-.471c-.622.734-1.405 1.101-2.347 1.101-.67 0-1.205-.191-1.596-.574-.391-.384-.59-.894-.59-1.533 0-.678.239-1.23.726-1.644.487-.415 1.133-.623 1.955-.623.272 0 .551.024.846.064.296.04.6.104.918.176v-.583c0-.607-.127-1.03-.375-1.277-.255-.248-.686-.367-1.3-.367-.28 0-.568.031-.863.103-.295.072-.59.158-.885.256-.16.056-.279.08-.351.08-.13 0-.19-.096-.19-.288v-.455c0-.096.016-.176.056-.24.04-.064.111-.127.231-.176.3-.16.654-.296 1.069-.415.415-.127.854-.19 1.317-.19.998 0 1.72.223 2.172.67.444.447.673 1.13.673 2.05v2.7zm-3.24 1.214c.263 0 .534-.048.822-.144.287-.096.542-.271.758-.51.128-.152.223-.32.27-.512.048-.191.08-.423.08-.694v-.335a6.66 6.66 0 0 0-.735-.136 6.02 6.02 0 0 0-.75-.048c-.535 0-.926.104-1.19.32-.263.215-.39.518-.39.917 0 .375.095.655.295.846.191.2.47.296.838.296zm6.41.862c-.144 0-.24-.024-.304-.08-.064-.048-.12-.16-.168-.311L7.586 5.55a1.398 1.398 0 0 1-.072-.32c0-.128.064-.2.191-.2h.783c.151 0 .255.025.31.08.065.048.113.16.16.312l1.342 5.284 1.245-5.284c.04-.16.088-.264.151-.312a.549.549 0 0 1 .32-.08h.638c.152 0 .256.025.32.08.063.048.12.16.151.312l1.261 5.348 1.381-5.348c.048-.16.104-.264.16-.312a.52.52 0 0 1 .311-.08h.743c.127 0 .2.065.2.2 0 .04-.009.08-.017.128a1.137 1.137 0 0 1-.056.2l-1.923 6.17c-.048.16-.104.263-.168.311a.51.51 0 0 1-.303.08h-.687c-.151 0-.255-.024-.32-.08-.063-.056-.119-.16-.15-.32l-1.238-5.148-1.23 5.14c-.04.16-.087.264-.15.32-.065.056-.177.08-.32.08zm10.256.215c-.415 0-.83-.048-1.229-.143-.399-.096-.71-.2-.918-.32-.128-.071-.215-.151-.247-.223a.563.563 0 0 1-.048-.224v-.479c0-.196.063-.288.183-.288.048 0 .096.008.144.024.048.016.12.048.2.08.271.12.566.215.878.279.319.064.63.096.95.096.502 0 .894-.088 1.165-.264a.86.86 0 0 0 .415-.758.777.777 0 0 0-.215-.559c-.144-.151-.415-.287-.806-.415l-1.157-.36c-.583-.183-1.014-.454-1.277-.813a1.902 1.902 0 0 1-.4-1.158c0-.335.073-.63.216-.886.144-.255.335-.479.575-.654.24-.184.51-.32.83-.415.32-.096.655-.136 1.006-.136.175 0 .359.008.535.032.183.024.35.056.518.088.16.04.32.08.455.127.144.048.256.096.336.144a.69.69 0 0 1 .24.2.43.43 0 0 1 .071.263v.439c0 .192-.63.288-.19.288-.063 0-.16-.032-.288-.08-.336-.136-.743-.2-1.229-.2-.455 0-.807.072-1.055.215-.248.144-.367.366-.367.662 0 .198.058.367.168.51.112.144.36.279.75.4l1.134.358c.574.184.99.44 1.237.767.247.327.367.702.367 1.117 0 .343-.072.655-.216.926-.144.272-.336.511-.583.703-.248.2-.543.343-.886.447-.36.111-.742.167-1.15.167zM21.698 16.207c-2.626 1.94-6.442 2.969-9.722 2.969-4.598 0-8.74-1.7-11.87-4.526-.247-.223-.024-.527.27-.351 3.384 1.963 7.559 3.153 11.877 3.153 2.914 0 6.114-.607 9.06-1.852.439-.2.814.287.385.607zM22.792 14.961c-.334-.43-2.215-.207-3.057-.103-.255.032-.295-.192-.063-.36 1.5-1.053 3.967-.75 4.254-.39.287.357-.08 2.824-1.485 4.007-.215.184-.423.088-.327-.151.32-.799 1.038-2.593.678-3.003z" />
  </svg>
);

// Azure Icon (Updated with cleaner path)
export const AzureIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    viewBox="0 0 24 24" // Standard 24x24 viewbox
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    {...props}
  >
    <g transform="scale(1.4) translate(-2, -1)">
      <path d="M3.65 14.2H16L9.35 2.68 7.33 8.24l3.88 4.63-7.56 1.33zM8.82 1.8L4.07 5.79 0 12.84h3.67v.01L8.82 1.8z"/>
    </g>
  </svg>
);

// GCP Icon (Updated with cleaner hexagonal logo path)
export const GCPIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    viewBox="0 0 24 24" // Standard 24x24 viewbox
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    {...props}
  >
    <path d="M12.19 2.38a9.344 9.344 0 0 0-9.234 6.893c.053-.02-.055.013 0 0-3.875 2.551-3.922 8.11-.247 10.941l.006-.007-.007.03a6.717 6.717 0 0 0 4.077 1.356h5.173l.03.03h5.192c6.687.053 9.376-8.605 3.835-12.35a9.365 9.365 0 0 0-2.821-4.552l-.043.043.006-.05A9.344 9.344 0 0 0 12.19 2.38zm-.358 4.146c1.244-.04 2.518.368 3.486 1.15a5.186 5.186 0 0 1 1.862 4.078v.518c3.53-.07 3.53 5.262 0 5.193h-5.193l-.008.009v-.04H6.785a2.59 2.59 0 0 1-1.067-.23h.001a2.597 2.597 0 1 1 3.437-3.437l3.013-3.012A6.747 6.747 0 0 0 8.11 8.24c.018-.01.04-.026.054-.023a5.186 5.186 0 0 1 3.67-1.69z"/>
  </svg>
);

// Firebase Icon (Looks standard - keeping as is)
export const FirebaseIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    viewBox="0 0 24 24" // Standard 24x24 viewbox
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    {...props}
  >
    {/* Existing Firebase Path - Standard logo shape */}
    <path d="M3.89 15.673L6.255.461A.542.542 0 0 1 7.27.289L9.813 5.06 3.89 15.673zm16.795 3.691L18.433 5.365a.543.543 0 0 0-.918-.295l-14.2 14.294 7.857 4.428a1.62 1.62 0 0 0 1.587 0l7.926-4.428zM14.3 7.148l-1.82-3.482a.542.542 0 0 0-.96 0L3.53 17.984 14.3 7.148z" />
  </svg>
);

// DigitalOcean Icon (Updated with cleaner path)
export const DigitalOceanIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    viewBox="0 0 24 24" // Standard 24x24 viewbox
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    {...props}
  >
    <path d="M12.04 0C5.408-.02.005 5.37.005 11.992h4.638c0-4.923 4.882-8.731 10.064-6.855a6.95 6.95 0 014.147 4.148c1.889 5.177-1.924 10.055-6.84 10.064v-4.61H7.391v4.623h4.61V24c7.86 0 13.967-7.588 11.397-15.83-1.115-3.59-3.985-6.446-7.575-7.575A12.8 12.8 0 0012.039 0zM7.39 19.362H3.828v3.564H7.39zm-3.563 0v-2.978H.85v2.978z"/>
  </svg>
);
