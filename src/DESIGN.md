---
name: Agro-Industrial Precision
colors:
  surface: '#f8f9fa'
  surface-dim: '#d9dadb'
  surface-bright: '#f8f9fa'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f4f5'
  surface-container: '#edeeef'
  surface-container-high: '#e7e8e9'
  surface-container-highest: '#e1e3e4'
  on-surface: '#191c1d'
  on-surface-variant: '#414844'
  inverse-surface: '#2e3132'
  inverse-on-surface: '#f0f1f2'
  outline: '#717973'
  outline-variant: '#c1c8c2'
  surface-tint: '#3f6653'
  primary: '#012d1d'
  on-primary: '#ffffff'
  primary-container: '#1b4332'
  on-primary-container: '#86af99'
  inverse-primary: '#a5d0b9'
  secondary: '#a14000'
  on-secondary: '#ffffff'
  secondary-container: '#fe7a34'
  on-secondary-container: '#622400'
  tertiary: '#00264b'
  on-tertiary: '#ffffff'
  tertiary-container: '#003c70'
  on-tertiary-container: '#63a8ff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#c1ecd4'
  primary-fixed-dim: '#a5d0b9'
  on-primary-fixed: '#002114'
  on-primary-fixed-variant: '#274e3d'
  secondary-fixed: '#ffdbcc'
  secondary-fixed-dim: '#ffb694'
  on-secondary-fixed: '#351000'
  on-secondary-fixed-variant: '#7b2f00'
  tertiary-fixed: '#d4e3ff'
  tertiary-fixed-dim: '#a4c9ff'
  on-tertiary-fixed: '#001c39'
  on-tertiary-fixed-variant: '#004884'
  background: '#f8f9fa'
  on-background: '#191c1d'
  surface-variant: '#e1e3e4'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '800'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.02em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 48px
  max-width: 1440px
---

## Brand & Style
The design system is engineered for an agriculture equipment and irrigation brand, prioritizing reliability, high performance, and industrial durability. The brand personality is "The Modern Foreman"—expert, capable, and technologically advanced. It moves away from traditional "dusty" agriculture toward a high-tech, precision-farming aesthetic.

The design style is **Corporate / Modern** with a focus on high-performance utility. It utilizes a structured grid, clear information hierarchy, and professional imagery to evoke trust. The interface should feel as robust as the machinery it represents, balancing "heavy-duty" industrial cues with the "lightweight" efficiency of modern SaaS software.

## Colors
This design system utilizes a palette rooted in the physical environment of industrial farming:
- **Primary (Deep Agricultural Green):** Used for brand identity, primary actions, and success states. It represents growth and healthy yields.
- **Secondary (Safety Orange):** Used for high-visibility warnings, industrial machinery status, and critical secondary actions. It communicates durability and mechanical power.
- **Tertiary (Sky Blue):** Specifically reserved for irrigation-related data, water levels, and fluid management systems.
- **Backgrounds:** A hierarchy of `Off-White (#F8F9FA)` and `Light Grey (#E9ECEF)` ensures the UI feels clean and airy, preventing the "heavy" colors from becoming overwhelming.

## Typography
The system uses **Inter** exclusively to maintain a systematic, utilitarian appearance across all touchpoints. 
- **Headlines:** Use heavy weights (Bold/ExtraBold) to convey strength and authority. Negative letter-spacing is applied to larger sizes to maintain a compact, "machined" look.
- **Body:** Standardized at 16px for optimal legibility in field conditions. 
- **Labels:** Used for data points (e.g., PSI, flow rate, hectares). These are semi-bold to ensure they are readable at a glance on tablets or mobile devices used outdoors.

## Layout & Spacing
The layout follows a **Fluid Grid** model based on an 8px base unit to ensure alignment with industrial design standards. 
- **Desktop:** 12-column grid with a max-width of 1440px. 24px gutters provide breathing room for complex data tables.
- **Mobile:** 4-column grid with 16px side margins.
- **Rhythm:** Vertical spacing between sections should be generous (64px+) to maintain a "premium" feel, while spacing between functional elements (input/label) should be tight (8px) to signify relationship and efficiency.

## Elevation & Depth
To achieve a "premium software" look within an industrial context, the design system uses **Tonal Layers** combined with **Ambient Shadows**.
- **Surfaces:** Use subtle shifts in grey (from #F8F9FA to #FFFFFF) to create hierarchy.
- **Shadows:** Use large-radius, low-opacity shadows (e.g., `box-shadow: 0 10px 25px rgba(27, 67, 50, 0.08)`) to lift cards off the background. The shadow should have a slight green tint to tie into the primary brand color.
- **Depth:** Higher elevation is reserved for active state modals and primary call-to-action buttons, creating a tactile "physical button" feel without being fully skeuomorphic.

## Shapes
The shape language balances industrial rigidity with modern ergonomics. A **Rounded (0.5rem / 8px - 12px)** approach is used for standard components, while `rounded-xl (1.5rem / 24px)` is used for large container cards. This softening of the "industrial" edges makes the software feel more accessible and user-friendly, contrasting with the hard steel of the physical machinery.

## Components
- **Buttons:** Primary buttons use the Deep Agricultural Green with white text and 12px corner radius. Secondary buttons use a thick 2px border in green or orange.
- **Chips/Status Indicators:** Use "Safety Orange" for mechanical warnings and "Sky Blue" for irrigation status (e.g., "Active Flow"). These should have 100px (pill) roundedness for high distinctiveness.
- **Cards:** Cards feature a white background, 16px corner radius, and the ambient green-tinted shadow. They should include a 4px left-border accent color (Green for status, Blue for water data) to categorize information.
- **Input Fields:** High-contrast fields with 1px `Grey-300` borders that thicken and turn `Primary Green` on focus.
- **Lists/Data Tables:** Use alternate row striping in `Grey-50` and ensure high vertical padding (16px) for touch-target safety in outdoor environments.
- **Telemetry Gauges:** Custom components specifically for irrigation pressure and fuel levels, using circular progress strokes in Tertiary Blue and Secondary Orange respectively.