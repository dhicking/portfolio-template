import { useEffect, useState } from 'react';

/**
 * The owner's current local time. Rendered empty on the server and filled in
 * after hydration, so SSR markup never disagrees with the browser.
 */
export default function LocalTime({ timezone }: { timezone: string }) {
    const [time, setTime] = useState<string | null>(null);

    useEffect(() => {
        const format = new Intl.DateTimeFormat('en-GB', {
            hour: '2-digit',
            minute: '2-digit',
            timeZone: timezone,
        });

        const tick = () => setTime(format.format(new Date()));
        tick();

        const interval = window.setInterval(tick, 15_000);

        return () => window.clearInterval(interval);
    }, [timezone]);

    return (
        <time className="tabular-nums" suppressHydrationWarning>
            {time ?? '--:--'}
        </time>
    );
}
