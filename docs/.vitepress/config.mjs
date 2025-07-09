import { defineConfig } from 'vitepress'

// Read version from package.json
const version = process.env.DOCS_VERSION || 'latest'

export default defineConfig({
  title: 'E2E Wrapper',
  description: 'A generic abstraction layer for end-to-end testing frameworks with builder pattern support',
  
  // GitHub Pages configuration
  base: '/e2e-wrapper/',
  
  head: [
    ['link', { rel: 'icon', href: '/e2e-wrapper/favicon.ico' }],
    ['meta', { name: 'theme-color', content: '#3eaf7c' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }]
  ],

  themeConfig: {
    nav: [
      { text: 'Guide', link: '/guide/getting-started' },
      { text: 'API Reference', link: '/api/e2e-wrapper' },
      { text: 'Examples', link: '/examples/detox' },
      {
        text: `v${version}`,
        items: [
          { text: 'v1.0.0 (latest)', link: '/versions/v1.0.0' },
          { text: 'All Versions', link: '/versions/' }
        ]
      },
      { text: 'GitHub', link: 'https://github.com/christopherferreira9/e2e-wrapper' }
    ],

    sidebar: {
      '/guide/': [
        {
          text: 'Getting Started',
          items: [
            { text: 'Introduction', link: '/guide/introduction' },
            { text: 'Installation', link: '/guide/installation' },
            { text: 'Quick Start', link: '/guide/getting-started' },
            { text: 'Core Concepts', link: '/guide/core-concepts' }
          ]
        },
        {
          text: 'Framework Integration',
          items: [
            { text: 'Detox Integration', link: '/guide/detox' },
            { text: 'Appium Integration', link: '/guide/appium' },
            { text: 'Custom Drivers', link: '/guide/custom-drivers' }
          ]
        },
        {
          text: 'Advanced Usage',
          items: [
            { text: 'Builder Pattern', link: '/guide/builder-pattern' },
            { text: 'Wait Conditions', link: '/guide/wait-conditions' },
            { text: 'Page Object Model', link: '/guide/page-object-model' },
            { text: 'Error Handling', link: '/guide/error-handling' },
            { text: 'Best Practices', link: '/guide/best-practices' }
          ]
        }
      ],
      '/api/': [
        {
          text: 'API Reference',
          items: [
            { text: 'E2EWrapper', link: '/api/e2e-wrapper' },
            { text: 'WaitBuilder', link: '/api/wait-builder' },
            { text: 'ElementSelector', link: '/api/element-selector' },
            { text: 'Drivers', link: '/api/drivers' },
            { text: 'Types', link: '/api/types' }
          ]
        }
      ],
      '/examples/': [
        {
          text: 'Framework Examples',
          items: [
            { text: 'Detox Examples', link: '/examples/detox' },
            { text: 'Appium Examples', link: '/examples/appium' },
            { text: 'Custom Driver Examples', link: '/examples/custom-drivers' }
          ]
        },
        {
          text: 'Use Cases',
          items: [
            { text: 'Login Flow', link: '/examples/login-flow' },
            { text: 'Form Validation', link: '/examples/form-validation' },
            { text: 'Navigation Testing', link: '/examples/navigation' }
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/christopherferreira9/e2e-wrapper' },
      { icon: 'npm', link: 'https://www.npmjs.com/package/e2e-wrapper' }
    ],

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2024 E2E Wrapper Contributors'
    },

    search: {
      provider: 'local'
    },

    editLink: {
      pattern: 'https://github.com/christopherferreira9/e2e-wrapper/edit/main/docs/:path',
      text: 'Edit this page on GitHub'
    },

    lastUpdated: {
      text: 'Updated at',
      formatOptions: {
        dateStyle: 'full',
        timeStyle: 'medium'
      }
    }
  },

  markdown: {
    theme: 'github-dark',
    lineNumbers: true
  }
}) 