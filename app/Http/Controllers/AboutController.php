<?php

namespace App\Http\Controllers;

use App\Content\Portfolio;
use Illuminate\Support\Arr;
use Inertia\Inertia;
use Inertia\Response;

class AboutController extends Controller
{
    public function __invoke(Portfolio $portfolio): Response
    {
        return Inertia::render('about', Arr::only($portfolio->site(), [
            'about', 'skills', 'experience', 'education',
        ]) + ['skills' => [], 'experience' => [], 'education' => []]);
    }
}
