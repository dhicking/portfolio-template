<?php

namespace App\Http\Controllers;

use App\Content\Portfolio;
use Illuminate\Http\Response;

class SitemapController extends Controller
{
    public function __invoke(Portfolio $portfolio): Response
    {
        $urls = collect([route('home'), route('projects.index'), route('posts.index'), route('about'), route('contact')])
            ->merge($portfolio->projects()->map(fn (array $project): string => route('projects.show', $project['slug'])))
            ->merge($portfolio->posts()->map(fn (array $post): string => route('posts.show', $post['slug'])));

        return response()
            ->view('sitemap', ['urls' => $urls])
            ->header('Content-Type', 'application/xml; charset=UTF-8');
    }
}
