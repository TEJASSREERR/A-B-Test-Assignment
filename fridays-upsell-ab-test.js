/**
 * FRIDAYS Upsell A/B Test
 * Vanilla JS IIFE — SPA-safe, accessible, testable via console
 * File: fridays-upsell-ab-test.js
 */

(function() {
    'use strict';

    // ═════════════════════════════════════════════════════════════════
    // SECTION 1: CONFIGURATION
    // ═════════════════════════════════════════════════════════════════

    const CONFIG = {
        // ── Real Join Fridays Pricing (Semaglutide) ──────────────────
        semaglutide: {
            monthly: {
                id: 'semaglutide-monthly',
                name: 'Semaglutide — Monthly',
                priceMonthly: 249,
                priceTotal: 249,
                displayPrice: '$249/mo',
                triggerKeywords: ['semaglutide', 'monthly', '$249']
            },
            threeMonth: {
                id: 'semaglutide-3month',
                name: 'Semaglutide — 3 Months',
                priceMonthly: 198.66,
                priceTotal: 596,
                displayPrice: '$198.66/mo',
                triggerKeywords: ['semaglutide', '3 month', 'three month', '$596', '$198']
            },
            sixMonth: {
                id: 'semaglutide-6month',
                name: 'Semaglutide — 6 Months',
                priceMonthly: 175,
                priceTotal: 1050,
                displayPrice: '$175/mo',
                triggerKeywords: ['semaglutide', '6 month', 'six month', '$1,050', '$1050', '$175']
            }
        },

        // ── Real Join Fridays Pricing (Tirzepatide) ──────────────────
        tirzepatide: {
            monthly: {
                id: 'tirzepatide-monthly',
                name: 'Tirzepatide — Monthly',
                priceMonthly: 359,
                priceTotal: 359,
                displayPrice: '$359/mo',
                triggerKeywords: ['tirzepatide', 'monthly', '$359']
            },
            threeMonth: {
                id: 'tirzepatide-3month',
                name: 'Tirzepatide — 3 Months',
                priceMonthly: 298.66,
                priceTotal: 896,
                displayPrice: '$298.66/mo',
                triggerKeywords: ['tirzepatide', '3 month', 'three month', '$896', '$298']
            },
            sixMonth: {
                id: 'tirzepatide-6month',
                name: 'Tirzepatide — 6 Months',
                priceMonthly: 275,
                priceTotal: 1650,
                displayPrice: '$275/mo',
                triggerKeywords: ['tirzepatide', '6 month', 'six month', '$1,650', '$1650', '$275']
            }
        },

        // ── Upsell Mapping ───────────────────────────────────────────
        upsellMap: {
            semaglutide: {
                monthly: {
                    upgradeTo: 'threeMonth',
                    headline: 'Save $151 with a 3-Month Commitment',
                    subheadline: 'Same semaglutide medication, same clinical care — just $50 less per month.',
                    savingsBadge: 'SAVE $151',
                    totalSavings: '$151',
                    benefits: [
                        'Semaglutide medication (GLP-1)',
                        'Unlimited provider visits',
                        '1-on-1 registered dietitian',
                        'Cancel or pause anytime'
                    ],
                    ctaText: 'Upgrade & Save $151',
                    declineText: 'No thanks, keep Monthly at $249/mo'
                },
                threeMonth: {
                    upgradeTo: 'sixMonth',
                    headline: 'Lock in Our Best Semaglutide Price!',
                    subheadline: 'Go all-in for 6 months and save $142 more than the 3-month plan.',
                    savingsBadge: 'SAVE $426 TOTAL',
                    totalSavings: '$426',
                    benefits: [
                        'Everything in the 3-month plan',
                        'Lowest per-month price ($175/mo)',
                        'Priority scheduling',
                        'Exclusive wellness content library'
                    ],
                    ctaText: 'Upgrade to Best Value — $175/mo',
                    declineText: 'Keep my 3-month plan at $198.66/mo'
                }
            },
            tirzepatide: {
                monthly: {
                    upgradeTo: 'threeMonth',
                    headline: 'Save $181 with a 3-Month Tirzepatide Plan',
                    subheadline: 'Tirzepatide is our most effective option — commit to 3 months and save big.',
                    savingsBadge: 'SAVE $181',
                    totalSavings: '$181',
                    benefits: [
                        'Tirzepatide medication (dual GIP/GLP-1)',
                        'Unlimited provider visits',
                        '1-on-1 registered dietitian',
                        'Cancel or pause anytime'
                    ],
                    ctaText: 'Upgrade & Save $181',
                    declineText: 'No thanks, keep Monthly at $359/mo'
                },
                threeMonth: {
                    upgradeTo: 'sixMonth',
                    headline: 'Get Tirzepatide for Just $275/mo!',
                    subheadline: 'Our best-value plan. Save $498 compared to paying monthly.',
                    savingsBadge: 'SAVE $498 TOTAL',
                    totalSavings: '$498',
                    benefits: [
                        'Everything in the 3-month plan',
                        'Lowest tirzepatide price available',
                        'Priority scheduling',
                        'Exclusive wellness content library'
                    ],
                    ctaText: 'Upgrade to Best Value — $275/mo',
                    declineText: 'Keep my 3-month plan at $298.66/mo'
                }
            }
        },

        // ── DOM Selectors ──────────────────────────────────────────
        triggerSelectors: [
            '[data-testid*="plan"]',
            '[data-testid*="Plan"]',
            '[data-plan-id]',
            '[data-plan]',
            '[class*="PlanCard"]',
            '[class*="plan-card"]',
            '[class*="pricing-card"]',
            '[class*="subscription-option"]',
            '.plan-card',
            '.pricing-card',
            '.plan-option',
            'button[class*="plan"]',
            'div[class*="plan"]',
            'div[class*="pricing"]',
            'label[class*="plan"]'
        ],

        // ── Animation ──────────────────────────────────────────────
        animation: {
            fadeIn: 300,
            fadeOut: 200
        },

        // ── Tracking (stub — replace with actual analytics) ─────────
        tracking: {
            enabled: true,
            track: function(event, data) {
                if (window.analytics && window.analytics.track) {
                    window.analytics.track('Upsell ' + event, data);
                }
                if (window.gtag) {
                    window.gtag('event', 'upsell_' + event.toLowerCase().replace(/\s+/g, '_'), {
                        event_category: 'upsell',
                        event_label: data.planType || 'unknown',
                        value: data.savings || 0
                    });
                }
                console.log('[FridaysUpsell] Track:', event, data);
            }
        }
    };

    // ═════════════════════════════════════════════════════════════════
    // SECTION 2: STATE
    // ═════════════════════════════════════════════════════════════════

    let isInitialized = false;
    let modalElement = null;
    let currentTriggerElement = null;
    let originalPlanData = null;
    let observer = null;
    let previouslyFocusedElement = null;

    // ═════════════════════════════════════════════════════════════════
    // SECTION 3: UTILITIES
    // ═════════════════════════════════════════════════════════════════

    function debounce(fn, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => fn.apply(this, args), wait);
        };
    }

    function createElement(tag, className, innerHTML, attrs) {
        const el = document.createElement(tag);
        if (className) el.className = className;
        if (innerHTML !== undefined && innerHTML !== null) el.innerHTML = innerHTML;
        if (attrs) {
            Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
        }
        return el;
    }

    function prefersReducedMotion() {
        return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    function formatCurrency(num) {
        return '$' + num.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
    }

    // ═════════════════════════════════════════════════════════════════
    // SECTION 4: STYLES (injected once)
    // ═════════════════════════════════════════════════════════════════

    function injectStyles() {
        if (document.getElementById('fridays-upsell-styles')) return;

        const reducedMotion = prefersReducedMotion();
        const transition = reducedMotion ? 'none' : `opacity ${CONFIG.animation.fadeIn}ms ease`;
        const transformIn = reducedMotion ? 'none' : `transform ${CONFIG.animation.fadeIn}ms cubic-bezier(0.16, 1, 0.3, 1)`;

        const styles = `
            #fridays-upsell-overlay {
                position: fixed;
                inset: 0;
                background: rgba(0, 0, 0, 0.6);
                backdrop-filter: blur(4px);
                -webkit-backdrop-filter: blur(4px);
                z-index: 99999;
                display: flex;
                align-items: center;
                justify-content: center;
                opacity: 0;
                transition: ${transition};
                padding: 16px;
            }
            #fridays-upsell-overlay.active {
                opacity: 1;
            }
            #fridays-upsell-overlay.closing {
                opacity: 0;
            }
            .fridays-upsell-modal {
                background: #ffffff;
                border-radius: 20px;
                width: 100%;
                max-width: 480px;
                max-height: 85vh;
                overflow-y: auto;
                position: relative;
                transform: translateY(20px) scale(0.96);
                transition: ${transformIn};
                box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
            }
            #fridays-upsell-overlay.active .fridays-upsell-modal {
                transform: translateY(0) scale(1);
            }
            .fridays-upsell-close {
                position: absolute;
                top: 12px;
                right: 12px;
                width: 32px;
                height: 32px;
                border-radius: 50%;
                border: none;
                background: #f3f4f6;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 18px;
                color: #6b7280;
                transition: all 0.2s ease;
                z-index: 10;
            }
            .fridays-upsell-close:hover,
            .fridays-upsell-close:focus {
                background: #e5e7eb;
                color: #111827;
                outline: 2px solid #10b981;
                outline-offset: 2px;
            }
            .fridays-upsell-header {
                padding: 24px 24px 0;
                text-align: center;
            }
            .fridays-upsell-badge {
                display: inline-flex;
                align-items: center;
                gap: 6px;
                background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                color: white;
                font-size: 11px;
                font-weight: 700;
                letter-spacing: 0.05em;
                text-transform: uppercase;
                padding: 5px 12px;
                border-radius: 100px;
                margin-bottom: 12px;
            }
            .fridays-upsell-headline {
                font-size: 20px;
                font-weight: 800;
                color: #111827;
                line-height: 1.2;
                margin: 0 0 6px;
            }
            .fridays-upsell-subheadline {
                font-size: 13px;
                color: #6b7280;
                line-height: 1.4;
                margin: 0;
            }
            .fridays-upsell-body {
                padding: 16px 24px 24px;
            }
            .fridays-upsell-comparison {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 10px;
                margin-bottom: 16px;
                position: relative;
            }
            .fridays-upsell-plan {
                border: 2px solid #e5e7eb;
                border-radius: 14px;
                padding: 14px 10px;
                text-align: center;
                position: relative;
            }
            .fridays-upsell-plan.current {
                border-color: #e5e7eb;
                background: #f9fafb;
            }
            .fridays-upsell-plan.upgrade {
                border-color: #10b981;
                background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
            }
            .fridays-upsell-plan-label {
                font-size: 10px;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 0.08em;
                color: #9ca3af;
                margin-bottom: 6px;
            }
            .fridays-upsell-plan-name {
                font-size: 13px;
                font-weight: 700;
                color: #111827;
                margin-bottom: 2px;
            }
            .fridays-upsell-plan-price {
                font-size: 22px;
                font-weight: 800;
                color: #111827;
            }
            .fridays-upsell-plan-price span {
                font-size: 12px;
                font-weight: 500;
                color: #6b7280;
            }
            .fridays-upsell-vs {
                position: absolute;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);
                background: #ffffff;
                border: 2px solid #e5e7eb;
                width: 30px;
                height: 30px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 10px;
                font-weight: 700;
                color: #6b7280;
                z-index: 2;
            }
            .fridays-upsell-benefits {
                margin-bottom: 16px;
            }
            .fridays-upsell-benefits-title {
                font-size: 11px;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 0.05em;
                color: #374151;
                margin-bottom: 8px;
            }
            .fridays-upsell-benefit {
                display: flex;
                align-items: flex-start;
                gap: 8px;
                padding: 5px 0;
                font-size: 13px;
                color: #374151;
            }
            .fridays-upsell-benefit-icon {
                width: 18px;
                height: 18px;
                min-width: 18px;
                border-radius: 50%;
                background: #d1fae5;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #059669;
                font-size: 10px;
                flex-shrink: 0;
                margin-top: 1px;
            }
            .fridays-upsell-savings-bar {
                background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
                border: 1px solid #fbbf24;
                border-radius: 10px;
                padding: 10px 14px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 14px;
                gap: 10px;
            }
            .fridays-upsell-savings-text {
                font-size: 12px;
                font-weight: 600;
                color: #92400e;
            }
            .fridays-upsell-savings-amount {
                font-size: 18px;
                font-weight: 800;
                color: #b45309;
                white-space: nowrap;
            }
            .fridays-upsell-actions {
                display: flex;
                flex-direction: column;
                gap: 8px;
            }
            .fridays-upsell-cta {
                width: 100%;
                padding: 12px 20px;
                border-radius: 10px;
                border: none;
                background: linear-gradient(135deg, #111827 0%, #374151 100%);
                color: #ffffff;
                font-size: 14px;
                font-weight: 700;
                cursor: pointer;
                transition: all 0.2s ease;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 6px;
            }
            .fridays-upsell-cta:hover,
            .fridays-upsell-cta:focus {
                transform: translateY(-1px);
                box-shadow: 0 8px 20px -5px rgba(17, 24, 39, 0.3);
                outline: 2px solid #10b981;
                outline-offset: 2px;
            }
            .fridays-upsell-cta:active {
                transform: translateY(0);
            }
            .fridays-upsell-decline {
                width: 100%;
                padding: 10px 20px;
                border-radius: 10px;
                border: 1px solid #e5e7eb;
                background: #f9fafb;
                color: #6b7280;
                font-size: 13px;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.2s ease;
            }
            .fridays-upsell-decline:hover,
            .fridays-upsell-decline:focus {
                background: #f3f4f6;
                border-color: #d1d5db;
                color: #374151;
                outline: 2px solid #9ca3af;
                outline-offset: 2px;
            }
            .fridays-upsell-arrow {
                display: inline-block;
                transition: transform 0.2s ease;
            }
            .fridays-upsell-cta:hover .fridays-upsell-arrow,
            .fridays-upsell-cta:focus .fridays-upsell-arrow {
                transform: translateX(3px);
            }

            @media (max-width: 480px) {
                .fridays-upsell-modal {
                    border-radius: 14px;
                    max-height: 80vh;
                }
                .fridays-upsell-header {
                    padding: 18px 16px 0;
                }
                .fridays-upsell-headline {
                    font-size: 18px;
                }
                .fridays-upsell-body {
                    padding: 14px 16px 18px;
                }
                .fridays-upsell-comparison {
                    gap: 8px;
                }
                .fridays-upsell-plan {
                    padding: 12px 8px;
                }
                .fridays-upsell-plan-price {
                    font-size: 18px;
                }
                .fridays-upsell-vs {
                    width: 26px;
                    height: 26px;
                    font-size: 9px;
                }
                .fridays-upsell-savings-bar {
                    flex-direction: column;
                    text-align: center;
                    gap: 4px;
                }
                .fridays-upsell-savings-amount {
                    font-size: 16px;
                }
            }
        `;

        const styleEl = createElement('style', '', styles);
        styleEl.id = 'fridays-upsell-styles';
        document.head.appendChild(styleEl);
    }

    // ═════════════════════════════════════════════════════════════════
    // SECTION 5: PLAN DETECTION
    // ═════════════════════════════════════════════════════════════════

    function detectMedicationType(element) {
        const text = (element.textContent || '').toLowerCase();
        const ariaLabel = (element.getAttribute('aria-label') || '').toLowerCase();
        const combined = text + ' ' + ariaLabel;

        if (combined.includes('tirzepatide')) return 'tirzepatide';
        if (combined.includes('semaglutide')) return 'semaglutide';
        if (combined.includes('wegovy')) return 'semaglutide';
        if (combined.includes('mounjaro') || combined.includes('zepbound')) return 'tirzepatide';

        const parent = element.closest('[data-medication], [data-medication-type], [class*="medication"]');
        if (parent) {
            const pText = (parent.textContent || '').toLowerCase();
            if (pText.includes('tirzepatide')) return 'tirzepatide';
            if (pText.includes('semaglutide')) return 'semaglutide';
        }

        return 'semaglutide';
    }

    function detectPlanType(element) {
        const text = (element.textContent || '').toLowerCase();
        const dataAttrs = element.dataset || {};
        const ariaLabel = (element.getAttribute('aria-label') || '').toLowerCase();
        const combined = text + ' ' + ariaLabel;

        if (dataAttrs.plan) {
            const plan = dataAttrs.plan.toLowerCase();
            if (plan === 'monthly' || plan === '1-month' || plan === '1_month') return 'monthly';
            if (plan === '3-month' || plan === '3_month' || plan === 'three-month' || plan === 'three_month') return 'threeMonth';
            if (plan === '6-month' || plan === '6_month' || plan === 'six-month' || plan === 'six_month') return 'sixMonth';
        }

        if (dataAttrs.planId) {
            const id = dataAttrs.planId.toLowerCase();
            if (id.includes('monthly') && !id.includes('3') && !id.includes('6') && !id.includes('three') && !id.includes('six')) return 'monthly';
            if (id.includes('3') || id.includes('three')) return 'threeMonth';
            if (id.includes('6') || id.includes('six')) return 'sixMonth';
        }

        if (dataAttrs.subscriptionType) {
            const st = dataAttrs.subscriptionType.toLowerCase();
            if (st === 'monthly') return 'monthly';
            if (st === 'quarterly' || st === '3-month') return 'threeMonth';
            if (st === 'biannual' || st === '6-month') return 'sixMonth';
        }

        if (combined.includes('6 month') || combined.includes('six month') || combined.includes('6-month') || combined.includes('6month')) return 'sixMonth';
        if (combined.includes('3 month') || combined.includes('three month') || combined.includes('3-month') || combined.includes('3month')) return 'threeMonth';
        if (combined.includes('monthly') || combined.includes('1 month') || combined.includes('1-month')) return 'monthly';

        if (combined.includes('$175') || combined.includes('$1,050') || combined.includes('$1050')) return 'sixMonth';
        if (combined.includes('$198') || combined.includes('$596')) return 'threeMonth';
        if (combined.includes('$249')) return 'monthly';
        if (combined.includes('$275') || combined.includes('$1,650') || combined.includes('$1650')) return 'sixMonth';
        if (combined.includes('$298') || combined.includes('$896')) return 'threeMonth';
        if (combined.includes('$359')) return 'monthly';

        const parent = element.closest('[data-plan], [data-plan-id], [data-subscription], [class*="plan-"]');
        if (parent) {
            const pText = (parent.textContent || '').toLowerCase();
            if (pText.includes('6 month') || pText.includes('six month')) return 'sixMonth';
            if (pText.includes('3 month') || pText.includes('three month')) return 'threeMonth';
            if (pText.includes('monthly')) return 'monthly';
        }

        return null;
    }

    function getPlanConfig(medicationType, planType) {
        return CONFIG[medicationType] && CONFIG[medicationType][planType]
            ? CONFIG[medicationType][planType]
            : null;
    }

    function getUpsellConfig(medicationType, planType) {
        return CONFIG.upsellMap[medicationType] && CONFIG.upsellMap[medicationType][planType]
            ? CONFIG.upsellMap[medicationType][planType]
            : null;
    }

    function findPlanElement(medicationType, planType) {
        const planConfig = getPlanConfig(medicationType, planType);
        if (!planConfig) return null;

        const selectors = CONFIG.triggerSelectors;
        for (const selector of selectors) {
            const elements = document.querySelectorAll(selector);
            for (const el of elements) {
                const elMed = detectMedicationType(el);
                const elPlan = detectPlanType(el);
                if (elMed === medicationType && elPlan === planType) {
                    return el;
                }
            }
        }

        const keywords = planConfig.triggerKeywords;
        const allElements = document.querySelectorAll(CONFIG.triggerSelectors.join(', '));
        for (const el of allElements) {
            const text = (el.textContent || '').toLowerCase();
            if (keywords.some(kw => text.includes(kw.toLowerCase()))) {
                return el;
            }
        }

        return null;
    }

    // ═════════════════════════════════════════════════════════════════
    // SECTION 6: MODAL BUILDER (with accessibility)
    // ═════════════════════════════════════════════════════════════════

    function buildModal(medicationType, planType, upsellConfig) {
        const currentPlan = getPlanConfig(medicationType, planType);
        const upgradePlan = getPlanConfig(medicationType, upsellConfig.upgradeTo);

        if (!currentPlan || !upgradePlan) {
            console.error('[FridaysUpsell] Missing plan config:', { medicationType, planType, upgradeTo: upsellConfig.upgradeTo });
            return null;
        }

        const overlay = createElement('div', '', '', {
            id: 'fridays-upsell-overlay',
            role: 'dialog',
            'aria-modal': 'true',
            'aria-labelledby': 'fridays-upsell-title',
            'aria-describedby': 'fridays-upsell-desc',
            tabindex: '-1'
        });

        const modal = createElement('div', 'fridays-upsell-modal', '');

        const closeBtn = createElement('button', 'fridays-upsell-close', '&times;', {
            'aria-label': 'Close upsell offer',
            type: 'button'
        });
        closeBtn.addEventListener('click', handleDecline);
        modal.appendChild(closeBtn);

        const header = createElement('div', 'fridays-upsell-header', `
            <div class="fridays-upsell-badge">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                ${escapeHtml(upsellConfig.savingsBadge)}
            </div>
            <h2 class="fridays-upsell-headline" id="fridays-upsell-title">${escapeHtml(upsellConfig.headline)}</h2>
            <p class="fridays-upsell-subheadline" id="fridays-upsell-desc">${escapeHtml(upsellConfig.subheadline)}</p>
        `);
        modal.appendChild(header);

        const body = createElement('div', 'fridays-upsell-body', '');

        const comparison = createElement('div', 'fridays-upsell-comparison', `
            <div class="fridays-upsell-plan current">
                <div class="fridays-upsell-plan-label">Your Selection</div>
                <div class="fridays-upsell-plan-name">${escapeHtml(currentPlan.name)}</div>
                <div class="fridays-upsell-plan-price">${escapeHtml(currentPlan.displayPrice)}</div>
            </div>
            <div class="fridays-upsell-vs" aria-hidden="true">VS</div>
            <div class="fridays-upsell-plan upgrade">
                <div class="fridays-upsell-plan-label">Recommended</div>
                <div class="fridays-upsell-plan-name">${escapeHtml(upgradePlan.name)}</div>
                <div class="fridays-upsell-plan-price">${escapeHtml(upgradePlan.displayPrice)}</div>
            </div>
        `);
        body.appendChild(comparison);

        const benefitsHtml = upsellConfig.benefits.map(b => `
            <div class="fridays-upsell-benefit">
                <div class="fridays-upsell-benefit-icon" aria-hidden="true">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                </div>
                ${escapeHtml(b)}
            </div>
        `).join('');

        const benefits = createElement('div', 'fridays-upsell-benefits', `
            <div class="fridays-upsell-benefits-title">What's Included</div>
            ${benefitsHtml}
        `);
        body.appendChild(benefits);

        const savingsBar = createElement('div', 'fridays-upsell-savings-bar', `
            <div class="fridays-upsell-savings-text">Total savings over the plan period</div>
            <div class="fridays-upsell-savings-amount">${escapeHtml(upsellConfig.totalSavings)}</div>
        `);
        body.appendChild(savingsBar);

        const actions = createElement('div', 'fridays-upsell-actions', `
            <button class="fridays-upsell-cta" id="fridays-upsell-cta" type="button">
                ${escapeHtml(upsellConfig.ctaText)}
                <span class="fridays-upsell-arrow" aria-hidden="true">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                        <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                </span>
            </button>
            <button class="fridays-upsell-decline" id="fridays-upsell-decline" type="button">
                ${escapeHtml(upsellConfig.declineText)}
            </button>
        `);
        body.appendChild(actions);

        modal.appendChild(body);
        overlay.appendChild(modal);

        overlay.addEventListener('click', function(e) {
            if (e.target === overlay) handleDecline();
        });

        setTimeout(() => {
            const cta = document.getElementById('fridays-upsell-cta');
            const decline = document.getElementById('fridays-upsell-decline');
            if (cta) {
                cta.addEventListener('click', handleUpgrade);
                cta.addEventListener('keydown', function(e) {
                    if (e.key === 'Tab' && e.shiftKey) {
                        e.preventDefault();
                        decline.focus();
                    }
                });
            }
            if (decline) {
                decline.addEventListener('click', handleDecline);
                decline.addEventListener('keydown', function(e) {
                    if (e.key === 'Tab' && !e.shiftKey) {
                        e.preventDefault();
                        cta.focus();
                    }
                });
            }
        }, 0);

        return overlay;
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // ═════════════════════════════════════════════════════════════════
    // SECTION 7: FOCUS MANAGEMENT (accessibility)
    // ═════════════════════════════════════════════════════════════════

    function trapFocus(container) {
        const focusable = container.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        container.addEventListener('keydown', function(e) {
            if (e.key !== 'Tab') return;

            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        });
    }

    // ═════════════════════════════════════════════════════════════════
    // SECTION 8: MODAL ACTIONS
    // ═════════════════════════════════════════════════════════════════

    function showModal(medicationType, planType, triggerEl) {
        const upsellConfig = getUpsellConfig(medicationType, planType);
        if (!upsellConfig) return;

        if (modalElement) return;

        currentTriggerElement = triggerEl;
        originalPlanData = { medicationType, planType, element: triggerEl };

        injectStyles();

        modalElement = buildModal(medicationType, planType, upsellConfig);
        if (!modalElement) return;

        previouslyFocusedElement = document.activeElement;

        document.body.appendChild(modalElement);

        modalElement.offsetHeight;

        requestAnimationFrame(() => {
            modalElement.classList.add('active');
            modalElement.focus();
            trapFocus(modalElement);
        });

        document.body.style.overflow = 'hidden';

        CONFIG.tracking.track('Modal Shown', {
            medicationType,
            planType,
            upgradeTo: upsellConfig.upgradeTo,
            savings: upsellConfig.totalSavings
        });

        document.addEventListener('keydown', handleKeydown);
    }

    function closeModal() {
        if (!modalElement) return;

        document.removeEventListener('keydown', handleKeydown);
        modalElement.classList.remove('active');
        modalElement.classList.add('closing');

        setTimeout(() => {
            if (modalElement && modalElement.parentNode) {
                modalElement.parentNode.removeChild(modalElement);
            }
            modalElement = null;
            document.body.style.overflow = '';

            if (previouslyFocusedElement && previouslyFocusedElement.focus) {
                previouslyFocusedElement.focus();
            }
        }, CONFIG.animation.fadeOut);
    }

    function handleUpgrade() {
        if (!originalPlanData) {
            closeModal();
            return;
        }

        const { medicationType, planType } = originalPlanData;
        const upsellConfig = getUpsellConfig(medicationType, planType);
        if (!upsellConfig) {
            closeModal();
            return;
        }

        const upgradeTo = upsellConfig.upgradeTo;
        const upgradeEl = findPlanElement(medicationType, upgradeTo);

        CONFIG.tracking.track('Upgrade Accepted', {
            medicationType,
            fromPlan: planType,
            toPlan: upgradeTo,
            savings: upsellConfig.totalSavings
        });

        closeModal();

        setTimeout(() => {
            if (upgradeEl) {
                selectPlanElement(upgradeEl, medicationType, upgradeTo);
            } else {
                console.warn('[FridaysUpsell] Could not find upgrade element, attempting fallback');
                attemptFallbackSelection(medicationType, upgradeTo);
            }
        }, CONFIG.animation.fadeOut + 50);
    }

    function handleDecline() {
        if (originalPlanData) {
            CONFIG.tracking.track('Upgrade Declined', {
                medicationType: originalPlanData.medicationType,
                planType: originalPlanData.planType
            });
        }

        closeModal();

        setTimeout(() => {
            if (currentTriggerElement) {
                selectPlanElement(currentTriggerElement, originalPlanData.medicationType, originalPlanData.planType);
            }
        }, CONFIG.animation.fadeOut + 50);
    }

    function handleKeydown(e) {
        if (e.key === 'Escape') {
            handleDecline();
        }
    }

    // ═════════════════════════════════════════════════════════════════
    // SECTION 9: PLAN SELECTION (SPA-compatible)
    // ═════════════════════════════════════════════════════════════════

    function selectPlanElement(element, medicationType, planType) {
        const clickable = element.querySelector('button, a, [role="button"], input[type="radio"]') || element;

        const radio = element.querySelector('input[type="radio"]') ||
                      (element.tagName === 'INPUT' && element.type === 'radio' ? element : null);

        if (radio && !radio.checked) {
            radio.checked = true;
            radio.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }));
            radio.dispatchEvent(new InputEvent('input', { bubbles: true, cancelable: true }));
        }

        if (clickable.click) {
            clickable.click();
        }

        clickable.dispatchEvent(new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window,
            detail: 1
        }));

        clickable.dispatchEvent(new TouchEvent('touchend', {
            bubbles: true,
            cancelable: true
        }));

        const form = element.closest('form');
        if (form) {
            const submitBtn = form.querySelector('button[type="submit"], [type="submit"]');
            if (submitBtn) {
                setTimeout(() => submitBtn.click(), 100);
            }
        }

        const nextBtn = document.querySelector('button[type="submit"], [data-testid*="continue"], [data-testid*="next"], .continue-btn, .next-btn');
        if (nextBtn) {
            setTimeout(() => nextBtn.click(), 150);
        }

        window.dispatchEvent(new CustomEvent('fridays-plan-selected', {
            detail: { medicationType, planType }
        }));

        console.log('[FridaysUpsell] Selected plan:', { medicationType, planType, element: element.className });
    }

    function attemptFallbackSelection(medicationType, planType) {
        const planConfig = getPlanConfig(medicationType, planType);
        if (!planConfig) return;

        const keywords = planConfig.triggerKeywords;
        const allClickable = document.querySelectorAll('button, a, [role="button"], input[type="radio"], label');

        for (const el of allClickable) {
            const text = (el.textContent || '').toLowerCase();
            if (keywords.some(kw => text.includes(kw.toLowerCase()))) {
                selectPlanElement(el, medicationType, planType);
                return;
            }
        }

        console.error('[FridaysUpsell] Fallback selection failed for:', medicationType, planType);
    }

    // ═════════════════════════════════════════════════════════════════
    // SECTION 10: EVENT HANDLING
    // ═════════════════════════════════════════════════════════════════

    function handlePlanClick(e) {
        const target = e.target.closest(CONFIG.triggerSelectors.join(', '));
        if (!target) return;

        const medicationType = detectMedicationType(target);
        const planType = detectPlanType(target);

        if (!planType) return;

        const upsellConfig = getUpsellConfig(medicationType, planType);
        if (!upsellConfig) return;

        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();

        showModal(medicationType, planType, target);
    }

    function attachListeners() {
        document.body.addEventListener('click', handlePlanClick, true);

        document.body.addEventListener('mousedown', function(e) {
            const target = e.target.closest(CONFIG.triggerSelectors.join(', '));
            if (target) {
                const medicationType = detectMedicationType(target);
                const planType = detectPlanType(target);
                if (planType && getUpsellConfig(medicationType, planType)) {
                    target._fridaysUpsellIntercept = true;
                }
            }
        }, true);
    }

    // ═════════════════════════════════════════════════════════════════
    // SECTION 11: SPA NAVIGATION HANDLING
    // ═════════════════════════════════════════════════════════════════

    function handleSpaNavigation() {
        if (modalElement) closeModal();
        currentTriggerElement = null;
        originalPlanData = null;
    }

    function initSpaHandling() {
        if (window.MutationObserver) {
            observer = new MutationObserver(debounce(function(mutations) {
                // Event delegation handles dynamic DOM automatically
            }, 100));

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }

        const originalPushState = history.pushState;
        const originalReplaceState = history.replaceState;

        history.pushState = function(...args) {
            originalPushState.apply(this, args);
            window.dispatchEvent(new Event('fridays-spa-navigate'));
        };

        history.replaceState = function(...args) {
            originalReplaceState.apply(this, args);
            window.dispatchEvent(new Event('fridays-spa-navigate'));
        };

        window.addEventListener('popstate', function() {
            window.dispatchEvent(new Event('fridays-spa-navigate'));
        });

        window.addEventListener('fridays-spa-navigate', handleSpaNavigation);
        window.addEventListener('hashchange', handleSpaNavigation);
        window.addEventListener('routeChangeComplete', handleSpaNavigation);
        window.addEventListener('NEXT_ROUTER_EVENT', handleSpaNavigation);
    }

    // ═════════════════════════════════════════════════════════════════
    // SECTION 12: STATE PRESERVATION
    // ═════════════════════════════════════════════════════════════════

    function initStatePreservation() {
        window.addEventListener('beforeunload', function() {
            if (originalPlanData) {
                try {
                    sessionStorage.setItem('fridays-upsell-state', JSON.stringify({
                        medicationType: originalPlanData.medicationType,
                        planType: originalPlanData.planType,
                        timestamp: Date.now()
                    }));
                } catch (e) {}
            }
        });

        try {
            const saved = sessionStorage.getItem('fridays-upsell-state');
            if (saved) {
                const state = JSON.parse(saved);
                if (Date.now() - state.timestamp < 5 * 60 * 1000) {
                    console.log('[FridaysUpsell] Restored state from session:', state);
                }
                sessionStorage.removeItem('fridays-upsell-state');
            }
        } catch (e) {}
    }

    // ═════════════════════════════════════════════════════════════════
    // SECTION 13: CONSOLE TEST API
    // ═════════════════════════════════════════════════════════════════

    function initConsoleApi() {
        window.FridaysUpsell = {
            show: function(medicationType, planType) {
                if (!CONFIG[medicationType]) {
                    console.error('[FridaysUpsell] Unknown medication type:', medicationType);
                    return;
                }
                if (!CONFIG[medicationType][planType]) {
                    console.error('[FridaysUpsell] Unknown plan type:', planType);
                    return;
                }
                showModal(medicationType, planType, document.body);
            },

            hide: function() {
                closeModal();
            },

            getState: function() {
                return {
                    isInitialized,
                    hasModal: !!modalElement,
                    currentTrigger: currentTriggerElement,
                    originalPlan: originalPlanData
                };
            },

            scan: function() {
                const results = [];
                const selectors = CONFIG.triggerSelectors;
                for (const selector of selectors) {
                    const elements = document.querySelectorAll(selector);
                    elements.forEach(el => {
                        const med = detectMedicationType(el);
                        const plan = detectPlanType(el);
                        if (plan) {
                            results.push({
                                medicationType: med,
                                planType: plan,
                                hasUpsell: !!getUpsellConfig(med, plan),
                                className: el.className,
                                textPreview: el.textContent.trim().substring(0, 100)
                            });
                        }
                    });
                }
                console.table(results);
                return results;
            },

            selectPlan: function(medicationType, planType) {
                const el = findPlanElement(medicationType, planType);
                if (el) {
                    selectPlanElement(el, medicationType, planType);
                    console.log('[FridaysUpsell] Manually selected:', medicationType, planType);
                } else {
                    console.error('[FridaysUpsell] Could not find element for:', medicationType, planType);
                }
            },

            getConfig: function() {
                return CONFIG;
            },

            reinit: function() {
                isInitialized = false;
                init();
                console.log('[FridaysUpsell] Re-initialized');
            }
        };

        console.log('[FridaysUpsell] Console API ready. Try: FridaysUpsell.show("semaglutide", "monthly")');
        console.log('[FridaysUpsell] Or scan for plans: FridaysUpsell.scan()');
    }

    // ═════════════════════════════════════════════════════════════════
    // SECTION 14: INITIALIZATION
    // ═════════════════════════════════════════════════════════════════

    function init() {
        if (isInitialized) return;
        isInitialized = true;

        injectStyles();
        attachListeners();
        initSpaHandling();
        initStatePreservation();
        initConsoleApi();

        console.log('[FridaysUpsell] Initialized successfully');
    }

    // ═════════════════════════════════════════════════════════════════
    // SECTION 15: BOOTSTRAP
    // ═════════════════════════════════════════════════════════════════

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    if (document.body) {
        init();
    }

})();