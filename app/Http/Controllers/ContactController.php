<?php

namespace App\Http\Controllers;

use App\Content\Portfolio;
use App\Http\Requests\StoreContactMessageRequest;
use App\Mail\ContactMessageReceived;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use Inertia\Response;
use Throwable;

class ContactController extends Controller
{
    public function show(Portfolio $portfolio): Response
    {
        return Inertia::render('contact', [
            'note' => $portfolio->site()['contact_note'] ?? null,
            'formEnabled' => $this->formEnabled(),
        ]);
    }

    public function store(StoreContactMessageRequest $request, Portfolio $portfolio): RedirectResponse
    {
        abort_unless($this->formEnabled(), 404);

        if ($request->isSpam()) {
            return back();
        }

        $owner = $portfolio->site()['email'];
        $input = $request->safe();

        try {
            Mail::to($owner)->send(new ContactMessageReceived(
                senderName: $input->string('name')->toString(),
                senderEmail: $input->string('email')->toString(),
                company: $input->input('company'),
                body: $input->string('message')->toString(),
            ));
        } catch (Throwable $e) {
            // Email is the only copy of the message, so tell the visitor instead of pretending it arrived.
            report($e);

            return back()->withErrors([
                'message' => "Your message couldn’t be sent. Please email me directly at {$owner}.",
            ]);
        }

        return back();
    }

    /**
     * Messages are only delivered by email, so in production the form stays
     * hidden until a real mailer (such as Resend) is configured.
     */
    private function formEnabled(): bool
    {
        return ! app()->isProduction()
            || ! in_array(config('mail.default'), ['log', 'array'], true);
    }
}
