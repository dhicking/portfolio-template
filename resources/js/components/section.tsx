import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type Props = {
    index: string;
    label: string;
    aside?: ReactNode;
    className?: string;
    children: ReactNode;
};

/**
 * The basic unit of every page: a hairline, a numbered label in the left
 * three columns, and content in the remaining nine.
 */
export default function Section({
    index,
    label,
    aside,
    className,
    children,
}: Props) {
    return (
        <section className={cn('frame', className)}>
            <div className="grid-12 gap-y-6 border-t border-rule pt-4 pb-16 md:pb-28">
                <header className="col-span-4 flex items-baseline justify-between gap-4 md:col-span-3 md:flex-col md:justify-start">
                    <h2 className="caption">
                        <span className="text-foreground">{index}</span>
                        <span className="px-2">/</span>
                        {label}
                    </h2>
                    {aside}
                </header>
                <div className="col-span-4 md:col-span-9">{children}</div>
            </div>
        </section>
    );
}
