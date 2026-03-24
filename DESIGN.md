# Design System: High-End Editorial Beauty

## 1. Overview & Creative North Star

**Creative North Star: The Digital Atelier**
This design system moves beyond the "e-commerce template" to create a space that feels like a high-end print magazine brought to life. It is rooted in **Soft Minimalism**—an approach that prioritizes negative space, tactile layering, and a "cool-girl" effortless aesthetic.

To achieve this, we break the traditional rigid grid. We embrace **intentional asymmetry**, where high-quality editorial photography bleeds off-canvas or overlaps with sophisticated serif typography. The goal is to make the user feel like they are flipping through a curated portfolio rather than browsing a database of products. We replace structural lines with tonal depth, creating a UI that feels "grown" rather than "built."

---

## 2. Colors & Surface Philosophy

The palette is a sophisticated dance of off-whites, warm greys, and deep charcoal, designed to let product photography be the protagonist.

### The "No-Line" Rule
**Strict Mandate:** Designers are prohibited from using 1px solid borders for sectioning. Boundaries must be defined solely through background color shifts.
*   **Example:** A `surface-container-low` (#f3f3f3) product gallery sitting on a `surface` (#f9f9f9) page background. The transition should be felt, not seen as a line.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers—like stacked sheets of fine vellum.
*   **Base:** `surface` (#f9f9f9) for the primary page area.
*   **In-Page Sections:** Use `surface-container-low` (#f3f3f3) to group related content.
*   **Elevated Components:** Use `surface-container-lowest` (#ffffff) for cards or modals to create a "lifted" feel against the creamier backgrounds.

### Glass & Gradient (The "Atmospheric" Rule)
To avoid a flat, "out-of-the-box" look, use Glassmorphism for floating elements (like Navigation Bars or Quick-Add drawers).
*   **Spec:** Apply `surface` color at 70% opacity with a `backdrop-filter: blur(20px)`.
*   **Signature Textures:** For primary CTAs, use a subtle linear gradient from `primary` (#1b1b1b) to `primary-container` (#303030) at a 45-degree angle. This adds "visual soul" and a slight metallic sheen that flat black cannot provide.

---

## 3. Typography

The typographic pairing is the heartbeat of the "cool-girl" aesthetic: a sophisticated, high-contrast Serif (Noto Serif) paired with a pragmatic, modern Sans-Serif (Inter).

*   **Display & Headline (Noto Serif):** These are your "Editorial Voice." Use `display-lg` (3.5rem) with tighter letter-spacing (-0.02em) for hero moments. This conveys authority and premium heritage.
*   **Body & Labels (Inter):** This is your "Utility Voice." Inter provides a clean, neutral counterpoint to the serif’s drama. 
*   **Hierarchy Note:** Use `title-md` (Inter) for functional UI elements like navigation or form labels to maintain clarity, while using `headline-sm` (Noto Serif) for storytelling elements.

---

## 4. Elevation & Depth

We eschew traditional "material" shadows in favor of **Tonal Layering**.

*   **The Layering Principle:** Depth is achieved by stacking. Place a `surface-container-lowest` (#ffffff) card on a `surface-container-low` (#f3f3f3) background. The delta in hex value creates a soft, natural lift.
*   **Ambient Shadows:** If a floating effect is required (e.g., a hover state), use an ultra-diffused shadow: `box-shadow: 0 20px 40px rgba(26, 28, 28, 0.05)`. The shadow must be a tinted version of `on-surface`, never a neutral grey.
*   **The "Ghost Border" Fallback:** If accessibility requires a container boundary, use the `outline-variant` token at 15% opacity. It should be barely perceptible.

---

## 5. Components

### Buttons
*   **Primary:** Solid `primary` (#1b1b1b) with `on-primary` (#ffffff) text. Use `md` (0.375rem) roundedness. No icons unless essential.
*   **Secondary:** Ghost style. No border. Use `surface-container-high` (#e8e8e8) on hover.
*   **Tertiary:** Underlined `label-md` text. The underline should be 1px and offset by 4px.

### Input Fields
*   **Styling:** Forbid 4-sided boxes. Use a bottom-only border (1px) using `outline-variant`. 
*   **Focus State:** The border transitions to `primary` (#1b1b1b) with a subtle `surface-container-highest` background fill.

### Cards & Lists
*   **No Dividers:** Forbid the use of horizontal rules. Separate list items using the spacing scale (e.g., `spacing-4` or `spacing-6`).
*   **Imagery:** Cards should have a `0.25rem` (default) corner radius—just enough to soften the edge without losing the editorial sharpness.

### Editorial Overlays (New Component)
*   **Usage:** For high-end product launches.
*   **Spec:** A `display-sm` Serif title partially overlapping a `surface-container-highest` image container. This "broken grid" look is essential for the premium feel.

---

## 6. Do’s and Don’ts

### Do
*   **Do use asymmetric margins.** Shift a text block 10% to the right of its center-line to create visual interest.
*   **Do use generous white space.** If a section feels crowded, double the spacing value (e.g., move from `spacing-10` to `spacing-20`).
*   **Do prioritize photography.** Every page should feel like it was art-directed for a magazine.

### Don’t
*   **Don’t use "Pure Black" (#000000).** Always use `primary` (#1b1b1b) or `on-background` (#1a1c1c) for a softer, more expensive look.
*   **Don’t use 1px borders to separate content.** Use color blocks or whitespace.
*   **Don’t use harsh transitions.** Interaction states (hover, focus) should have a minimum `300ms` ease-in-out duration.