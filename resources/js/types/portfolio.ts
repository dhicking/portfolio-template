export type ExternalLink = {
    label: string;
    url: string;
};

export type Site = {
    name: string;
    role: string;
    location: string;
    timezone: string;
    email: string;
    description?: string;
    availability?: { open: boolean; note?: string };
    links: ExternalLink[];
    resume?: string | null;
};

export type ProjectSummary = {
    slug: string;
    title: string;
    summary: string;
    year: string;
    role: string | null;
    stack: string[];
    links: ExternalLink[];
    image: string | null;
    image_alt: string;
    featured: boolean;
};

export type Project = ProjectSummary & { body: string };

export type PostSummary = {
    slug: string;
    title: string;
    summary: string;
    date: string;
    minutes: number;
};

export type Post = PostSummary & { body: string };

export type Position = {
    company: string;
    role: string;
    location?: string;
    start: string | number;
    end: string | number | null;
    summary?: string;
    highlights?: string[];
};

export type SkillGroup = {
    group: string;
    items: string[];
};

export type Education = {
    school: string;
    degree: string;
    start?: string | number;
    end?: string | number;
};
