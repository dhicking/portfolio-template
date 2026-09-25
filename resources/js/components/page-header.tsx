import type { ReactNode } from 'react';

type Props = {
    eyebrow: ReactNode;
    title: string;
    children?: ReactNode;
};

export default function PageHeader({ eyebrow, title, children }: Props) {
    return (
        <header className="frame pt-12 pb-14 md:pt-20 md:pb-24">
            <div className="flex justify-between gap-4 caption">{eyebrow}</div>
            <h1 className="mt-6 max-w-[16ch] text-[clamp(3rem,9vw,8.5rem)] leading-[0.88] font-medium tracking-[-0.05em] text-balance md:-ml-[0.05em]">
                {title}
            </h1>
            {children}
        </header>
    );
}
