# Antigravity Global UI & Agent Delivery Specification

## Part 1: Visual Design Tendencies & Aesthetics
When generating UI layers, blend modern micro-interactions with structured data density. Implement the following design treatments natively into your component rendering pipeline:

- **Bento Grids & Fluid Asymmetry:** Break away from rigid Excel-style layouts. Group contextual features into modular Bento-box cards. Introduce fluid asymmetry by giving key visual metrics or hero catalogs double the grid real estate of surrounding data, drawing immediate focus.
- **Glassmorphism & Tactile Maximalism (Liquid Glass):** Use subtle background blurs (backdrop-filter: blur), ultra-thin border treatments (1px translucent borders), and deep, multi-layered box shadows. This creates a high-end "liquid glass" look, giving elements depth and a tangible, tactile physical quality.
- **Immersive 3D, Spatial Computing, & Purposeful Motion:** UI transitions must feel natural, not abrupt. Use subtle parallax, micro-rotations, and 3D spatial transitions on card hover interactions. Motion must be functional—such as tracing a user's cursor or smoothly animating state changes—to guide focus without adding performance latency.
- **Scrollytelling & Intentional Imperfection:** Avoid dynamic structural shifts that disrupt reading. Instead, use controlled scrollytelling to gracefully reveal complex data as the user moves down the page. Incorporate intentional visual imperfections—such as off-center brand accents or organic layout asymmetries—to evoke a premium, bespoke artisan feel.

---

## Part 2: Structural Architecture & Multi-Tenant Guardrails

### 1. Dynamic Theming via Design Tokens
Instead of hardcoding styling properties (colors, fonts, margins), enforce a unified Design Token Architecture. Client brands can inject custom brand configurations, which must dynamically cascade through the application while strictly respecting safety and compliance guardrails.
- **UX Rule:** Restrict arbitrary styling access. Brands may only modify high-impact, non-structural identifiers: Primary and Secondary brand colors, Primary Typography (Headers), and Button Corner Radii.
- **UI Implementation Guardrail:** Generate a "Branding Settings" preview workspace. When an administrator mutates a primary color variable, automatically compute the color contrast ratio against the background layer using Web Content Accessibility Guidelines (WCAG) AAA/AA formulas. Block the user from saving the configuration if contrast validation fails.

### 2. Guardrailed White-Labeling
Provide client brands with the illusion of bespoke, custom storefront control while keeping the core functional user experience mathematically locked.
- **The Principle:** The core functional skeleton—including layout distributions, core navigation rails, checkouts, and data form structures—must remain absolutely identical across all workspaces. Only the superficial visual skin changes.
- **UI Implementation Guardrail:** Implement an immutable "Component Slotting" system. Predefine layout containers where tenants can stream tailored rich media (hero videos, collection banners, lifestyle imagery). Explicitly forbid subagents or users from altering the absolute positioning, stacking order, or visibility of operational actions like the "Buy Now" CTA or product specification fields.

### 3. Automated Asset Optimization Pipeline
Luxury portals rely heavily on massive, uncompressed photography. The UI infrastructure must process these heavy assets gracefully to prevent client-side performance degradation or layout shifting.
- **UX Rule:** Assume asset managers will upload uncropped, uncompressed raw imagery. The UI must handle heavy lifting silently without breaking layout bounds.
- **UI Implementation Guardrail:** Enforce a drag-and-drop media manager equipped with the following functional layers:
  - *Dual Live Cropping:* Display simultaneous desktop (16:9) and mobile (9:16) safe-zone bounding boxes over the asset during upload so the user visualizes crop points instantly.
  - *Automated Serverless Conversion:* Intercept file uploads (TIFF, PNG, RAW) and compress them directly on-upload into high-fidelity, next-generation web formats (AVIF or WebP) with strict responsive source-set generation.

### 4. Visual Uniformity in Product Cataloging
While landing pages can lean into creative asymmetry, transactional layout patterns like inventory matrix tables and Product Detail Pages (PDP) must adhere to strict structural consistency for high-velocity operational tasks.
- **The Principle:** B2B buyers handle high-volume procurement; they must not be forced to relearn standard ordering paths when moving between different brand catalogs inside the portal ecosystem.
- **UI Implementation Guardrail:** Anchor critical purchase selectors to hardcoded layout blocks. The exact coordinates and positions of the Carat/Metal Selector matrices, Size Selection guides, and Certificate Downloads (e.g., GIA/IGI verification links) must be identical across all portals. Brands may only alter typography styles, text weights, and localized copy within those static component envelopes.

### 5. Multi-Market Localization Controls
Global scale requires interface architectures that natively accommodate shifting regional data formats and language mechanics without warping layout structures.
- **UX Rule (Flexible UI Wrappers):** Absolutely prohibit fixed-width dimensions on text containers. Every container holding copy must rely on flexible structural layout styling (such as CSS Flexbox or Auto Layout matrices). Ensure layouts dynamically adjust, as languages like German or French expand up to 30% further horizontally than English equivalents.
- **UI Implementation Guardrail (Currency and Language Previews):** Render a global, persistent administrative workspace header. Provide one-click toggle triggers that immediately simulate how text boxes, line items, and pricing structures render under alternative regional locales (e.g., USD ($), EUR (€), INR (₹)). The engine must ensure currency notation, character wrapping, and multi-line item cards preserve uniform vertical balance in all states.

---

## Part 3: Roadmap Execution, QC, & Task Verification Loops

When executing tasks or interacting within this project workspace, you must adhere to the following task management and reporting cycle:

### 1. Adaptive Roadmap Execution
- Read tasks strictly from the designated development roadmap documentation file. 
- You are granted explicit permission to improvise code implementation paths or UI architecture layout nuances mid-task if technical hurdles emerge, provided the improvisation elevates code performance, satisfies the styling guardrails in Part 1, or enhances usability.

---

## Part 4: Continuous Roadmap Syncing & UI Trends

### 1. Centralized Task Management
- The source of truth for all tasks is the development roadmap located at `http://localhost:3000/admin/roadmap`.
- You must always take tasks strictly according to this roadmap. However, you are empowered to improvise if a technical pivot is required during mid-development.

### 2. Live Roadmap Updating
- Every time you perform Quality Control (QC) or complete a major project phase, you MUST update the roadmap page.
- Log your review of pending tasks, current task statuses, implementation strategies, and testing results directly into the roadmap.
- Every time a task code modifications occur, you must comprehensively update the roadmap file to accurately reflect project status.
- Update layouts or tables to itemize: **Pending Tasks**, **Task Status (Not Started, In Progress, Complete)**, **Implementation Notes**, and **Testing Outcomes**. 
- Accompany updates with rich progress demonstrations using Antigravity's Walkthrough or Artifact snapshot states.

### 3. Default Progress Reporting
- By default, accompany your final output with a comprehensive project Progress Demonstration.
- Explicitly declare what was done and provide clear testing points in your command outputs so the user can easily review the state of the project.
- Always provide immediate Testing URLs, Profiles, and Credentials for rapid cross-checking.
- Consistently build using global standards and adhere to the high-level UI trends established for this portal.
