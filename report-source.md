# Mobile Portal UX Research and Implementation

Audience: KJCOEMR Connect project team  
Date: 2026-09-04  
Scope: Mobile Admin and Alumni portal experience at 320–850px widths.

## Direct answer

The Admin and Alumni mobile portals now use a compact sticky portal header, horizontally scrollable primary navigation, touch-sized controls, stacked content forms, and intentionally scrollable data tables. The goal is to keep the main task visible while avoiding forced two-dimensional scrolling for ordinary content.

## Evidence and design decisions

- W3C WCAG 2.1 requires content to reflow at a 320 CSS-pixel viewport without loss of information or functionality; data tables are an accepted exception where two-dimensional layout is necessary. This informed stacked forms/cards and horizontal scrolling only for management tables. [WCAG 2.1 Reflow](https://www.w3.org/TR/WCAG21/)
- Apple recommends 44×44 pt touch controls and sufficient spacing. Navigation, sidebar controls, mobile action buttons, and theme controls were adjusted to at least this practical touch size. [Apple Accessibility HIG](https://developer.apple.com/design/human-interface-guidelines/accessibility)
- Apple’s interface guidance recommends keeping controls near the content they modify and aligning related information. Dashboard cards, mobile headers, and action rows were condensed and aligned accordingly. [Apple UI Design Tips](https://developer.apple.com/design/tips/)

## Implemented changes

- Sticky compact Admin/Alumni portal header on tablets and phones.
- Horizontally scrollable primary navigation rather than a squeezed multi-row sidebar.
- Two-column statistics/quick actions on tablet, with single-column readable cards on narrow phones.
- Mobile-friendly profile summary, event, announcement, and dashboard cards.
- One-column forms and full-width actions at phone widths.
- Responsive Event/History tabs.
- Scrollable management tables retained as a deliberate data-table exception.

## Verification

Production Vite build completed successfully after implementation.
