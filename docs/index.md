---
layout: home

hero:
  name: "E2E Wrapper"
  text: "Universal E2E Testing Framework"
  tagline: A generic abstraction layer for end-to-end testing frameworks with builder pattern support
  image:
    src: /logo.svg
    alt: E2E Wrapper
  actions:
    - theme: brand
      text: Get Started
      link: /guide/getting-started
    - theme: alt
      text: View on GitHub
      link: https://github.com/christopherferreira9/e2e-wrapper

features:
  - icon: 🔗
    title: Builder Pattern
    details: Chainable wait conditions for flexible test flows. Execute conditions in any order you need.
  - icon: 🎯
    title: Framework Agnostic
    details: Works with Detox, Appium, Playwright, Cypress, and custom implementations out of the box.
  - icon: 🚀
    title: TypeScript First
    details: Full TypeScript support with comprehensive type definitions and IntelliSense.
  - icon: 🔧
    title: Extensible
    details: Easy to add support for new frameworks with the BaseElementDriver abstraction.
  - icon: ⚡
    title: Lightweight
    details: Minimal dependencies, framework libraries are peer dependencies only.
  - icon: 🛡️
    title: Battle Tested
    details: Comprehensive test suite with 80%+ coverage and CI/CD integration.
---

## Quick Example

```typescript
import { createDetoxWrapper } from 'e2e-wrapper'

const wrapper = createDetoxWrapper({ testId: 'login-button' })

// Chain conditions in any order!
await wrapper
  .wait()
  .forVisible({ timeout: 10000 })
  .forEnabled({ timeout: 5000 })
  .execute()

// Or reverse the order
await wrapper
  .wait()
  .forEnabled()
  .forVisible()
  .execute()
```

## Supported Frameworks

<div class="framework-grid">
  <div class="framework-card">
    <h3>🤖 Detox</h3>
    <p>React Native testing framework</p>
  </div>
  <div class="framework-card">
    <h3>📱 Appium</h3>
    <p>Cross-platform mobile automation</p>
  </div>
  <div class="framework-card">
    <h3>🎭 Playwright</h3>
    <p>Modern web testing framework</p>
  </div>
  <div class="framework-card">
    <h3>🌲 Cypress</h3>
    <p>JavaScript end-to-end testing</p>
  </div>
</div>

<style>
.framework-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin: 2rem 0;
}

.framework-card {
  padding: 1.5rem;
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
  text-align: center;
}

.framework-card h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.2rem;
}

.framework-card p {
  margin: 0;
  color: var(--vp-c-text-2);
}
</style> 