import { Link, usePage } from '@inertiajs/react';
import Availability from '@/components/availability';
import LocalTime from '@/components/local-time';
import PostList from '@/components/post-list';
import ProjectList from '@/components/project-list';
import Section from '@/components/section';
import Seo from '@/components/seo';
import { index as posts } from '@/routes/posts';
import { index as projects } from '@/routes/projects';
import type { PostSummary, ProjectSummary } from '@/types';

type Props = {
    intro: string;
    projects: ProjectSummary[];
    posts: PostSummary[];
};

export default function Home({
    intro,
    projects: featured,
    posts: recent,
}: Props) {
    const { site } = usePage().props;
    const words = site.name.split(' ');

    return (
        <>
            <Seo />

            <section className="frame pt-12 pb-20 md:pt-20 md:pb-32">
                <h1 className="text-[27vw] leading-[0.8] font-medium tracking-[-0.06em] md:-ml-[0.06em] md:text-[21vw] 2xl:text-[19rem]">
                    {words.length <= 3
                        ? words.map((word) => (
                              <span key={word} className="block">
                                  {word}
                              </span>
                          ))
                        : site.name}
                </h1>

                <div className="mt-14 grid-12 gap-y-12 md:mt-24">
                    <dl className="col-span-4 grid grid-cols-2 gap-x-4 gap-y-5 self-start md:col-span-3 md:grid-cols-1">
                        <div>
                            <dt className="caption">Role</dt>
                            <dd className="mt-1">{site.role}</dd>
                        </div>
                        <div>
                            <dt className="caption">Based in</dt>
                            <dd className="mt-1">{site.location}</dd>
                        </div>
                        <div>
                            <dt className="caption">Local time</dt>
                            <dd className="mt-1">
                                <LocalTime timezone={site.timezone} />
                            </dd>
                        </div>
                    </dl>

                    <div className="col-span-4 md:col-span-8 md:col-start-5">
                        <p className="text-[1.625rem] leading-[1.18] tracking-[-0.02em] text-pretty md:text-[2.375rem]">
                            {intro}
                        </p>
                        <Availability className="mt-10 max-w-lg" />
                    </div>
                </div>
            </section>

            <Section
                index="01"
                label="Selected work"
                aside={
                    <Link
                        href={projects()}
                        className="caption text-foreground transition-colors hover:text-signal"
                    >
                        All work →
                    </Link>
                }
            >
                <ProjectList projects={featured} />
            </Section>

            {recent.length > 0 && (
                <Section
                    index="02"
                    label="Writing"
                    aside={
                        <Link
                            href={posts()}
                            className="caption text-foreground transition-colors hover:text-signal"
                        >
                            All posts →
                        </Link>
                    }
                >
                    <PostList posts={recent} />
                </Section>
            )}
        </>
    );
}
