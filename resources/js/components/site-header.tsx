import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import LocalTime from '@/components/local-time';
import {
    Sheet,
    SheetContent,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { cn } from '@/lib/utils';
import { about, contact, home } from '@/routes';
import { index as posts } from '@/routes/posts';
import { index as projects } from '@/routes/projects';

const navigation = [
    { label: 'Work', href: projects() },
    { label: 'Writing', href: posts() },
    { label: 'About', href: about() },
    { label: 'Contact', href: contact() },
];

function NavLinks({
    className,
    onNavigate,
}: {
    className?: string;
    onNavigate?: () => void;
}) {
    const { isCurrentOrParentUrl } = useCurrentUrl();

    return (
        <ul className={className}>
            {navigation.map((item) => {
                const active = isCurrentOrParentUrl(item.href);

                return (
                    <li key={item.label}>
                        <Link
                            href={item.href}
                            prefetch
                            onClick={onNavigate}
                            aria-current={active ? 'page' : undefined}
                            className="group inline-flex items-center gap-2 transition-colors hover:text-signal"
                        >
                            <span
                                aria-hidden
                                className={cn(
                                    'size-[7px] bg-signal transition-opacity',
                                    active ? 'opacity-100' : 'opacity-0',
                                )}
                            />
                            {item.label}
                        </Link>
                    </li>
                );
            })}
        </ul>
    );
}

export default function SiteHeader() {
    const { site } = usePage().props;
    const [open, setOpen] = useState(false);

    return (
        <header className="frame">
            <div className="grid-12 items-baseline border-b border-rule py-5">
                <Link
                    href={home()}
                    className="col-span-3 font-medium tracking-[-0.01em] md:col-span-3"
                >
                    {site.name}
                </Link>

                <nav
                    aria-label="Main"
                    className="hidden md:col-span-6 md:block"
                >
                    <NavLinks className="flex gap-7 text-[15px] md:-ml-[15px]" />
                </nav>

                <p className="hidden text-right caption md:col-span-3 md:block">
                    {site.location}
                    <span className="px-2">·</span>
                    <LocalTime timezone={site.timezone} />
                </p>

                <Sheet open={open} onOpenChange={setOpen}>
                    <SheetTrigger className="col-span-1 justify-self-end caption text-foreground md:hidden">
                        Menu
                    </SheetTrigger>
                    <SheetContent
                        side="top"
                        className="px-4 pt-5 pb-8 shadow-none"
                    >
                        <SheetTitle className="caption">Menu</SheetTitle>
                        <nav aria-label="Main">
                            <NavLinks
                                onNavigate={() => setOpen(false)}
                                className="mt-6 space-y-2 text-4xl font-medium tracking-[-0.03em]"
                            />
                        </nav>
                        <p className="mt-6 caption">
                            {site.location}
                            <span className="px-2">·</span>
                            <LocalTime timezone={site.timezone} />
                        </p>
                    </SheetContent>
                </Sheet>
            </div>
        </header>
    );
}
