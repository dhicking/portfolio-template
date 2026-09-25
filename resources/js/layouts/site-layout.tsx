import type { ReactNode } from 'react';
import SiteFooter from '@/components/site-footer';
import SiteHeader from '@/components/site-header';

export default function SiteLayout({ children }: { children: ReactNode }) {
    return (
        <div className="flex min-h-svh flex-col">
            <a
                href="#content"
                className="sr-only bg-foreground p-3 caption text-background focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50"
            >
                Skip to content
            </a>
            <SiteHeader />
            <main id="content" className="flex-1">
                {children}
            </main>
            <SiteFooter />
        </div>
    );
}
