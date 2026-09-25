<?php

namespace App\Http\Controllers;

use App\Content\Portfolio;
use Inertia\Inertia;
use Inertia\Response;

class PostController extends Controller
{
    public function index(Portfolio $portfolio): Response
    {
        return Inertia::render('posts/index', [
            'posts' => $portfolio->posts()
                ->map(fn (array $post): array => collect($post)->except('body')->all()),
        ]);
    }

    public function show(Portfolio $portfolio, string $slug): Response
    {
        $post = $portfolio->post($slug) ?? abort(404);

        $posts = $portfolio->posts()->values();
        $index = $posts->search(fn (array $item): bool => $item['slug'] === $slug);

        return Inertia::render('posts/show', [
            'post' => $post,
            'newer' => $index > 0 ? collect($posts->get($index - 1))->only(['slug', 'title'])->all() : null,
            'older' => collect($posts->get($index + 1))->only(['slug', 'title'])->all() ?: null,
        ]);
    }
}
