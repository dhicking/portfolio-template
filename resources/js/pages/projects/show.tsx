import { Link } from '@inertiajs/react';
import Seo from '@/components/seo';
import { pad } from '@/lib/format';
import { index, show } from '@/routes/projects';
import type { Project } from '@/types';

type Props = {
    project: Project;
    number: number;
    next: { slug: string; title: string } | null;
};

export default function ProjectShow({ project, number, next }: Props) {
    const meta = [
        { label: 'Role', value: project.role },
        { label: 'Year', value: project.year },
        { label: 'Stack', value: project.stack.join(' / ') },
    ].filter((item) => item.value);

    return (
        <>
            <Seo
                title={project.title}
                description={project.summary}
                type="article"
            />

            <header className="frame pt-12 md:pt-20">
                <div className="flex justify-between gap-4 caption">
                    <Link
                        href={index()}
                        className="transition-colors hover:text-foreground"
                    >
                        ← Work
                    </Link>
                    <span>
                        <span className="text-foreground">{pad(number)}</span> /{' '}
                        {project.year}
                    </span>
                </div>

                <h1 className="mt-6 max-w-[15ch] text-[clamp(2.75rem,8vw,7.5rem)] leading-[0.9] font-medium tracking-[-0.05em] text-balance md:-ml-[0.05em]">
                    {project.title}
                </h1>

                <div className="mt-10 grid-12 md:mt-14">
                    <p className="col-span-4 text-xl leading-snug tracking-[-0.01em] text-pretty md:col-span-7 md:col-start-4 md:text-[1.75rem]">
                        {project.summary}
                    </p>
                </div>

                <dl className="mt-14 grid-12 gap-y-6 border-t border-rule pt-4 md:mt-20">
                    {meta.map((item) => (
                        <div
                            key={item.label}
                            className="col-span-2 md:col-span-3"
                        >
                            <dt className="caption">{item.label}</dt>
                            <dd className="mt-1 text-[15px]">{item.value}</dd>
                        </div>
                    ))}
                    {project.links.length > 0 && (
                        <div className="col-span-2 md:col-span-3">
                            <dt className="caption">Links</dt>
                            <dd className="mt-1 flex flex-wrap gap-x-4 text-[15px]">
                                {project.links.map((link) => (
                                    <a
                                        key={link.url}
                                        href={link.url}
                                        className="underline decoration-signal underline-offset-4 hover:text-signal"
                                    >
                                        {link.label}
                                    </a>
                                ))}
                            </dd>
                        </div>
                    )}
                </dl>
            </header>

            {project.image && (
                <figure className="frame mt-14">
                    <img
                        src={project.image}
                        alt={project.image_alt}
                        className="w-full border border-rule"
                    />
                </figure>
            )}

            <article className="frame grid-12 py-16 md:py-24">
                <div
                    className="prose-swiss col-span-4 md:col-span-7 md:col-start-4"
                    dangerouslySetInnerHTML={{ __html: project.body }}
                />
            </article>

            {next && (
                <nav aria-label="Next project" className="frame">
                    <Link
                        href={show(next.slug)}
                        prefetch
                        className="group grid-12 border-t border-rule pt-4 pb-20"
                    >
                        <span className="col-span-4 caption md:col-span-3">
                            Next project
                        </span>
                        <span className="col-span-4 mt-3 text-[clamp(2rem,5vw,4.5rem)] leading-[0.95] font-medium tracking-[-0.04em] transition-colors group-hover:text-signal md:col-span-9 md:mt-0">
                            {next.title}{' '}
                            <span
                                aria-hidden
                                className="inline-block transition-transform group-hover:translate-x-2"
                            >
                                →
                            </span>
                        </span>
                    </Link>
                </nav>
            )}
        </>
    );
}
