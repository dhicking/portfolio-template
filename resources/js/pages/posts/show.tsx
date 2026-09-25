import { Link } from '@inertiajs/react';
import Seo from '@/components/seo';
import { longDate } from '@/lib/format';
import { index, show } from '@/routes/posts';
import type { Post } from '@/types';

type Neighbour = { slug: string; title: string } | null;

type Props = {
    post: Post;
    newer: Neighbour;
    older: Neighbour;
};

export default function PostShow({ post, newer, older }: Props) {
    return (
        <>
            <Seo title={post.title} description={post.summary} type="article" />

            <header className="frame pt-12 md:pt-20">
                <div className="flex justify-between gap-4 caption">
                    <Link
                        href={index()}
                        className="transition-colors hover:text-foreground"
                    >
                        ← Writing
                    </Link>
                    <span>{post.minutes} min read</span>
                </div>

                <div className="mt-10 grid-12 gap-y-6 md:mt-16">
                    <time
                        dateTime={post.date}
                        className="col-span-4 caption md:col-span-3 md:pt-3"
                    >
                        {longDate(post.date)}
                    </time>
                    <h1 className="col-span-4 text-[clamp(2.25rem,5.5vw,4.75rem)] leading-[0.95] font-medium tracking-[-0.045em] text-balance md:col-span-9">
                        {post.title}
                    </h1>
                </div>
            </header>

            <article className="frame grid-12 py-14 md:py-20">
                <div
                    className="prose-swiss col-span-4 md:col-span-7 md:col-start-4"
                    dangerouslySetInnerHTML={{ __html: post.body }}
                />
            </article>

            {(newer || older) && (
                <nav aria-label="More writing" className="frame">
                    <div className="grid-12 gap-y-8 border-t border-rule pt-4 pb-20">
                        <div className="col-span-4 md:col-span-4 md:col-start-4">
                            {older && (
                                <Link
                                    href={show(older.slug)}
                                    prefetch
                                    className="group block"
                                >
                                    <span className="caption">← Older</span>
                                    <span className="mt-2 block text-xl leading-snug font-medium tracking-[-0.01em] transition-colors group-hover:text-signal">
                                        {older.title}
                                    </span>
                                </Link>
                            )}
                        </div>
                        <div className="col-span-4 md:col-span-4 md:text-right">
                            {newer && (
                                <Link
                                    href={show(newer.slug)}
                                    prefetch
                                    className="group block"
                                >
                                    <span className="caption">Newer →</span>
                                    <span className="mt-2 block text-xl leading-snug font-medium tracking-[-0.01em] transition-colors group-hover:text-signal">
                                        {newer.title}
                                    </span>
                                </Link>
                            )}
                        </div>
                    </div>
                </nav>
            )}
        </>
    );
}
