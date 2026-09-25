import { createInertiaApp } from '@inertiajs/react';
import { initializeTheme } from '@/hooks/use-appearance';
import SiteLayout from '@/layouts/site-layout';

void createInertiaApp({
    title: (title) => title,
    layout: () => SiteLayout,
    strictMode: true,
    progress: {
        color: 'var(--signal)',
    },
});

// This will set light / dark mode on load...
initializeTheme();
