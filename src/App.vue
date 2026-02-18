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
