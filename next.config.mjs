// // /** @type {import('next').NextConfig} */
// // const nextConfig = {};



// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   webpack: (config, { isServer }) => {
//     if (isServer) {
//       // Exclude test files and directories from server bundle
//       config.resolve.alias = {
//         ...config.resolve.alias,
//         // Ignore test directories
//         '@test': false,
//       };
      
//       // Add fallbacks for node modules that might not be available
//       config.resolve.fallback = {
//         ...config.resolve.fallback,
//         fs: false,
//         path: false,
//       };
//     }
    
//     return config;
//   },
  
//   // Exclude test directories from build
//   experimental: {
//     outputFileTracingExcludes: {
//       '*': [
//         'test/**/*',
//         '**/*.test.*',
//         '**/*.spec.*',
//         '**/test/**',
//         'node_modules/**/test/**',
//       ],
//     },
//   },
// };

// export default nextConfig;
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable Turbopack for faster builds (optional)
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
  
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Exclude test files and directories from server bundle
      config.resolve.alias = {
        ...config.resolve.alias,
        // Ignore test directories
        '@test': false,
      };
      
      // Add fallbacks for node modules that might not be available
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
      };
    }
    
    return config;
  },
  
  // Exclude test directories from build
  outputFileTracingExcludes: {
    '*': [
      'test/**/*',
      '**/*.test.*',
      '**/*.spec.*',
      '**/test/**',
      'node_modules/**/test/**',
    ],
  },
};

export default nextConfig;