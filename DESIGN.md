# Design Tokens & UI Architecture (Jewelment B2B)

## 1. Aesthetic Guidelines
- **Theme:** High-End Luxury B2B Platform
- **Visual Style:** Liquid Glass Aesthetics, Bento Grid modular layouts, Strategic Minimalism, Thoughtful Whitespace.

## 2. Core Color Tokens
- `var(--brand-primary)`: Primary accent color (Champagne Gold / Metallic). Used for active states, borders on hover, and primary CTAs.
- `var(--brand-text)`: Text color overlay for primary brand backgrounds (typically black/dark for contrast on gold).
- `var(--bg-base)`: Main application background (Deep dark or elegant light depending on theme).
- `var(--bg-surface)`: Card and widget background. Should implement "Glassmorphism".
- `var(--border-color)`: Extremely subtle, 1px micro-borders.
- `var(--text-main)`: High contrast primary text.
- `var(--text-muted)`: Low contrast, secondary text.

## 3. Surface & Depth Styling
- **Glassmorphism:** Use `rgba(255, 255, 255, 0.45)` with `backdrop-filter: blur(12px)`.
- **Shadows (Ambient Occlusion):** Avoid harsh drop shadows. Use layered, highly diffused blurs (e.g., `box-shadow: 0 4px 30px rgba(0, 0, 0, 0.03)`).
- **Texture:** Consider 1-2% Monochromatic Noise Overlays on dark backgrounds.

## 4. Micro-Interactions & Motions
- **Easing:** `cubic-bezier(0.16, 1, 0.3, 1)` for heavy, premium friction.
- **Hover Effects:** "Proportional Scale and Lift" (scale up 1.02x) combined with `shimmer-hover` effects on buttons.
- **Active States:** Chameleon Border Accent or Underline Expansion. Avoid hard toggles; use staggered fade-and-cascade.

## 5. Standardized CTA Buttons
1.  **Primary (Golden Shine):** 
    `bg-[var(--brand-primary)] text-[var(--brand-text)] border-[var(--brand-primary)] hover:opacity-90 shadow-md shimmer-hover rounded-full text-xs font-bold uppercase`
2.  **Secondary (Dark & Gold):** 
    `bg-[var(--bg-surface)] text-[var(--text-main)] border-[var(--border-color)] hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)] shadow-sm shimmer-hover rounded-full text-xs font-bold uppercase`
3.  **Tertiary (Ghost):** 
    `bg-transparent text-[var(--text-muted)] border-transparent hover:border-[var(--border-color)] hover:text-[var(--text-main)] hover:bg-black/5 rounded-full text-xs font-bold uppercase`

## 6. Components
- **Dropdowns:** Custom `div`/`ul` components only. No native `<select>`. Golden left-border accents on hover.
- **Data Tables:** Must include 'Select All' master checkboxes and native row checkboxes.
- **SDUI Widgets:** Marketing blocks and banners must be managed headlessly via `divkitCompiler.ts` rather than hardcoded.
