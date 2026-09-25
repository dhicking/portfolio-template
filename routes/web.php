<?php

use App\Http\Controllers\AboutController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\FeedController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\SitemapController;
use Illuminate\Support\Facades\Route;

Route::get('/', HomeController::class)->name('home');

Route::get('/work', [ProjectController::class, 'index'])->name('projects.index');
Route::get('/work/{slug}', [ProjectController::class, 'show'])->name('projects.show');

Route::get('/writing', [PostController::class, 'index'])->name('posts.index');
Route::get('/writing/{slug}', [PostController::class, 'show'])->name('posts.show');

Route::get('/about', AboutController::class)->name('about');

Route::get('/contact', [ContactController::class, 'show'])->name('contact');
Route::post('/contact', [ContactController::class, 'store'])
    ->middleware('throttle:contact')
    ->name('contact.store');

Route::get('/feed.xml', FeedController::class)->name('feed');
Route::get('/sitemap.xml', SitemapController::class)->name('sitemap');
