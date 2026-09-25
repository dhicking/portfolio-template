<?php

use Tests\TestCase;

/*
|--------------------------------------------------------------------------
| Test Case
|--------------------------------------------------------------------------
|
| Feature tests run against the application's TestCase, which also points
| the content repository at tests/Fixtures/content.
|
*/

pest()->extend(TestCase::class)->in('Feature');
