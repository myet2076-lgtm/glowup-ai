import type { PostHog } from 'posthog-js';

const POSTHOG_KEY = import.meta.env.VITE_POSTHOG_KEY;
const POSTHOG_HOST = import.meta.env.VITE_POSTHOG_HOST || 'https://us.i.posthog.com';

let analyticsPromise: Promise<PostHog | null> | null = null;

function loadAnalytics(): Promise<PostHog | null> {
  if (!POSTHOG_KEY || navigator.doNotTrack === '1') return Promise.resolve(null);
  if (analyticsPromise) return analyticsPromise;

  analyticsPromise = import('posthog-js')
    .then(({ default: posthog }) => {
      posthog.init(POSTHOG_KEY, {
        api_host: POSTHOG_HOST,
        autocapture: false,
        capture_pageview: false,
        capture_pageleave: true,
        persistence: 'localStorage+cookie',
      });
      return posthog;
    })
    .catch(() => null);
  return analyticsPromise;
}

export function initAnalytics(): void {
  void loadAnalytics();
}

export function identifyUser(userId: string): void {
  void loadAnalytics().then((posthog) => posthog?.identify(userId));
}

export function resetUser(): void {
  void loadAnalytics().then((posthog) => posthog?.reset());
}

export function trackPageView(page: string): void {
  void loadAnalytics().then((posthog) => posthog?.capture('$pageview', { page }));
}

export function trackEvent(event: string, properties?: Record<string, unknown>): void {
  void loadAnalytics().then((posthog) => posthog?.capture(event, properties));
}
