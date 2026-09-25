const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
];

/** "2026-05-12" → "12 May 2026". Parsed by hand so server and browser agree. */
export function longDate(iso: string): string {
    const [year, month, day] = iso.split('-').map(Number);

    return `${day} ${months[month - 1]} ${year}`;
}

/** "2023-03" → "Mar 2023", 2012 → "2012", null → "Now". */
export function monthYear(value: string | number | null | undefined): string {
    if (value === null || value === undefined || value === '') {
        return 'Now';
    }

    const [year, month] = String(value).split('-').map(Number);

    return month ? `${months[month - 1]} ${year}` : String(year);
}

/** 3 → "03" */
export function pad(value: number): string {
    return String(value).padStart(2, '0');
}
