<script setup></script>

<template>
  <router-view />
</template>

<style>
:root {
  /* Accent */
  --accent-color: #0b5cab;
  --accent-contrast: #ffffff;

  /* Sidebar */
  --sidebar-bg: #f6f7fb;
  --sidebar-border: #e8ecf3;
  --logo-bg: #e9f2ff;
  --brand-text: #5b677a;
  --link-color: #6f7d91;
  --link-hover-bg: #eef2f8;
  --link-hover-color: #415066;
  --section-title: #7f8da3;
  --indicator-bg: rgba(11, 92, 171, 0.08);

  /* Active */
  --active-bg: var(--accent-color);
  --active-foreground: var(--accent-contrast);

  /* Header / page */
  --page-bg: #ffffff;
  --page-text: #111827;
  --card-bg: #ffffff;
  --card-border: #e5e7eb;
  --surface-1: #f9fafb;
  --surface-border: #d1d5db;
  --hero-bg: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --header-bg: #ffffff;
  --header-border: #e5e7eb;
  /* content layout */
  --content-max-width: 1120px;

  /* Daily activity tokens */
  --daily-card-border: rgba(15, 23, 42, 0.08);
  --daily-card-shadow: 0 22px 36px rgba(15, 23, 42, 0.08);
  --daily-card-pill-bg: #ecf8f2;
  --daily-card-pill-text: #059669;
  --daily-card-divider: rgba(15, 23, 42, 0.08);
  --daily-card-symbol: #1f2937;
  --daily-card-time: var(--accent-color);
  --daily-card-active-bg: var(--accent-color);
  --daily-card-active-text: #ffffff;
  --daily-card-active-divider: rgba(255, 255, 255, 0.35);
  --daily-card-active-shadow: 0 20px 40px rgba(11, 92, 171, 0.2);

  /* Callout / notice tokens */
  --callout-border: rgba(229, 231, 235, 0.9);
  --callout-shadow: 0 16px 30px rgba(15, 23, 42, 0.08);
  --callout-text: #4b5563;

  /* Activity trade list tokens */
  --trade-card-bg: #f7f7fb;
  --trade-card-radius: 1.25rem;
  --trade-card-shadow: 0 6px 16px rgba(15, 23, 42, 0.08);
  --trade-accent: #1d7d4a;
  --trade-pair-color: #0b5cab;
  --trade-meta-color: #6b7280;
  --trade-chevron-color: #9ca3af;
}

html,
body,
#app {
  height: 100%;
  background: var(--page-bg);
  color: var(--page-text);
  transition:
    background-color 180ms ease,
    color 180ms ease;
}

/* Global centered content container used by header and pages */
.app-inner {
  width: 90%;
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 1.5rem;
  box-sizing: border-box;
}
</style>
