# B2B Portal Roadmap & Feature Log

This document tracks major features, architectural updates, and tasks completed in the B2B portal. Use this as a reference when writing user manuals or tracking project progress.

## Recently Completed Features

### 1. Secure Media Proxy & WebP Image Optimization
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

### 3. [Add Previous Major Tasks Here]
- *System foundation setup*
- *Authentication and Role-Based Access Control*
- *Inventory & Catalog APIs*

## Pending / Upcoming Features
- Real-time Matrix Pricing integration (planned override in storefront)
- (Add future goals here)
