<?php

namespace App\Content;

use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;
use League\CommonMark\Environment\Environment;
use League\CommonMark\Extension\CommonMark\CommonMarkCoreExtension;
use League\CommonMark\Extension\FrontMatter\FrontMatterExtension;
use League\CommonMark\Extension\FrontMatter\Output\RenderedContentWithFrontMatter;
use League\CommonMark\Extension\GithubFlavoredMarkdownExtension;
use League\CommonMark\MarkdownConverter;
use Symfony\Component\Yaml\Yaml;
use Tempest\Highlight\CommonMark\HighlightExtension;

/**
 * Reads the portfolio content from the `content/` directory.
 *
 * Parsed content is cached on the local filesystem (never the database), keyed
 * by the modification time of every content file, so edits show up instantly
 * in development and page views never wake a sleeping database in production.
 */
class Portfolio
{
    private ?MarkdownConverter $converter = null;

    public function __construct(private string $path) {}

    /**
     * @return array<string, mixed>
     */
    public function site(): array
    {
        return $this->load()['site'];
    }

    /**
     * @return Collection<int, array<string, mixed>>
     */
    public function projects(): Collection
    {
        return collect($this->load()['projects']);
    }

    /**
     * @return array<string, mixed>|null
     */
    public function project(string $slug): ?array
    {
        return $this->projects()->firstWhere('slug', $slug);
    }

    /**
     * @return Collection<int, array<string, mixed>>
     */
    public function posts(): Collection
    {
        return collect($this->load()['posts'])
            ->reject(fn (array $post): bool => $post['draft'] && app()->isProduction())
            ->values();
    }

    /**
     * @return array<string, mixed>|null
     */
    public function post(string $slug): ?array
    {
        return $this->posts()->firstWhere('slug', $slug);
    }

    /**
     * @return array{site: array<string, mixed>, projects: array<int, array<string, mixed>>, posts: array<int, array<string, mixed>>}
     */
    private function load(): array
    {
        return once(fn (): array => Cache::store('file')->rememberForever(
            'portfolio.'.$this->fingerprint(),
            fn (): array => [
                'site' => $this->parseSite(),
                'projects' => $this->parseProjects(),
                'posts' => $this->parsePosts(),
            ],
        ));
    }

    private function fingerprint(): string
    {
        $files = glob($this->path.'/{*.yaml,projects/*.md,posts/*.md}', GLOB_BRACE) ?: [];

        return md5(collect($files)->map(fn (string $file): string => $file.filemtime($file))->implode('|'));
    }

    /**
     * @return array<string, mixed>
     */
    private function parseSite(): array
    {
        $site = Yaml::parseFile($this->path.'/site.yaml');

        $site['about'] = $this->markdown($site['about'] ?? '');

        return $site;
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private function parseProjects(): array
    {
        return collect(glob($this->path.'/projects/*.md') ?: [])
            ->map(function (string $file): array {
                [$meta, $html] = $this->document($file);

                return [
                    'slug' => pathinfo($file, PATHINFO_FILENAME),
                    'title' => $meta['title'],
                    'summary' => $meta['summary'] ?? '',
                    'year' => (string) ($meta['year'] ?? ''),
                    'role' => $meta['role'] ?? null,
                    'stack' => $meta['stack'] ?? [],
                    'links' => $meta['links'] ?? [],
                    'image' => $meta['image'] ?? null,
                    'image_alt' => $meta['image_alt'] ?? '',
                    'featured' => (bool) ($meta['featured'] ?? false),
                    'order' => (int) ($meta['order'] ?? 100),
                    'body' => $html,
                ];
            })
            ->sortBy([['order', 'asc'], ['year', 'desc']])
            ->values()
            ->all();
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private function parsePosts(): array
    {
        return collect(glob($this->path.'/posts/*.md') ?: [])
            ->map(function (string $file): array {
                [$meta, $html] = $this->document($file);

                return [
                    'slug' => pathinfo($file, PATHINFO_FILENAME),
                    'title' => $meta['title'],
                    'summary' => $meta['summary'] ?? '',
                    'date' => Carbon::parse($meta['date'])->toDateString(),
                    'draft' => (bool) ($meta['draft'] ?? false),
                    'minutes' => max(1, (int) round(str_word_count(strip_tags($html)) / 230)),
                    'body' => $html,
                ];
            })
            ->sortByDesc('date')
            ->values()
            ->all();
    }

    /**
     * @return array{0: array<string, mixed>, 1: string}
     */
    private function document(string $file): array
    {
        $result = $this->converter()->convert(File::get($file));

        $meta = $result instanceof RenderedContentWithFrontMatter ? $result->getFrontMatter() : [];

        return [$meta ?? [], (string) $result];
    }

    private function markdown(string $markdown): string
    {
        return Str::of((string) $this->converter()->convert($markdown))->trim()->toString();
    }

    private function converter(): MarkdownConverter
    {
        if ($this->converter) {
            return $this->converter;
        }

        $environment = new Environment([
            'html_input' => 'allow',
            'allow_unsafe_links' => false,
        ]);

        $environment->addExtension(new CommonMarkCoreExtension);
        $environment->addExtension(new GithubFlavoredMarkdownExtension);
        $environment->addExtension(new FrontMatterExtension);
        $environment->addExtension(new HighlightExtension);

        return $this->converter = new MarkdownConverter($environment);
    }
}
