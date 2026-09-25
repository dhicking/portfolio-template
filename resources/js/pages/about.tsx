import { usePage } from '@inertiajs/react';
import PageHeader from '@/components/page-header';
import Section from '@/components/section';
import Seo from '@/components/seo';
import { Button } from '@/components/ui/button';
import { monthYear } from '@/lib/format';
import type { Education, Position, SkillGroup } from '@/types';

type Props = {
    about: string;
    experience: Position[];
    skills: SkillGroup[];
    education: Education[];
};

export default function About({ about, experience, skills, education }: Props) {
    const { site } = usePage().props;

    return (
        <>
            <Seo title="About" />

            <PageHeader eyebrow={<span>Profile</span>} title="About" />

            <Section index="01" label="Background">
                <div className="grid gap-y-10 md:grid-cols-9 md:gap-x-6">
                    <div
                        className="prose-swiss text-lg md:col-span-6 [&>p:first-child]:text-[1.375rem] [&>p:first-child]:leading-snug [&>p:first-child]:tracking-[-0.01em]"
                        dangerouslySetInnerHTML={{ __html: about }}
                    />
                    <div className="flex flex-col items-start gap-6 md:col-span-3">
                        {site.resume && (
                            <Button
                                asChild
                                variant="outline"
                                className="h-11 border-foreground px-5 hover:bg-foreground hover:text-background"
                            >
                                <a href={site.resume} download>
                                    Download résumé (PDF)
                                </a>
                            </Button>
                        )}
                        <ul className="space-y-2 caption">
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
                        </ul>
                    </div>
                </div>
            </Section>

            {experience.length > 0 && (
                <Section index="02" label="Experience">
                    <ol>
                        {experience.map((position) => (
                            <li
                                key={`${position.company}-${position.start}`}
                                className="grid gap-y-3 border-b border-rule py-6 first:pt-0 md:grid-cols-9 md:gap-x-6"
                            >
                                <p className="caption md:col-span-2 md:pt-1.5">
                                    {monthYear(position.start)} –{' '}
                                    {monthYear(position.end)}
                                </p>
                                <div className="md:col-span-3">
                                    <h3 className="text-xl leading-tight font-medium tracking-[-0.015em]">
                                        {position.role}
                                    </h3>
                                    <p className="mt-1 text-[15px] text-muted-foreground">
                                        {position.company}
                                        {position.location &&
                                            ` · ${position.location}`}
                                    </p>
                                </div>
                                <div className="text-[15px] leading-relaxed md:col-span-4">
                                    {position.summary && (
                                        <p>{position.summary}</p>
                                    )}
                                    {position.highlights &&
                                        position.highlights.length > 0 && (
                                            <ul className="mt-3 space-y-2 text-muted-foreground">
                                                {position.highlights.map(
                                                    (highlight) => (
                                                        <li
                                                            key={highlight}
                                                            className="relative pl-5"
                                                        >
                                                            <span
                                                                aria-hidden
                                                                className="absolute left-0"
                                                            >
                                                                –
                                                            </span>
                                                            {highlight}
                                                        </li>
                                                    ),
                                                )}
                                            </ul>
                                        )}
                                </div>
                            </li>
                        ))}
                    </ol>
                </Section>
            )}

            {skills.length > 0 && (
                <Section index="03" label="Skills">
                    <dl>
                        {skills.map((group) => (
                            <div
                                key={group.group}
                                className="grid gap-y-1 border-b border-rule py-4 first:pt-0 md:grid-cols-9 md:gap-x-6"
                            >
                                <dt className="caption md:col-span-2 md:pt-1.5">
                                    {group.group}
                                </dt>
                                <dd className="text-lg tracking-[-0.01em] md:col-span-7">
                                    {group.items.join(' / ')}
                                </dd>
                            </div>
                        ))}
                    </dl>
                </Section>
            )}

            {education.length > 0 && (
                <Section index="04" label="Education">
                    <ol>
                        {education.map((entry) => (
                            <li
                                key={entry.school}
                                className="grid gap-y-1 border-b border-rule py-4 first:pt-0 md:grid-cols-9 md:gap-x-6"
                            >
                                <p className="caption md:col-span-2 md:pt-1.5">
                                    {entry.start} – {entry.end}
                                </p>
                                <p className="text-lg tracking-[-0.01em] md:col-span-7">
                                    {entry.degree}
                                    <span className="text-muted-foreground">
                                        {' '}
                                        · {entry.school}
                                    </span>
                                </p>
                            </li>
                        ))}
                    </ol>
                </Section>
            )}
        </>
    );
}
