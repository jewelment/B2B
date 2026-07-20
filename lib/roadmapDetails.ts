export type TaskDetail = {
  description: string;
  howToTest: string;
  testPath: string;
  images?: { src: string; caption: string }[];
};

export const taskDetailsMap: Record<string, TaskDetail> = {
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
    howToTest: "Inspect the DOM root to see the custom '--brand-primary' CSS variables applied.",
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
    description: "Built dedicated, stateless POST endpoints leveraging jose to issue secure JWTs specifically for the React Native mobile app.",
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
    description: "Configured the eas.json pipeline to allow Over-The-Air JavaScript updates to the mobile app without requiring app store resubmissions.",
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
    description: "Configured the Edge Middleware to intercept Custom Vanity Domains and map them to internal Tenant IDs invisibly.",
    howToTest: "Review the Host header inspection logic in middleware.ts.",
    testPath: "middleware.ts"
  },
  "11.2 BYODB (Bring Your Own DB) Router": {
    description: "Engineered a dynamic Prisma connection pool router that spins up isolated PostgreSQL instances for Enterprise clients.",
    howToTest: "Review getTenantPrisma() in lib/prisma.ts to see the connection pooling logic.",
    testPath: "lib/prisma.ts"
  },
  "11.3 Automated PITR Cloud Backups": {
    description: "Provided the AWS/Supabase DevOps blueprint for configuring Point-in-Time Recovery (PITR).",
    howToTest: "Review the AWS DevOps Guide artifact for configuration steps.",
    testPath: "AWS_DEVOPS_GUIDE.md"
  },
  "11.4 QLDB Tamper-Proof PO Ledger": {
    description: "Outlined the architecture for integrating Amazon Quantum Ledger Database (QLDB) to create cryptographically immutable records.",
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
  },
  "9.3 Headless PO Matrix Checkout": {
    description: "Engineered a headless order execution flow that consolidates PO matrix quantities into the database without requiring standard cart progression, enabling one-click multi-SKU generation.",
    howToTest: "Add multiple variations to the matrix and generate a PO instantly.",
    testPath: "/dashboard/cart"
  },
  "13.4 Advanced Styling Controls (Colors, Layout)": {
    description: "Built the comprehensive SDUI visual property editor giving Admin full control over padding, typography, border-radius, background images, and layout spacing for all components.",
    howToTest: "Navigate to the Theme Builder and tweak layout settings for any component.",
    testPath: "/admin/theme-builder"
  },
  "13.5 Advanced SDUI Drag-and-Drop": {
    description: "Engineered true cross-container drag-and-drop using @dnd-kit/core. Implemented a professional Layers panel for buttery-smooth hierarchical sorting and global Header/Footer pinning.",
    howToTest: "Open the Builder, drag blocks from the library, reorder them in the layers panel, and upload local images.",
    testPath: "/admin/pages"
  },
  "13.6 Multi-Environment Publishing": {
    description: "Updated database architecture to support distinct Draft, Development, Staging, and Production environments for layouts, providing true enterprise deployment pipelines.",
    howToTest: "Save a layout to Staging, then verify the storefront Dashboard defaults to fetching Production.",
    testPath: "/dashboard"
  },
  "14.1 Real Inventory CSV Import Test": {
    description: "Upload an authentic CSV containing real inventory variations to verify the PIM engine, pricing calculations, and matrix builder work smoothly with production-grade data volumes.",
    howToTest: "Navigate to the Bulk Sync page and upload your real CSV file.",
    testPath: "/admin/inventory/import"
  },
  
  // Phase 17
  "17.1 Options Master Grid": {
    description: "Built the centralized parameters dashboard allowing admins to define global options (Metal, Gemstone, Size) with specific input types (Drop-Down List) for the variant generation engine. \n\n**Detailed Context (From HTML):**\nThe option menu is very important in the perspective of the jewelry variant. The multiple possible options can help to create the multiple possible variants. It works on permutation combinations fundamentally. Components like Gemstone, Metal, Diamond, Sizes — all of these combinations can make a unique jewelry piece which can easily support our custom order mechanism into the B2B business model. For every option/component we have a dedicated setting panel. For example, when we click on Metal, we can assign option name, front-end name, and toggle options like 'including in filters' and 'including in price master'. Expanding the Gold menu reveals multiple fields like gold priority (14KT, 18KT, 22KT) and gold color (Yellow, White, Rose Gold).",
    howToTest: "Navigate to Parameters -> Options and view the All Options tab.",
    testPath: "/admin/parameters/options",
    images: [
      { src: "/extracted_media/image33.png", caption: "Parameters — All Options Master List" },
      { src: "/extracted_media/image34.png", caption: "Parameters — Edit Option Detail View (Metal)" },
      { src: "/extracted_media/image35.png", caption: "Parameters — Option Values Hierarchy" },
      { src: "/extracted_media/image36.png", caption: "Diamond & Gemstone Options Configuration" }
    ]
  },
  "17.2 Option Sets Hierarchy Builder": {
    description: "Engineered the hierarchical interface for grouping specific Options and OptionValues into logical 'Sets' (e.g., Ladies Diamond Rings 6-20 All Os), powering automated complex permutations. \n\n**Detailed Context (From HTML):**\nIn the menu of options, we click on another tab 'Option Sets'. With all six options we create around 320 option sets that help us predict variants. **How it all works:** Here we set all the options and inside we create the multiple option sets. Whenever we create the product we just need to select the option of this particular set and then we can see all the product variant options on our PDP or all active variants. (e.g., Chain Bracelet Gemstone OS, Ladies Diamond Gemstone Ring All OS).",
    howToTest: "Create an Option Set and assign Metal (14KT/18KT), Diamond (SI-HI), and Sizes (7-20).",
    testPath: "/admin/parameters/options/sets",
    images: [
      { src: "/extracted_media/image37.png", caption: "Parameters — Option Sets Master List (320 Sets)" },
      { src: "/extracted_media/image38.png", caption: "Option Sets — Group Configuration (Top Section)" },
      { src: "/extracted_media/image39.png", caption: "Option Sets — Metal Hierarchy Setup" },
      { src: "/extracted_media/image40.png", caption: "Option Sets — Diamond & Gemstone Setup" },
      { src: "/extracted_media/image41.png", caption: "Option Sets — Group Configuration Overview (Ring)" },
      { src: "/extracted_media/image42.png", caption: "Parameters — All Options Master List (Size Focus)" },
      { src: "/extracted_media/image43.png", caption: "Option Sets — Expanded Size Parameter" }
    ]
  },
  "17.3 Product Categories Management": {
    description: "Developed the taxonomy tree manager allowing admins to build out categories and sub-categories with associated view logs to track accountability.",
    howToTest: "1. Navigate to Categories (/admin/parameters/categories).\n2. Verify the fluid w-full layout spans correctly.\n3. Test the horizontal tab navigation (Categories, Sub Categories, Archived).\n4. Verify data grid displays Name, Products Count, Status Badges.",
    testPath: "/admin/parameters/categories",
    images: [
      { src: "/extracted_media/image32.png", caption: "Parameters — Categories Dashboard" },
      { src: "/extracted_media/image103.png", caption: "Parameters Module — Detailed Category Audit Logs" }
    ]
  },
  "17.4 Collections Matrix (Manual & Rule-Based)": {
    description: "Built the collection grouping engine. Supports manual assignment of products or dynamic rule-based sorting (e.g., OR/AND logic for 'Best-Sellers').",
    howToTest: "1. Open Collections Dashboard (/admin/parameters/collections).\n2. Test tab filters (Active, Inactive).\n3. Click a row to open the Edit view (/admin/parameters/collections/[id]).\n4. Verify 'Manual Product Assignment' priority sorting.\n5. Test character tracking on SEO metadata fields.",
    testPath: "/admin/parameters/collections",
    images: [
      { src: "/extracted_media/image47.png", caption: "Parameters — Collections Dashboard" },
      { src: "/extracted_media/image48.png", caption: "Collection Edit — Primary Information View (Echo)" },
      { src: "/extracted_media/image49.png", caption: "Collection Edit — Manual Product Assignment" },
      { src: "/extracted_media/image50.png", caption: "Collection Edit — Search Engine Optimisation (SEO)" }
    ]
  },
  "17.5 Collection Sub-Section Media Architecture": {
    description: "Implemented a responsive, section-based media upload interface for collections, allowing distinct 'Desktop Media' and 'Mobile Media' assets for the frontend hero layout.",
    howToTest: "Edit a collection, add a sub-section, and upload a desktop hero banner.",
    testPath: "/admin/parameters/collections/edit",
    images: [
      { src: "/extracted_media/image51.png", caption: "Parameters — Collection Details Dashboard" },
      { src: "/extracted_media/image52.png", caption: "Collection Details — Edit Section Architecture" },
      { src: "/extracted_media/image53.png", caption: "Collection Details — Sub-Section Media Configuration" }
    ]
  },

  // Phase 18
  "18.1 Single Product Editable Timeline": {
    description: "Designed a multi-step timeline workflow (Info, Options, Price Master, Variants) for editing individual products. Integrates a WYSIWYG editor, status toggles, and live visual preview card.",
    howToTest: "1. Navigate to Edit Product (/admin/products/edit/123).\n2. Test the Left Pane vertical timeline (click steps to see Framer Motion transitions).\n3. Verify the WYSIWYG editor loads correctly without SSR errors.\n4. Type in SEO Title and Meta Description to test dynamic character limit trackers (turn amber when exceeded).\n5. Test the 'AI Generate' UI placeholder in the Media Grid.",
    testPath: "/admin/products/edit",
    images: [
      { src: "/extracted_media/image5.png", caption: "Product Info — General Data & Preview" },
      { src: "/extracted_media/image6.png", caption: "Media Management Grid & AI Generate" },
      { src: "/extracted_media/image7.png", caption: "Product Type Selection Panel" },
      { src: "/extracted_media/image8.png", caption: "Product Type & Inventory Configuration" },
      { src: "/extracted_media/image9.png", caption: "Inventory Tracking & Pricing Toggles" },
      { src: "/extracted_media/image10.png", caption: "Shipping & Search Engine Optimisation" },
      { src: "/extracted_media/image11.png", caption: "Options — Variant Mapping Configuration" },
      { src: "/extracted_media/image12.png", caption: "Options — Empty State (Create or Import)" },
      { src: "/extracted_media/image13.png", caption: "Import Option Sets — Modal Popup" },
      { src: "/extracted_media/image20.png", caption: "Product Info — General Data & Preview (Full View)" },
      { src: "/extracted_media/image45.png", caption: "Product Info — General Data Configuration" },
      { src: "/extracted_media/image46.png", caption: "Product Options — Variant Configuration" }
    ]
  },
  "18.2 Automated Variant Matrix UI": {
    description: "Built the massive grid view that renders hundreds of generated variant combinations. Integrates individual weight entry, price breakups, and variant status toggles.",
    howToTest: "Navigate to the Variants step of a product and use the pagination controls.",
    testPath: "/admin/products/variants",
    images: [
      { src: "/extracted_media/image14.png", caption: "1. Variant Master List — Configuration View" },
      { src: "/extracted_media/image15.png", caption: "2. Variant Master List — Pagination View" },
      { src: "/extracted_media/image16.png", caption: "3. Variant Master List — Horizontal Scroll View" },
      { src: "/extracted_media/image18.png", caption: "Variant Master List — Price Breakup Overlay" },
      { src: "/extracted_media/image19.png", caption: "Frontend Product Detail Page — Price Breakup" }
    ]
  },
  "18.3 Variant Media Upload Modal": {
    description: "Engineered a specific modal allowing admins to map unique media assets (Primary Image, Videos) to specific variant configurations for accurate color-swapping on the storefront.",
    howToTest: "Click the image icon on a variant row and upload a specific gold-color image.",
    testPath: "/admin/products/media",
    images: [
      { src: "/extracted_media/image17.png", caption: "4. Variant Medias — Upload Modal" }
    ]
  },
  "18.4 Inventory Store Allocation Grid": {
    description: "Created the logistics interface mapping available inventory variants to specific physical store branches with active/inactive availability badges.",
    howToTest: "Navigate to Inventory and view the branch allocation for a specific SKU.",
    testPath: "/admin/inventory/stores",
    images: [
      { src: "/extracted_media/image21.png", caption: "Inventory Management Panel" }
    ]
  },
  "18.5 Product Reviews Workflow": {
    description: "Built the review management panel allowing admins to approve, deny, and track client product feedback. Features star-rating visuals and user linking.",
    howToTest: "Navigate to Product Reviews and filter by Pending status.",
    testPath: "/admin/inventory/reviews",
    images: [
      { src: "/extracted_media/image22.png", caption: "Product Reviews Dashboard" }
    ]
  },
  "18.6 Master Inventory Grid": {
    description: "The primary master inventory grid for viewing, filtering, and managing product catalog listings across all statuses (Active, Draft, Archived).",
    howToTest: "1. Navigate to Master Inventory (/admin/inventory/master-grid).\n2. Verify the staggered Fade-and-Cascade Framer Motion animation upon load.\n3. Verify liquid glass backdrop-filter on the top Bento Grid widgets.\n4. Hover over rows to check 'Ambient Occlusion' shadow adjustments.\n5. Test the 'Press and Inset' micro-interactions on the Action buttons.",
    testPath: "/admin/products",
    images: [
      { src: "/extracted_media/image4.png", caption: "All Products Management Console" },
      { src: "/extracted_media/image44.png", caption: "All Products — Master Inventory Grid" }
    ]
  },

  // Phase 19
  "19.1 Live Metal Price Dashboard": {
    description: "Developed the live pricing matrix syncing real-time MCX bullion rates for exact carat purities (9KT, 14KT, 18KT, 22KT, 24KT) alongside manual override options.",
    howToTest: "Navigate to Live Price and view the active gold/silver metrics.",
    testPath: "/admin/pricing/live",
    images: [
      { src: "/extracted_media/image64.png", caption: "Live Price Management Dashboard" }
    ]
  },
  "19.2 Diamond & Gemstone Price Master Matrix": {
    description: "Built the core algorithmic foundation for the B2B pricing model, managing granular cost bases for Diamonds, Pearl, and Gemstones categorized by setting type and shape.",
    howToTest: "Navigate to Price Master and view the Diamond Pricing Matrix.",
    testPath: "/admin/pricing/master",
    images: [
      { src: "/extracted_media/image60.png", caption: "Price Master — Main Dashboard" },
      { src: "/extracted_media/image61.png", caption: "Price Master — Diamond Pricing Matrix" }
    ]
  },
  "19.3 Standard Details Configuration Modal": {
    description: "Engineered a complex popover matrix allowing admins to set numeric price values based strictly on minimum and maximum physical weight brackets.",
    howToTest: "Edit a Diamond Price Master rule and adjust the minimum weight threshold.",
    testPath: "/admin/pricing/standard",
    images: [
      { src: "/extracted_media/image62.png", caption: "Diamond Price Configuration" },
      { src: "/extracted_media/image63.png", caption: "Price Master — Standard Details Configuration Modal" }
    ]
  },
  "19.4 Making Charges & Pearl Price Matrices": {
    description: "Integrated the Making Charges management console allowing granular labor cost additions synchronized with the broader Omnichannel framework.",
    howToTest: "Navigate to Price Master and edit the Making Charges configuration.",
    testPath: "/admin/pricing/charges"
  },

  // Phase 20
  "20.1 Banner Management Directory": {
    description: "Built a highly visual grid-based asset directory indexing all frontend promotional zones (Store, Checkout, Leadpopup, Pdp, Pip, Featured).",
    howToTest: "Navigate to Banners and view the available placement groups.",
    testPath: "/admin/banners",
    images: [
      { src: "/extracted_media/image65.png", caption: "Banner Management Dashboard — Primary View" },
      { src: "/extracted_media/image66.png", caption: "Banner Management Dashboard — Scrolled View" },
      { src: "/extracted_media/image67.png", caption: "Banner Detail — Hero Banner Configuration" },
      { src: "/extracted_media/image71.png", caption: "Banner Management — PLP Configuration" }
    ]
  },
  "20.2 Edit Banner Modal & Responsive Media Mapping": {
    description: "Engineered the modal overlay for uploading responsive banner assets (Desktop/Mobile media, thumbnails). Includes URL redirect linking and rich-text descriptions.",
    howToTest: "Click a banner group and upload a new promotional graphic.",
    testPath: "/admin/banners/edit",
    images: [
      { src: "/extracted_media/image68.png", caption: "Edit Banner Modal — Media Assets" },
      { src: "/extracted_media/image69.png", caption: "Edit Banner Modal — Additional Details" }
    ]
  },
  "20.3 PLP In-Grid Promo Banner Integration": {
    description: "Developed the engine that allows targeted, dynamic promotional banners to be injected directly into the standard Product Listing Page (PLP) catalog grid.",
    howToTest: "Assign a banner to the PLP group and view it alongside products on the storefront.",
    testPath: "/admin/banners/plp",
    images: [
      { src: "/extracted_media/image72.png", caption: "Frontend PLP — In-Grid Promo Banner" },
      { src: "/extracted_media/image73.png", caption: "Frontend PLP — Dynamic Banner Display" }
    ]
  },
  "20.4 Frontend Hero Landing Page Automation": {
    description: "Built the SDUI connection rendering the configured 'Herobanner' and 'Collections' directly onto the Next.js B2B/B2C landing pages.",
    howToTest: "Visit the live storefront home page and verify the banner matches the admin configuration.",
    testPath: "/admin/banners/landing",
    images: [
      { src: "/extracted_media/image54.png", caption: "Frontend Landing Page — Hero Banner" },
      { src: "/extracted_media/image55.png", caption: "Frontend Landing Page — Featured Collections" },
      { src: "/extracted_media/image56.png", caption: "Frontend Landing Page — Collections Grid" },
      { src: "/extracted_media/image57.png", caption: "Frontend Collection Details — Hero Section (Blare Collection)" },
      { src: "/extracted_media/image58.png", caption: "Frontend Collection Details — Alternate Hero" },
      { src: "/extracted_media/image59.png", caption: "Frontend Collection Details — Editorial Content" },
      { src: "/extracted_media/image70.png", caption: "Frontend Landing Page — Promotional Hero Banner" }
    ]
  },
  "20.5 Theme Builder & Assets Library": {
    description: "Storefront configuration enabling deep customization of headers, footers, website layouts, and multi-domain connectivity.",
    howToTest: "Navigate to Theme Builder and modify a global template.",
    testPath: "/admin/theme-builder",
    images: [
      { src: "/extracted_media/image1.png", caption: "Storefront & Builders Interface" }
    ]
  },

  // Phase 21
  "21.1 All Orders & Ecom Orders Advanced Filters": {
    description: "Created a comprehensive orders dashboard featuring advanced slide-out filter panels allowing precise segmentation by Payment Status, Destination, Date, and Tags.",
    howToTest: "Navigate to Orders and toggle the advanced filter accordion menu.",
    testPath: "/admin/orders/ecom",
    images: [
      { src: "/extracted_media/image23.png", caption: "Orders Dashboard — All Orders" },
      { src: "/extracted_media/image24.png", caption: "Orders Dashboard — Secondary View" },
      { src: "/extracted_media/image26.png", caption: "Ecom Orders — Advanced Filters Overview" },
      { src: "/extracted_media/image27.png", caption: "Ecom Orders — Order Status Filter Selection" },
      { src: "/extracted_media/image28.png", caption: "Order Status Filter - Full View" }
    ]
  },
  "21.2 Single Order Detail View & Timeline Logging": {
    description: "Designed a dense informational layout displaying logistical KPIs, item-level price breakups, payment statuses, and a chronological tracking log of all automated order events.",
    howToTest: "Click on a specific order ID to view the detailed tracking timeline.",
    testPath: "/admin/orders/detail",
    images: [
      { src: "/extracted_media/image29.png", caption: "Single Order Detail — Primary Information Panel" },
      { src: "/extracted_media/image30.png", caption: "Single Order Detail — Timelines and Logging" }
    ]
  },
  "21.3 Inventory Bagging & Weight Reconciliation Tool": {
    description: "Engineered the critical 'Attach Inventory' modal allowing admins to map actual manufactured physical weights to orders, calculating live price differences for refunds/charges.",
    howToTest: "Open an order, attach a bag number, and compare the physical weight to the digital inventory weight.",
    testPath: "/admin/orders/bagging",
    images: [
      { src: "/extracted_media/image104.png", caption: "Order Management — Inventory Bagging & Weight Reconciliation" }
    ]
  },
  "21.4 All Transactions & Payment Gateway Status": {
    description: "Built the financial ledger displaying transaction IDs, amounts, multi-country origin flags, and associated payment gateway routing.",
    howToTest: "Navigate to All Transactions and verify the Success/Initiated status badges.",
    testPath: "/admin/orders/transactions",
    images: [
      { src: "/extracted_media/image25.png", caption: "Orders Dashboard — All Transactions" }
    ]
  },
  "21.5 11+1 Monthly Gold Savings Scheme Dashboard": {
    description: "Developed a custom financial tracker for installment-based gold savings schemes, configuring tenure, grace periods, and maximum amount limits.",
    howToTest: "Navigate to Schemes and view the active Swarna Lakshmi Yojana configuration.",
    testPath: "/admin/schemes",
    images: [
      { src: "/extracted_media/image101.png", caption: "11+1 Schemes Management Dashboard" }
    ]
  },
  "21.6 Return Management (Reverse Pickup)": {
    description: "Return Management module functioning as a logistical tracker for returned customer orders, with tabbed navigation for 'Authorize Return', 'RVP Initiate', and 'In-Transit'.",
    howToTest: "Navigate to Returns and generate a Reverse Pickup.",
    testPath: "/admin/returns",
    images: [
      { src: "/extracted_media/image3.png", caption: "Reverse Pickup Management Console" }
    ]
  },

  // Phase 22
  "22.1 All Customers & User Group Policy routing": {
    description: "Built the CRM dashboard managing B2B/B2C users, featuring list segmentation (Active, Blacklisted) and geographic policy assignment.",
    howToTest: "Navigate to Customers and view the multi-column data grid.",
    testPath: "/admin/customers",
    images: [
      { src: "/extracted_media/image74.png", caption: "All Customers — Dashboard" }
    ]
  },
  "22.2 Enquiries Dashboard": {
    description: "Developed a unified inbox for Support, Cancel Requests, Appointments (Video Calls), and Help/FAQ submissions with actionable ticket resolution flows.",
    howToTest: "Navigate to Enquiries and view the active Support tab.",
    testPath: "/admin/enquiries",
    images: [
      { src: "/extracted_media/image75.png", caption: "Enquiries Dashboard — Support Tab" },
      { src: "/extracted_media/image77.png", caption: "Enquiries Dashboard — Appointment Tab" },
      { src: "/extracted_media/image78.png", caption: "Enquiries Dashboard — Cancel Requests Tab" },
      { src: "/extracted_media/image79.png", caption: "Enquiries Dashboard — Lead Tab" }
    ]
  },
  "22.3 Customer Inquiry Modal & Ticket Resolution": {
    description: "Engineered the overlay modal allowing support agents to view exact message context, attached images, and client details to resolve tickets efficiently.",
    howToTest: "Click 'View' on an enquiry row to open the detailed modal.",
    testPath: "/admin/enquiries/ticket",
    images: [
      { src: "/extracted_media/image76.png", caption: "Enquiry Detail — Modal Overlay" }
    ]
  },
  "22.4 Teams & Permission Roles Access Control": {
    description: "Built the internal HR control panel defining specific 'Permission Roles' (Operations, Accounts) mapped to granular module access levels.",
    howToTest: "Navigate to Teams -> Permission Roles and view the access configuration table.",
    testPath: "/admin/teams",
    images: [
      { src: "/extracted_media/image80.png", caption: "Permissions Roles Management Dashboard" }
    ]
  },

  // Phase 23
  "23.1 Brand Profile & Logo Asset Management": {
    description: "Designed the General Settings interface for inputting legal enterprise profiles and uploading responsive brand logos (Square, Wide, Dark Theme) via specific dropzones.",
    howToTest: "Navigate to Settings -> Brand Logos and upload a new asset.",
    testPath: "/admin/settings/brand",
    images: [
      { src: "/extracted_media/image81.png", caption: "General Settings — Brand Profile" },
      { src: "/extracted_media/image82.png", caption: "General Settings — Brand Logos" },
      { src: "/extracted_media/image97.png", caption: "General Settings — Expanded Branding Assets" },
      { src: "/extracted_media/image98.png", caption: "Store Customization — Portal Login Splash Setup" },
      { src: "/extracted_media/image99.png", caption: "Store Customization — Authentication & Mail Server Gateway" },
      { src: "/extracted_media/image100.png", caption: "Dedicated Client Login Panel" }
    ]
  },
  "23.2 Appearance & Theme Colors Configuration": {
    description: "Implemented visual configurations dictating global theme hex codes, product layout columns, pop-up events (Scroll-50%), and Announcement bars.",
    howToTest: "Navigate to Settings -> Appearance and toggle the Cart Popup switch.",
    testPath: "/admin/settings/appearance",
    images: [
      { src: "/extracted_media/image84.png", caption: "Appearance — General Configuration" },
      { src: "/extracted_media/image85.png", caption: "Appearance — Layout Configuration" },
      { src: "/extracted_media/image86.png", caption: "Appearance — Product Page Configuration" },
      { src: "/extracted_media/image87.png", caption: "Appearance — Pop-up Settings" },
      { src: "/extracted_media/image88.png", caption: "Appearance — Announcement Bar Configuration" }
    ]
  },
  "23.3 3rd Party Integrations": {
    description: "Integrated the configuration UI for routing external tools like Payment Gateways (PhonePe, Stripe), Shipping Partners (ShipRocket), and Analytics (Google Tag Manager, Facebook Pixel).",
    howToTest: "Navigate to Settings -> 3rd Party and view the Analytics tracking fields.",
    testPath: "/admin/settings/integrations",
    images: [
      { src: "/extracted_media/image89.png", caption: "Shop Settings — Checkout Configuration" },
      { src: "/extracted_media/image90.png", caption: "3rd Party — Payment Gateway Settings" },
      { src: "/extracted_media/image91.png", caption: "Payment Gateway Selection Dropdown" },
      { src: "/extracted_media/image92.png", caption: "3rd Party — Analytics Integration Settings" },
      { src: "/extracted_media/image93.png", caption: "Shipping Partners — ShipRocket Authentication" }
    ]
  },
  "23.4 Advanced Configuration (Domain DNS Setup)": {
    description: "Built the advanced SaaS multi-tenant domain mapping wizard, verifying A-records and generating XML sitemaps for the mapped domains.",
    howToTest: "Navigate to Settings -> Advanced and follow the 3-step domain setup process.",
    testPath: "/admin/settings/advanced",
    images: [
      { src: "/extracted_media/image94.png", caption: "Advanced Settings — Miscellaneous Configurations" },
      { src: "/extracted_media/image95.png", caption: "Advanced Settings — Domain Mapping Complete" },
      { src: "/extracted_media/image96.png", caption: "Store Settings — XML Sitemap Management" }
    ]
  },
  "23.5 Social Media & OG Image Routing": {
    description: "Developed the settings panel managing external social media handles, WhatsApp chat toggles, and Open Graph (OG) sharing metadata for precise off-site linking.",
    howToTest: "Navigate to Settings -> Social Media and update the OG Description.",
    testPath: "/admin/settings/social",
    images: [
      { src: "/extracted_media/image83.png", caption: "General Settings — Social Media & OG Metadata" }
    ]
  },
  "23.6 Global Currency Configuration": {
    description: "Proposed roadmap feature: A settings module allowing the Admin to define the platform's default display currency (e.g., INR, USD, EUR) and its corresponding symbol (₹, $).",
    howToTest: "Navigate to Settings -> Currency (Once Developed) and select INR.",
    testPath: "/admin/settings/currency"
  },
  
  // Phase 24
  "24.1 Executive Dashboard Analytics": {
    description: "Developed a primary executive e-commerce dashboard designed for real-time business performance monitoring with active site traffic, KPI cards, and revenue grids.",
    howToTest: "Navigate to the Home Dashboard and view the KPIs.",
    testPath: "/admin/dashboard",
    images: [
      { src: "/extracted_media/image2.png", caption: "Executive E-commerce Dashboard" }
    ]
  },
  "24.2 Global Events & Logs Panel": {
    description: "Created a global event tracking system auditing 'who made what changes'. Enables accountability for price master adjustments, exports, and inventory edits.",
    howToTest: "Open the Global Notification panel or View Logs in Categories.",
    testPath: "/admin/logs",
    images: [
      { src: "/extracted_media/image102.png", caption: "Global Notification Panel — Export Events" }
    ]
  }
};
