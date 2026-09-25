import PageHeader from '@/components/page-header';
import ProjectList from '@/components/project-list';
import Seo from '@/components/seo';
import { pad } from '@/lib/format';
import type { ProjectSummary } from '@/types';

export default function ProjectsIndex({
    projects,
}: {
    projects: ProjectSummary[];
}) {
    return (
        <>
            <Seo
                title="Work"
                description="Selected projects and case studies."
            />

            <PageHeader
                eyebrow={
                    <>
                        <span>Index</span>
                        <span>{pad(projects.length)} projects</span>
                    </>
                }
                title="Work"
            />

            <section className="frame pb-24 md:pb-32">
                <ProjectList projects={projects} detailed />
            </section>
        </>
    );
}
