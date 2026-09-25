<?php

use Illuminate\Support\Facades\DB;
use Inertia\Testing\AssertableInertia as Assert;

test('home shows featured projects and recent posts', function () {
    $this->get(route('home'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('home')
            ->where('site.name', 'Test Person')
            ->has('projects', 1)
            ->where('projects.0.slug', 'alpha')
            ->missing('projects.0.body')
            ->where('posts.0.slug', 'draft-post'),
        );
});

test('work index lists every project in order', function () {
    $this->get(route('projects.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('projects/index')
            ->where('projects.0.slug', 'alpha')
            ->where('projects.1.slug', 'beta'),
        );
});

test('project page renders markdown and links to the next project', function () {
    $this->get(route('projects.show', 'alpha'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('projects/show')
            ->where('number', 1)
            ->where('next.slug', 'beta')
            ->where('project.body', fn (string $body) => str_contains($body, '<strong>body</strong>') && str_contains($body, 'data-lang="php"')),
        );
});

test('unknown project and post slugs return 404', function () {
    $this->get(route('projects.show', 'missing'))->assertNotFound();
    $this->get(route('posts.show', 'missing'))->assertNotFound();
});

test('post page links to older and newer posts', function () {
    $this->get(route('posts.show', 'published-post'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('posts/show')
            ->where('newer.slug', 'draft-post')
            ->where('older', null),
        );
});

test('drafts are hidden in production', function () {
    app()->detectEnvironment(fn () => 'production');

    $this->get(route('posts.show', 'draft-post'))->assertNotFound();
    $this->get(route('feed'))->assertOk()->assertDontSee('Draft post');
});

test('about page renders profile sections', function () {
    $this->get(route('about'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('about')
            ->where('about', '<p>Fixture <strong>about</strong> text.</p>')
            ->has('experience', 1)
            ->has('education', 0),
        );
});

test('feed and sitemap are valid xml', function (string $route, string $type) {
    $response = $this->get(route($route))->assertOk();

    expect($response->headers->get('Content-Type'))->toContain($type)
        ->and(simplexml_load_string($response->getContent()))->not->toBeFalse();
})->with([
    ['feed', 'application/rss+xml'],
    ['sitemap', 'application/xml'],
]);

test('page views never touch the database', function () {
    DB::listen(fn ($query) => throw new RuntimeException("Unexpected query: {$query->sql}"));

    foreach (['home', 'projects.index', 'posts.index', 'about', 'contact', 'feed', 'sitemap'] as $route) {
        $this->get(route($route))->assertOk();
    }

    $this->get(route('projects.show', 'alpha'))->assertOk();
    $this->get(route('posts.show', 'published-post'))->assertOk();
});
