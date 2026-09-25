import { usePage } from '@inertiajs/react';
import { cn } from '@/lib/utils';

export default function Availability({ className }: { className?: string }) {
    const { availability } = usePage().props.site;

    if (!availability?.open) {
        return null;
    }

    return (
        <p className={cn('flex gap-3 text-[15px] leading-snug', className)}>
            <span
                aria-hidden
                className="mt-[0.4em] size-2 shrink-0 bg-signal"
            />
            <span>
                <span className="font-medium">Open to work.</span>{' '}
                <span className="text-muted-foreground">
                    {availability.note}
                </span>
            </span>
        </p>
    );
}
