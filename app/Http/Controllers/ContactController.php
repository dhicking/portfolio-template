<?php

namespace App\Http\Controllers;

use App\Content\Portfolio;
use App\Http\Requests\StoreContactMessageRequest;
use App\Mail\ContactMessageReceived;
use App\Models\ContactMessage;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use Inertia\Response;
use Throwable;

use function Illuminate\Support\defer;

class ContactController extends Controller
{
    public function show(Portfolio $portfolio): Response
    {
        return Inertia::render('contact', [
            'note' => $portfolio->site()['contact_note'] ?? null,
        ]);
    }

    public function store(StoreContactMessageRequest $request, Portfolio $portfolio): RedirectResponse
    {
        if ($request->isSpam()) {
            return back();
        }

        $message = ContactMessage::create($request->safe()->only(['name', 'email', 'company', 'message']));

        // Sent after the response so the visitor never waits on the mail API. The
        // message is already stored, so a mail outage is reported, not surfaced.
        defer(function () use ($portfolio, $message): void {
            try {
                Mail::to($portfolio->site()['email'])->send(new ContactMessageReceived($message));
            } catch (Throwable $e) {
                report($e);
            }
        });

        return back();
    }
}
