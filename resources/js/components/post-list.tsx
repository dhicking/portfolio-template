import { Link } from '@inertiajs/react';
import { show } from '@/routes/posts';
import type { PostSummary } from '@/types';

export default function PostList({ posts }: { posts: PostSummary[] }) {
    if (posts.length === 0) {
        return <p className="text-muted-foreground">Nothing published yet.</p>;
    }

    return (
        <ol>
            {posts.map((post) => (
                <li key={post.slug}>
                    <Link
                        href={show(post.slug)}
                        prefetch
                        className="group grid grid-cols-4 items-baseline gap-x-4 gap-y-1 border-b border-rule py-5 md:grid-cols-9 md:gap-x-6"
                    >
                        <time
                            dateTime={post.date}
                            className="col-span-3 caption md:col-span-2"
                        >
                            {post.date}
                        </time>
                        <span className="text-right caption md:order-last md:col-span-2">
                            {post.minutes} min
                        </span>
                        <span className="col-span-4 md:col-span-5">
                            <span className="block text-lg leading-snug font-medium tracking-[-0.01em] transition-colors group-hover:text-signal md:text-xl">
                                {post.title}
                            </span>
                            <span className="mt-1 block max-w-[56ch] text-[15px] leading-snug text-muted-foreground">
                                {post.summary}
                            </span>
                        </span>
                    </Link>
                </li>
            ))}
        </ol>
    );
}
