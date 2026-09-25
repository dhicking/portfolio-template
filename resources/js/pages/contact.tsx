import { Form, usePage } from '@inertiajs/react';
import InputError from '@/components/input-error';
import LocalTime from '@/components/local-time';
import PageHeader from '@/components/page-header';
import Section from '@/components/section';
import Seo from '@/components/seo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { store } from '@/routes/contact';

const field =
    'h-12 border-0 border-b border-input bg-transparent px-0 text-base shadow-none focus-visible:border-signal focus-visible:ring-0 dark:bg-transparent';

export default function Contact({ note }: { note: string | null }) {
    const { site } = usePage().props;

    return (
        <>
            <Seo
                title="Contact"
                description={`Get in touch with ${site.name}.`}
            />

            <PageHeader eyebrow={<span>Enquiries</span>} title="Contact" />

            <Section index="01" label="Write">
                <div className="grid gap-y-14 md:grid-cols-9 md:gap-x-6">
                    <div className="md:col-span-3">
                        {note && (
                            <p className="text-lg leading-snug text-pretty">
                                {note}
                            </p>
                        )}
                        <dl className="mt-10 space-y-5">
                            <div>
                                <dt className="caption text-[0.6875rem] font-normal">
                                    Email
                                </dt>
                                <dd className="mt-1">
                                    <a
                                        href={`mailto:${site.email}`}
                                        className="underline decoration-signal underline-offset-4 hover:text-signal"
                                    >
                                        {site.email}
                                    </a>
                                </dd>
                            </div>
                            <div>
                                <dt className="caption text-[0.6875rem] font-normal">
                                    Local time
                                </dt>
                                <dd className="mt-1">
                                    <LocalTime timezone={site.timezone} /> in{' '}
                                    {site.location}
                                </dd>
                            </div>
                        </dl>
                    </div>

                    <Form
                        {...store.form()}
                        resetOnSuccess
                        options={{ preserveScroll: true }}
                        className="md:col-span-6"
                    >
                        {({ errors, processing, wasSuccessful }) =>
                            wasSuccessful ? (
                                <div
                                    className="border-t-2 border-signal pt-5"
                                    role="status"
                                >
                                    <p className="text-2xl font-medium tracking-[-0.02em]">
                                        Message sent.
                                    </p>
                                    <p className="mt-2 text-muted-foreground">
                                        Thanks — I’ll reply to the address you
                                        gave.
                                    </p>
                                </div>
                            ) : (
                                <div className="grid gap-x-6 gap-y-8 sm:grid-cols-2">
                                    <div>
                                        <Label
                                            htmlFor="name"
                                            className="caption text-[0.6875rem] font-normal"
                                        >
                                            Name
                                        </Label>
                                        <Input
                                            id="name"
                                            name="name"
                                            required
                                            autoComplete="name"
                                            className={field}
                                            aria-invalid={!!errors.name}
                                        />
                                        <InputError
                                            message={errors.name}
                                            className="mt-2 text-signal dark:text-signal"
                                        />
                                    </div>
                                    <div>
                                        <Label
                                            htmlFor="email"
                                            className="caption text-[0.6875rem] font-normal"
                                        >
                                            Email
                                        </Label>
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            required
                                            autoComplete="email"
                                            className={field}
                                            aria-invalid={!!errors.email}
                                        />
                                        <InputError
                                            message={errors.email}
                                            className="mt-2 text-signal dark:text-signal"
                                        />
                                    </div>
                                    <div className="sm:col-span-2">
                                        <Label
                                            htmlFor="company"
                                            className="caption text-[0.6875rem] font-normal"
                                        >
                                            Company{' '}
                                            <span className="normal-case">
                                                (optional)
                                            </span>
                                        </Label>
                                        <Input
                                            id="company"
                                            name="company"
                                            autoComplete="organization"
                                            className={field}
                                        />
                                    </div>
                                    <div className="sm:col-span-2">
                                        <Label
                                            htmlFor="message"
                                            className="caption text-[0.6875rem] font-normal"
                                        >
                                            Message
                                        </Label>
                                        <Textarea
                                            id="message"
                                            name="message"
                                            required
                                            rows={6}
                                            className={`${field} h-auto min-h-40 resize-y py-3`}
                                            aria-invalid={!!errors.message}
                                        />
                                        <InputError
                                            message={errors.message}
                                            className="mt-2 text-signal dark:text-signal"
                                        />
                                    </div>

                                    {/* Honeypot: hidden from people, irresistible to bots. */}
                                    <div
                                        aria-hidden
                                        className="absolute -left-[9999px]"
                                    >
                                        <label htmlFor="website">Website</label>
                                        <input
                                            id="website"
                                            name="website"
                                            type="text"
                                            tabIndex={-1}
                                            autoComplete="off"
                                        />
                                    </div>

                                    <div className="sm:col-span-2">
                                        <Button
                                            type="submit"
                                            disabled={processing}
                                            className="h-12 px-7 text-[15px] hover:bg-signal"
                                        >
                                            {processing
                                                ? 'Sending…'
                                                : 'Send message →'}
                                        </Button>
                                    </div>
                                </div>
                            )
                        }
                    </Form>
                </div>
            </Section>
        </>
    );
}
