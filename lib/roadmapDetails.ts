export const taskDetailsMap: Record<string, { description: string; howToTest: string; testPath: string }> = {
  // Phase 1
  "1.1 Interactive PIM Grid": {
    description: "Built the master Product Information Management (PIM) grid. This allows admins to view, filter, and manage all jewelry inventory in a data-dense spreadsheet-like view.",
    howToTest: "Log in as an Admin, navigate to the catalog, and try sorting/filtering the inventory data.",
    testPath: "/admin/catalog"
  },
  "1.2 Bulk-Sync API Engine": {
    description: "Developed a backend API engine capable of processing thousands of SKUs in bulk, syncing external legacy data into the modern database.",
    howToTest: "Trigger a bulk sync via POST request or use the data import engine UI.",
    testPath: "/api/admin/products/bulk-sync"
  },
  "1.3 System Route Auditor": {
    description: "Created a developer tracking tool that automatically lists all active public, protected, and admin routes in the application for easy navigation.",
    howToTest: "Navigate to the auditor and click on any of the listed test routes.",
    testPath: "/admin/system-routes"
  },
  "1.4 Route Consolidation": {
    description: "Refactored Next.js routing and next.config.mjs to consolidate duplicate pages and enforce clean URL structures.",
    howToTest: "Verify that all old legacy routes properly redirect to their new App Router equivalents.",
    testPath: "next.config.mjs"
  },
  "1.5 Appearance Theme Engine": {
    description: "Implemented a UI configuration engine allowing admins to customize primary brand colors, typography, and logo assets globally.",
    howToTest: "Navigate to settings and change the primary brand color; watch the UI update in real-time.",
    testPath: "/admin/settings"
  },

  // Phase 2
  "2.1 NextAuth JWT Setup": {
    description: "Configured secure, stateless JSON Web Token (JWT) authentication using NextAuth, allowing session state without heavy database lookups.",
    howToTest: "Log in and inspect your browser cookies to see the encrypted NextAuth JWT.",
    testPath: "/api/auth"
  },
  "2.2 B2B Login & Registration UI": {
    description: "Designed a secure gateway for B2B partners to register for access and log in to the wholesale platform.",
    howToTest: "Visit the login page, enter credentials, and ensure you are redirected to the dashboard.",
    testPath: "/login"
  },
  "2.3 RBAC Edge Middleware": {
    description: "Engineered Edge Middleware that intercepts requests before they hit the server, instantly blocking unauthenticated users and routing them away from protected data.",
    howToTest: "Try visiting a protected route (like /dashboard) in an incognito window without logging in.",
    testPath: "middleware.ts"
  },
  "2.4 User Verification CRM": {
    description: "Built the Admin CRM interface to approve, reject, or suspend wholesale partners who apply for access.",
    howToTest: "Log in as Admin, navigate to clients, and toggle the approval status of a pending user.",
    testPath: "/admin/clients"
  },

  // Phase 3
  "3.1 Master Lookbook Grid": {
    description: "Developed the client-facing presentation grid, displaying high-quality product assets with pricing restricted to their specific discount tier.",
    howToTest: "Log in as a Client and view the dashboard catalog.",
    testPath: "/dashboard"
  },
  "3.2 Framer Motion Flipbook": {
    description: "Replaced standard grids with an immersive, animated digital flipbook catalog using Framer Motion for a luxury viewing experience.",
    howToTest: "Open a catalog in the flipbook view and use the arrow keys to turn pages.",
    testPath: "/catalog/flipbook/1"
  },
  "3.3 PIN Gatekeeper": {
    description: "Implemented a secondary security layer requiring a unique PIN to access specific high-security collections.",
    howToTest: "Attempt to view a restricted catalog and enter the required PIN.",
    testPath: "/login"
  },
  "3.4 Price Breakup Export": {
    description: "Added functionality for clients to instantly generate and download PDF proforma invoices showing the exact metal/diamond weight breakups.",
    howToTest: "Go to your order history and click 'Download PDF' on any past order.",
    testPath: "/dashboard/history"
  },

  // Phase 4
  "4.1 Global Cart State": {
    description: "Implemented a persistent Zustand global state manager to keep track of the user's selected items across the entire session.",
    howToTest: "Add an item to the cart, navigate to a different page, and verify the cart retains the item.",
    testPath: "store/useCartStore.ts"
  },
  "4.2 PO Matrix Checkout UI": {
    description: "Built the master matrix checkout interface, allowing buyers to see all their selected metal purities and sizes in one consolidated view.",
    howToTest: "Open the cart slide-out to review your matrix selections.",
    testPath: "/dashboard/cart"
  },
  "4.3 Real-Time Price Breakup": {
    description: "Engineered a live calculation module that updates the total PO value instantly as the user changes quantities in the matrix.",
    howToTest: "Open the cart and change a quantity; watch the total price instantly recalculate.",
    testPath: "components/MatrixModal.tsx"
  },
  "4.4 Draft PO Generation": {
    description: "Created the backend execution engine that compiles the cart state into a formal Purchase Order in the database.",
    howToTest: "Click 'Generate PO' in the cart and verify the order appears in your history.",
    testPath: "/api/checkout/execute"
  },

  // Phase 5
  "5.1 MCX Live Bullion Sync": {
    description: "Integrated an API bridge to fetch live commodity market rates (MCX) for Gold and Silver, ensuring pricing is always accurate to the minute.",
    howToTest: "Check the Admin pricing dashboard to see the latest synced bullion rates.",
    testPath: "/api/pricing/mcx"
  },
  "5.2 Dynamic Margin Calculator": {
    description: "Built the algorithmic pricing engine that takes live metal rates, adds making charges, and calculates final wholesale costs.",
    howToTest: "Review product prices on the client dashboard to see the calculated totals.",
    testPath: "lib/pricing/calculator.ts"
  },
  "5.3 Discount CRM Engine": {
    description: "Created a module for admins to assign specific percentage-based discount tiers to different wholesale clients.",
    howToTest: "Log in as Admin, go to Discounts, and assign a 5% discount to a specific client.",
    testPath: "/admin/discounts"
  },
  "5.4 Tiered B2B Discounts": {
    description: "Implemented the core logic that automatically applies a client's assigned discount tier to all products across the platform.",
    howToTest: "Log in as a discounted client and verify that catalog prices reflect the lower rate.",
    testPath: "lib/pricing/discounts.ts"
  },
  "5.5 Sales Rep Dashboard": {
    description: "Developed a dedicated portal for field sales representatives to track their assigned clients and pipeline value.",
    howToTest: "Log in as a Sales profile and view your specific client portfolio.",
    testPath: "/admin"
  },
  "5.6 Client Impersonation": {
    description: "Engineered an impersonation API allowing Sales Reps to securely log in 'as' their client to help them place orders without knowing their password.",
    howToTest: "As a Sales Rep, click 'Impersonate' next to a client's name.",
    testPath: "/api/admin/impersonate"
  },
  "5.7 Client Profile Hub": {
    description: "Built the settings interface for clients to update their billing/shipping addresses and view their account standing.",
    howToTest: "Navigate to settings as a client and update your address.",
    testPath: "/dashboard/settings"
  },

  // Phase 6
  "6.1 PO Inbox & Triage Kanban": {
    description: "Created an admin-facing Kanban board to track the fulfillment status (Pending -> Processing -> Shipped) of incoming Purchase Orders.",
    howToTest: "Log in as Admin, navigate to Orders, and drag a PO to a new status.",
    testPath: "/admin/orders"
  },
  "6.2 ERP Webhook Engine": {
    description: "Set up Webhook infrastructure to transmit finalized Purchase Orders out to external manufacturing/ERP systems.",
    howToTest: "Generate a new PO and check the backend logs for the webhook transmission payload.",
    testPath: "/api/webhooks/erp"
  },
  "6.3 SendGrid Automations": {
    description: "Integrated SendGrid to automatically dispatch transactional emails (Order Confirmations, Account Approvals) to clients.",
    howToTest: "Register a new account or place an order to trigger the automated email.",
    testPath: "lib/mail/sendgrid.ts"
  },

  // Phase 7
  "7.1 Theme Configuration Store": {
    description: "Built the global database store for saving the admin's chosen UI theme configurations.",
    howToTest: "Save new brand colors in the admin settings and refresh the page to see them persist.",
    testPath: "/admin/settings/theme"
  },
  "7.2 CSS Variable Injection API": {
    description: "Engineered an API that injects CSS variables into the root layout dynamically based on the tenant's saved theme.",
    howToTest: "Inspect the DOM root to see the custom `--brand-primary` CSS variables applied.",
    testPath: "/api/admin/theme"
  },
  "7.3 Live Preview Engine": {
    description: "Developed a real-time preview component that allows admins to see how their color changes will look before saving.",
    howToTest: "Change a color hex code in settings and watch the preview card update instantly.",
    testPath: "/admin/settings/theme"
  },

  // Phase 8
  "8.1 PostgreSQL Tenant Schema": {
    description: "Refactored the Prisma schema to support true SaaS Multi-Tenancy by adding a TenantId boundary to all core data models.",
    howToTest: "Check the database tables to verify all records are now isolated by tenantId.",
    testPath: "prisma/schema.prisma"
  },
  "8.2 Edge Subdomain Routing": {
    description: "Upgraded the Edge Middleware to detect incoming hostnames (subdomains) and automatically inject the correct Tenant context.",
    howToTest: "Access the site via a custom localhost subdomain to see tenant routing in action.",
    testPath: "middleware.ts"
  },
  "8.3 Headless JWT Strict Auth": {
    description: "Enhanced the NextAuth configuration to strictly bind JWT session tokens to a specific tenant, preventing cross-tenant data leaks.",
    howToTest: "Verify that logging into one tenant's portal does not grant access to another.",
    testPath: "/api/auth/[...nextauth]"
  },
  "8.4 Multi-Tenant Public Branding": {
    description: "Implemented dynamic metadata injection so each tenant gets their own Favicon, Title, and SEO description on public links.",
    howToTest: "View the page source of a catalog link to see the dynamic meta tags.",
    testPath: "/catalog/view/1"
  },
  "8.5 Brand Asset Bundler & Downloads": {
    description: "Created an API allowing tenants to bulk download their specific product images from the CDN for social media marketing.",
    howToTest: "Click 'Download Assets' on a catalog to receive a bundled ZIP of images.",
    testPath: "/api/brand/assets"
  },

  // Phase 9
  "9.1 Admin SDUI Layout Builder": {
    description: "Engineered the Server-Driven UI layout builder, enabling Admins to construct custom component arrangements (Banners, Grids) via JSON payloads.",
    howToTest: "Navigate to Layout Builder, add a new Banner component, and see it render in the preview.",
    testPath: "/admin/layout-builder"
  },
  "9.2 Native Mobile Auth (Expo)": {
    description: "Built dedicated, stateless POST endpoints leveraging `jose` to issue secure JWTs specifically for the React Native mobile app.",
    howToTest: "Send a POST request with credentials to the mobile auth API to receive a Bearer token.",
    testPath: "/api/mobile/auth"
  },
  "9.4 Mobile Responsive Flipbook": {
    description: "Optimized the immersive flipbook catalog to support touch-swipes and portrait scaling on mobile devices.",
    howToTest: "Open the flipbook on a mobile device and swipe left/right to turn pages.",
    testPath: "/catalog/flipbook/1"
  },

  // Phase 10
  "10.1 Bulk Sync Data Validation": {
    description: "Implemented rigorous schema validation to catch errors (missing fields, duplicate SKUs) during massive CSV/JSON data imports.",
    howToTest: "Attempt to upload a malformed CSV to the import engine and review the error logs.",
    testPath: "/admin/inventory/import"
  },
  "10.2 Expo EAS OTA Update Pipeline": {
    description: "Configured the `eas.json` pipeline to allow Over-The-Air JavaScript updates to the mobile app without requiring app store resubmissions.",
    howToTest: "Review the EAS configuration file.",
    testPath: "eas.json"
  },
  "10.3 Impersonation JWT Token Swap": {
    description: "Built an advanced security protocol that swaps a Super Admin JWT for a Client JWT to seamlessly impersonate users.",
    howToTest: "Trigger an impersonation session and verify the token role changes.",
    testPath: "/api/admin/impersonate"
  },

  // Phase 11
  "11.1 Custom Domain DNS Resolver": {
    description: "Configured the Edge Middleware to intercept Custom Vanity Domains (e.g., wholesale.tiffany.com) and map them to internal Tenant IDs invisibly.",
    howToTest: "Review the Host header inspection logic in middleware.ts.",
    testPath: "middleware.ts"
  },
  "11.2 BYODB (Bring Your Own DB) Router": {
    description: "Engineered a dynamic Prisma connection pool router that spins up isolated PostgreSQL instances for Enterprise clients providing their own database strings.",
    howToTest: "Review getTenantPrisma() in lib/prisma.ts to see the connection pooling logic.",
    testPath: "lib/prisma.ts"
  },
  "11.3 Automated PITR Cloud Backups": {
    description: "Provided the AWS/Supabase DevOps blueprint for configuring Point-in-Time Recovery (PITR) to ensure zero data loss during catastrophic failures.",
    howToTest: "Review the AWS DevOps Guide artifact for configuration steps.",
    testPath: "AWS_DEVOPS_GUIDE.md"
  },
  "11.4 QLDB Tamper-Proof PO Ledger": {
    description: "Outlined the architecture for integrating Amazon Quantum Ledger Database (QLDB) to create cryptographically immutable records of all financial Purchase Orders.",
    howToTest: "Review the AWS DevOps Guide artifact.",
    testPath: "AWS_DEVOPS_GUIDE.md"
  },

  // Phase 12
  "12.1 Client Ticket Submission UI": {
    description: "Built a dedicated support portal for clients to submit bug reports and feature requests directly to the development team.",
    howToTest: "Log in as a Client, navigate to Support, and submit a new ticket.",
    testPath: "/dashboard/support"
  },
  "12.2 Master Kanban Board (Drag & Drop)": {
    description: "Engineered a real-time, drag-and-drop Jira-style Kanban board allowing admins to effortlessly transition support tickets through resolution stages.",
    howToTest: "Navigate to Tickets as an Admin and drag a ticket from Open to In Progress.",
    testPath: "/admin/tickets"
  },
  "12.3 Ticket Analytics (Client Load)": {
    description: "Developed a tracking dashboard that visualizes ticket volume, SLA resolution rates, and identifies which specific clients require the most support.",
    howToTest: "Open the Analytics dashboard as an Admin to view the ticket metrics.",
    testPath: "/admin/analytics"
  },
  "12.4 Developer Assignment Engine": {
    description: "Updated the core PostgreSQL schema via Prisma to support complex relational mapping between Tickets, the Clients who reported them, and assigned Developers.",
    howToTest: "Review the Ticket and TicketMessage models in the Prisma schema.",
    testPath: "prisma/schema.prisma"
  }
};
