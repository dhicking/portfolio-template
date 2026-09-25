import { Link } from '@inertiajs/react';
import { pad } from '@/lib/format';
import { cn } from '@/lib/utils';
import { show } from '@/routes/projects';
import type { ProjectSummary } from '@/types';

type Props = {
    projects: ProjectSummary[];
    /** Show role and stack columns (the full /work index). */
    detailed?: boolean;
};

export default function ProjectList({ projects, detailed = false }: Props) {
    return (
        <div>
            {detailed && (
                <div className="hidden grid-cols-9 gap-x-6 border-b border-rule pb-3 caption md:grid">
                    <span>No.</span>
                    <span className="col-span-3">Project</span>
                    <span className="col-span-2">Role</span>
                    <span className="col-span-2">Stack</span>
                    <span className="text-right">Year</span>
                </div>
            )}
            <ol>
                {projects.map((project, i) => (
                    <li key={project.slug}>
                        <Link
                            href={show(project.slug)}
                            prefetch
                            className="group relative grid grid-cols-[2.25rem_1fr_auto] items-baseline gap-x-4 gap-y-2 border-b border-rule py-5 md:grid-cols-9 md:gap-x-6 md:py-6"
                        >
                            <span
                                aria-hidden
                                className="absolute inset-x-0 -bottom-px h-px origin-left scale-x-0 bg-signal transition-transform duration-500 ease-out group-hover:scale-x-100"
                            />
                            <span
                                className={cn(
                                    'caption',
                                    !detailed && 'md:col-span-2',
                                )}
                            >
                                {pad(i + 1)}
                            </span>
                            <span
                                className={cn(
                                    'text-xl leading-tight font-medium tracking-[-0.02em] transition-colors group-hover:text-signal md:text-[1.75rem]',
                                    'md:col-span-3',
                                )}
                            >
                                {project.title}
                                <span
                                    aria-hidden
                                    className="ml-2 inline-block -translate-x-1 opacity-0 transition duration-300 group-hover:translate-x-0 group-hover:opacity-100"
                                >
                                    →
                                </span>
                            </span>
                            <span className="text-right caption md:order-last">
                                {project.year}
                            </span>
                            {detailed ? (
                                <>
                                    <span className="col-span-2 col-start-2 text-sm text-muted-foreground md:col-span-2 md:col-start-auto md:text-[15px]">
                                        {project.role}
                                    </span>
                                    <span className="col-span-2 col-start-2 font-mono text-xs leading-5 text-muted-foreground md:col-span-2 md:col-start-auto">
                                        {project.stack.join(' / ')}
                                    </span>
                                </>
                            ) : (
                                <span className="col-span-2 col-start-2 max-w-[46ch] text-sm leading-snug text-muted-foreground md:col-span-3 md:col-start-auto md:text-[15px]">
                                    {project.summary}
                                </span>
                            )}
                        </Link>
                    </li>
                ))}
            </ol>
        </div>
    );
}
