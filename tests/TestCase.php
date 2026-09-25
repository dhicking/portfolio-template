<?php

namespace Tests;

use App\Content\Portfolio;
use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

abstract class TestCase extends BaseTestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        // Tests read fixed fixture content, so editing content/ never breaks the suite.
        $this->app->singleton(Portfolio::class, fn (): Portfolio => new Portfolio(base_path('tests/Fixtures/content')));
    }
}
