// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import netlify from '@astrojs/netlify';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://soosanmotor.com',
  
  integrations: [
    react(),
    sitemap({
      filter: (page) => !page.includes('/api/') && !page.includes('/loivao/'),
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
      i18n: {
        defaultLocale: 'vi',
        locales: {
          vi: 'vi-VN'
        }
      }
    }),
  ],
  
  output: 'static',
  adapter: netlify(),
  
  // Image optimization for Cloudflare CDN
  image: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.soosanmotor.com',
      },
      {
        protocol: 'https',
        hostname: '**.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      }
    ],
    domains: ['cdn.soosanmotor.com', 'images.unsplash.com'],
  },
  
  // Build optimization
  build: {
    inlineStylesheets: 'auto',
    assets: 'assets'
  },
  
  // Prefetch for faster navigation
  prefetch: {
    prefetchAll: false,
    defaultStrategy: 'hover'
  },
  
  // Vite optimization
  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom'],
          }
        }
      }
    },
  }
});
