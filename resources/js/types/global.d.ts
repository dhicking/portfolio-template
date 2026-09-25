import type { Site } from '@/types/portfolio';

declare module '@inertiajs/core' {
    export interface InertiaConfig {
        sharedPageProps: {
            site: Site;
            url: string;
            [key: string]: unknown;
        };
    }
}
