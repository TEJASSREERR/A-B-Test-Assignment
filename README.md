# Fridays Upsell A/B Test

A vanilla JavaScript IIFE that implements an upsell modal experience for the Join Fridays checkout page. When users click on Monthly or 3-Month plan options, a modal appears encouraging them to upgrade to a longer commitment plan with savings.

## Files

| File | Description |
|---|---|
| `fridays-upsell-ab-test.js` | Main source code — vanilla JS IIFE with SPA support |
| `IMPLEMENTATION-NOTES.md` | Implementation details, assumptions, and console API docs |

## Features

- **Automatic plan detection** — Identifies Semaglutide/Tirzepatide and Monthly/3-Month/6-Month plans from DOM
- **Upsell modal** — Shows savings comparison, benefits, and clear CTA
- **Upgrade flow** — Selects upgraded plan automatically and continues checkout
- **Decline flow** — Closes modal and continues with original plan selection
- **SPA-safe** — Handles React Router/Vue Router navigation via MutationObserver and history API interception
- **Accessible** — Focus trap, Escape key close, ARIA attributes, reduced motion support
- **Console testable** — Exposes `FridaysUpsell` API for debugging

## Console API

After injecting the script, open DevTools Console and run:

```javascript
// Show modal manually
FridaysUpsell.show('semaglutide', 'monthly')

// Scan for detected plans
FridaysUpsell.scan()

// Check state
FridaysUpsell.getState()
