# B2B Portal Roadmap & Feature Log

This document tracks major features, architectural updates, and tasks completed in the B2B portal. Use this as a reference when writing user manuals or tracking project progress.

## Currently In Progress

### 11+1 Customer Schemes Module (Partial Completion)
**Status**: In Progress
**Description**: Implemented the foundational database architecture, basic Admin scheme creation, Customer Scheme Dashboard (`/dashboard/schemes`), and Admin Analytics tracking for early withdrawal requests. 
**Key Capabilities Built So Far**:
- Custom mathematical calculator mapping tenure lengths and dynamic bonus percentages.
- Interactive chronological payment timeline for customers.
- Early withdrawal workflows with dynamic account freezing and admin-side real-time red-dot notifications.
- Admin Analytics single-page view containing KPIs and individual customer status ledger.
**Pending**: Finalizing logic adjustments, additional edge cases, robust testing, and full integration as per client feedback.

## Recently Completed Features

### 1. 100% Offline AI-Free "Auto Magic" Image Sorting
**Status**: Completed
**Last Modified**: 22 July 2026
**Description**: Replaced external API AI sorting with a fully offline, high-speed mathematical HTML5 Canvas geometry scanner.
**Key Capabilities for User Manual**:
- **Instant Parallel Processing**: Scans 12+ images simultaneously in milliseconds without API latency or rate limits.
- **Deterministic Sequencing**: Uses pixel-density and aspect-ratio analysis to guarantee a flawless sequence (Perspective -> Front -> Photoshoot -> Lifestyle -> Side -> Infographic).
- **Auto Primary Assignment**: Dynamically assigns the master variant's first image (Yellow Gold / Perspective) as the primary thumbnail across the portal automatically on upload.

### 2. Secure Media Proxy & WebP Image Optimization
**Status**: Completed
**Description**: Implemented a dynamic image proxy to securely serve product images and optimize them on-the-fly for faster loading.
**Key Capabilities for User Manual**:
- **Image Configurations Tab**: A new section in the Admin Settings (`/dashboard/settings`) where admins can toggle system behaviors.
- **Require Secure Media Proxy**: When enabled, images are served securely through an authenticated API proxy, preventing unauthorized direct access.
- **On-the-fly WebP Optimization**: When enabled, the system intercepts heavy high-resolution `.jpg` images and converts them to `.webp` format in server memory before sending them to the browser. This dramatically speeds up page loading.
- **Smart Downloading**: When a user right-clicks to "Save Image As...", the system forces the browser to save it using the exact original SKU file name (e.g., `NP0068_1`) and matches the extension (`.webp` or `.jpg`) depending on the optimization setting.
- **Public Fallback Support**: Even if the secure proxy is disabled, turning on WebP optimization will still magically optimize the public URLs to ensure lightning-fast image delivery.

### 2. Phase 18.1: Single Product Editable Timeline (UI/UX)
**Status**: Completed
**Last Modified**: 21 July 2026, 01:28 AM (IST)
**Description**: Designed a multi-step timeline workflow for editing individual products, integrating a rich-text WYSIWYG editor, status toggles, advanced tags management, and a bespoke 12-hour modern calendar UI.
**Key Capabilities for User Manual**:
- **Bespoke Calendar Component**: A custom React-based 12-hour AM/PM scheduler that strictly enforces chronological integrity and inherits global UI CSS variables.
- **Smart Tagging Input**: A highly responsive tag-pill input field mapping directly to the SEO/search engine recommendations list.
- **Automated Draft Transitions**: Intelligent scheduling features that automatically restrict live publication for future-scheduled SKUs.
- **Micro-Interaction UI/UX**: Fluid Framer Motion animations across active states, glassmorphism modal dialogs, and 'Ambient Occlusion' shadowing.

### 3. Phase 2: Orders Module Enhancements
**Status**: Completed
**Description**: Built and integrated comprehensive views for managing all e-commerce, store-fulfilled, and B2B Purchase Orders, standardizing layouts with sticky paginations and full-page bento grids.
**Key Capabilities for User Manual**:
- **Master PO Ledger (All POs)**: A robust wholesale purchase order interface featuring real-time, multi-parameter filtering (Client, Amount Thresholds, Date) and dynamic sorting.
- **Store & E-Com Order Splits**: Dedicated pages for tracking branch-fulfilled store orders versus online retail orders, complete with unified action menus.
- **Unified Action Architecture**: Implemented a globally consistent `OrderActionMenu` across all tables, ensuring secure, one-click access to download invoices or view transaction summaries.
- **Payment Link Conditioning**: Order Summary dashboards now dynamically display 'Send Payment Link' functionalities based exclusively on active 'Processing' states.

### 4. Phase 21.2: Single Order Detail View & Timelines
**Status**: Completed
**Description**: Implemented the detailed internal functionality for the Single Order Detail View (`/admin/orders/[id]`).
**Key Capabilities for User Manual**:
- **Dynamic Context**: Parses the exact order ID from the URL and maps it to the primary interface dynamically.
- **Interactive Notes System**: The sidebar includes a fully functional, smooth-animated Notes posting system that tracks real-time inputs natively.
- **Payment Lifecycle Filtering**: Connected the primary order ledger to 'All Transactions', 'Markets', and 'Paid' tabs for instant client-side ledger filtering.
- **Simulated Transaction Injections**: Wired the 'Add Transaction' module to simulate injecting new randomized transaction receipts seamlessly with success state updates.

### 5. [Add Previous Major Tasks Here]
- *System foundation setup*
- *Authentication and Role-Based Access Control*
- *Inventory & Catalog APIs*

## Pending / Upcoming Features
- Real-time Matrix Pricing integration (planned override in storefront)
- (Add future goals here)

## QC & Diagnostic Checkpoints
To ensure feature stability prior to production releases, the following checkpoints must be validated:

### 1. Image Sorting Diagnostics
- **[ ] File Type Independence**: Uploading .png, .jpg, and .webp formats should trigger the same deterministic sorting.
- **[ ] Color Recognition**: Verify that #FFD700 (Yellow), #B76E79 (Rose), and #E5E4E2 (White) pixels correctly map to their respective metal groups.
- **[ ] Missing Image Handling**: The system gracefully handles missing perspective/front shots and falls back to side/lifestyle shots according to `viewOrder`.

### 2. General Portal QC
- **[ ] API Resilience**: Disconnect internet and verify that Canvas pixel processing still functions locally.
- **[ ] Global UI Compliance**: Validate that all new CTA pills use `shimmer-hover` and `var(--brand-primary)` without native `<select>` dropdowns.
