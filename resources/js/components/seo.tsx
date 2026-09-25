import { Head, usePage } from '@inertiajs/react';

type Props = {
    title?: string;
    description?: string;
    type?: 'website' | 'article';
};

export default function Seo({ title, description, type = 'website' }: Props) {
    const { site, url } = usePage().props;

    const fullTitle = title
        ? `${title} — ${site.name}`
        : `${site.name} — ${site.role}`;
    const summary = description || site.description || '';

    return (
        <Head title={fullTitle}>
            <meta name="description" content={summary} />
            <link rel="canonical" href={url} />
            <meta property="og:type" content={type} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={summary} />
            <meta property="og:url" content={url} />
            <meta name="twitter:card" content="summary" />
        </Head>
    );
}
