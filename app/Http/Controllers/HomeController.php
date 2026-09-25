<?php

namespace App\Http\Controllers;

use App\Content\Portfolio;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function __invoke(Portfolio $portfolio): Response
    {
        return Inertia::render('home', [
            'intro' => $portfolio->site()['intro'] ?? '',
            'projects' => $portfolio->projects()
                ->where('featured', true)
                ->map(fn (array $project): array => collect($project)->except('body')->all())
                ->values(),
            'posts' => $portfolio->posts()
                ->take(3)
                ->map(fn (array $post): array => collect($post)->except('body')->all()),
        ]);
    }
}
