# Fridays Upsell A/B Test — Implementation Notes

## How the Popup is Triggered

The upsell modal intercepts user clicks on plan cards using event delegation in capture phase on `document.body`. This ensures the interceptor fires before the SPA's own click handlers.

1. **Detection**: `detectPlanType()` and `detectMedicationType()` analyze the clicked element's text content, data attributes (`data-plan`, `data-plan-id`), and parent context to identify which plan was clicked.
2. **Validation**: `getUpsellConfig()` checks if the clicked plan has a configured upsell (e.g., Monthly → 3-Month). Plans without upsells like 6-Month pass through normally.
3. **Interception**: `e.preventDefault()`, `e.stopPropagation()`, and `e.stopImmediatePropagation()` prevent the default plan selection behavior.
4. **Display**: `showModal()` injects the modal CSS (if not already present), builds the modal DOM, and appends it to the body with a fade-in animation.

## How Plan Selection is Handled

### Upgrade Flow
When the user clicks "Upgrade & Save":
1. `handleUpgrade()` retrieves the upgrade target from `CONFIG.upsellMap`
2. `findPlanElement()` locates the DOM element for the upgraded plan
3. `selectPlanElement()` triggers plan selection using multiple strategies:
   - Native `click()` on the plan's button
   - Synthetic `MouseEvent` and `TouchEvent` for React/Vue compatibility
   - Radio button `checked` + `change` event dispatch
   - Form submission trigger detection
   - "Continue/Next" button auto-click
4. A custom `fridays-plan-selected` event is dispatched for external listeners

### Decline Flow
When the user clicks "No thanks", the X button, presses Escape, or clicks outside:
1. `handleDecline()` closes the modal with fade-out animation
2. The originally clicked plan element is re-selected via `selectPlanElement()` to maintain the expected checkout flow

## SPA Navigation Handling

- **MutationObserver** watches for DOM changes so event delegation continues working after route changes
- **`history.pushState`/`replaceState` interception** detects React Router/Vue Router navigation
- **`popstate` and `hashchange` listeners** handle back/forward navigation
- On any navigation, the modal auto-closes and state resets to prevent stale data

## Assumptions Made

1. **DOM Structure**: Plan cards use selectors like `.plan-card`, `[data-plan-id]`, or `[data-plan]`. If the real site uses different class names, `triggerSelectors` should be updated.
2. **Pricing**: Real Join Fridays pricing (Semaglutide: $249/$198.66/$175, Tirzepatide: $359/$298.66/$275) was sourced from their public site and may need updating.
3. **SPA Framework**: The code assumes a standard React/Vue/Angular SPA using the History API. Custom routing solutions may need additional handlers.
4. **Analytics**: Tracking stubs are included (console logs + GA4/Analytics.js hooks). Replace with actual analytics implementation.
5. **State Management**: The site is expected to update its UI when plan elements are clicked or when the `fridays-plan-selected` custom event fires.

## Console Testing API

For testing, the following API is exposed on `window.FridaysUpsell`:
- `.show(medicationType, planType)` — manually trigger modal
- `.hide()` — close modal
- `.scan()` — list all detected plan elements
- `.selectPlan(medicationType, planType)` — manually select a plan
- `.getState()` — check current internal state
- `.reinit()` — re-initialize after DOM changes