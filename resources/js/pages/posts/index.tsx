import PageHeader from '@/components/page-header';
import PostList from '@/components/post-list';
import Seo from '@/components/seo';
import { feed } from '@/routes';
import type { PostSummary } from '@/types';

export default function PostsIndex({ posts }: { posts: PostSummary[] }) {
    return (
        <>
            <Seo
                title="Writing"
                description="Notes on backend work, queues and the web."
            />

            <PageHeader
                eyebrow={
                    <>
                        <span>Notes & essays</span>
                        <a
                            href={feed().url}
                            className="transition-colors hover:text-foreground"
                        >
                            RSS ↗
                        </a>
                    </>
                }
                title="Writing"
            />

            <section className="frame pb-24 md:pb-32">
                <div className="border-t border-rule">
                    <PostList posts={posts} />
                </div>
            </section>
        </>
    );
}
