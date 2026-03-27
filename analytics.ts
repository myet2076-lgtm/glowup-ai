import posthog from 'posthog-js';

const POSTHOG_KEY = 'phc_RMoGhHqwdxv42V89WK7G3hXURc7ROyHxsthqeC0PntO';
const POSTHOG_HOST = 'https://us.i.posthog.com';

let initialized = false;

export function initAnalytics() {
  if (initialized) return;
  try {
    posthog.init(POSTHOG_KEY, {
      api_host: POSTHOG_HOST,
      autocapture: true,
      capture_pageview: false, // we track manually for SPA
      capture_pageleave: true,
      persistence: 'localStorage+cookie',
    });
    initialized = true;
  } catch {
    // analytics should never break the app
  }
}

export function identifyUser(userId: string, email?: string) {
  try {
    posthog.identify(userId, email ? { email } : undefined);
  } catch {}
}

export function resetUser() {
  try {
    posthog.reset();
  } catch {}
}

export function trackPageView(page: string) {
  try {
    posthog.capture('$pageview', { page });
  } catch {}
}

export function trackEvent(event: string, properties?: Record<string, any>) {
  try {
    posthog.capture(event, properties);
  } catch {}
}
