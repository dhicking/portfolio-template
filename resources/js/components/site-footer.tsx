import { usePage } from '@inertiajs/react';
import Availability from '@/components/availability';
import ThemeSwitch from '@/components/theme-switch';
import { feed } from '@/routes';

export default function SiteFooter() {
    const { site } = usePage().props;

    return (
        <footer className="frame mt-8">
            <div className="grid-12 gap-y-8 border-t border-foreground pt-4 pb-14 md:pb-20">
                <p className="col-span-4 caption md:col-span-3">
                    <span className="text-foreground">→</span>
                    <span className="px-2">/</span>
                    Get in touch
                </p>
                <div className="col-span-4 md:col-span-9">
                    <a
                        href={`mailto:${site.email}`}
                        className="block text-[clamp(1.75rem,6.2vw,5.75rem)] leading-[0.95] font-medium tracking-[-0.045em] break-words transition-colors hover:text-signal"
                    >
                        {site.email}
                    </a>
                    <Availability className="mt-8 max-w-xl" />
                </div>
            </div>

            <div className="grid-12 gap-y-4 border-t border-rule py-5 caption">
                <p className="col-span-4 md:col-span-3">
                    © {new Date().getFullYear()} {site.name}
                </p>
                <ul className="col-span-4 flex flex-wrap gap-x-5 gap-y-2 md:col-span-6">
                    {site.links.map((link) => (
                        <li key={link.url}>
                            <a
                                href={link.url}
                                rel="me noopener"
                                className="transition-colors hover:text-foreground"
                            >
                                {link.label} ↗
                            </a>
                        </li>
                    ))}
                    <li>
                        <a
                            href={feed().url}
                            className="transition-colors hover:text-foreground"
                        >
                            RSS
                        </a>
                    </li>
                </ul>
                <div className="col-span-4 md:col-span-3 md:justify-self-end">
                    <ThemeSwitch />
                </div>
            </div>
        </footer>
    );
}
