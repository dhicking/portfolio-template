<?php

namespace App\Http\Controllers;

use App\Content\Portfolio;
use Inertia\Inertia;
use Inertia\Response;

class ProjectController extends Controller
{
    public function index(Portfolio $portfolio): Response
    {
        return Inertia::render('projects/index', [
            'projects' => $portfolio->projects()
                ->map(fn (array $project): array => collect($project)->except('body')->all()),
        ]);
    }

    public function show(Portfolio $portfolio, string $slug): Response
    {
        $project = $portfolio->project($slug) ?? abort(404);

        $projects = $portfolio->projects()->values();
        $index = $projects->search(fn (array $item): bool => $item['slug'] === $slug);
        $next = $projects->get(($index + 1) % $projects->count());

        return Inertia::render('projects/show', [
            'project' => $project,
            'number' => $index + 1,
            'next' => $next['slug'] === $slug ? null : collect($next)->only(['slug', 'title'])->all(),
        ]);
    }
}
