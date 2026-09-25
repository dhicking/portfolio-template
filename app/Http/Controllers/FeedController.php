<?php

namespace App\Http\Controllers;

use App\Content\Portfolio;
use Illuminate\Http\Response;

class FeedController extends Controller
{
    public function __invoke(Portfolio $portfolio): Response
    {
        return response()
            ->view('feed', [
                'site' => $portfolio->site(),
                'posts' => $portfolio->posts()->take(20),
            ])
            ->header('Content-Type', 'application/rss+xml; charset=UTF-8');
    }
}
