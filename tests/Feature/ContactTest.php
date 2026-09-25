<?php

use App\Mail\ContactMessageReceived;
use Illuminate\Foundation\Http\Middleware\PreventRequestForgery;
use Illuminate\Support\Facades\Mail;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(fn () => Mail::fake());

function validMessage(array $overrides = []): array
{
    return [
        'name' => 'Recruiter',
        'email' => 'recruiter@example.com',
        'company' => 'Hiring Co',
        'message' => 'We have a role that looks like a good fit.',
        ...$overrides,
    ];
}

test('a message is emailed to the site owner', function () {
    $this->from(route('contact'))
        ->post(route('contact.store'), validMessage())
        ->assertRedirect(route('contact'))
        ->assertSessionHasNoErrors();

    Mail::assertSent(ContactMessageReceived::class, fn (ContactMessageReceived $mail) => $mail->hasTo('owner@example.test')
        && $mail->hasReplyTo('recruiter@example.com')
        && $mail->company === 'Hiring Co'
        && $mail->body === 'We have a role that looks like a good fit.');
});

test('a mail failure tells the visitor to email directly', function () {
    Mail::shouldReceive('to')->andThrow(new RuntimeException('Mail is down'));

    $this->post(route('contact.store'), validMessage())
        ->assertSessionHasErrors(['message' => 'Your message couldn’t be sent. Please email me directly at owner@example.test.']);
});

test('submissions that fill the honeypot are silently dropped', function () {
    $this->post(route('contact.store'), validMessage(['website' => 'https://spam.example']))
        ->assertRedirect()
        ->assertSessionHasNoErrors();

    Mail::assertNothingSent();
});

test('invalid submissions are rejected', function (array $input, string $field) {
    $this->post(route('contact.store'), validMessage($input))->assertSessionHasErrors($field);

    Mail::assertNothingSent();
})->with([
    'missing name' => [['name' => ''], 'name'],
    'bad email' => [['email' => 'not-an-email'], 'email'],
    'short message' => [['message' => 'hi'], 'message'],
]);

test('senders are limited to three messages every ten minutes', function () {
    foreach (range(1, 3) as $attempt) {
        $this->post(route('contact.store'), validMessage())->assertSessionHasNoErrors();
    }

    $this->post(route('contact.store'), validMessage())->assertSessionHasErrors('message');

    Mail::assertSentCount(3);
});

test('in production the form is hidden until a real mailer is configured', function () {
    app()->detectEnvironment(fn () => 'production');
    config(['mail.default' => 'log']);

    $this->get(route('contact'))
        ->assertInertia(fn (Assert $page) => $page->where('formEnabled', false));
    $this->withoutMiddleware(PreventRequestForgery::class)
        ->post(route('contact.store'), validMessage())
        ->assertNotFound();

    config(['mail.default' => 'resend']);

    $this->get(route('contact'))
        ->assertInertia(fn (Assert $page) => $page->where('formEnabled', true));
});

test('the notification email shows the sender and their message', function () {
    (new ContactMessageReceived('Recruiter', 'recruiter@example.com', 'Hiring Co', 'We have a role that looks like a good fit.'))
        ->assertHasSubject('New message from Recruiter')
        ->assertSeeInText('recruiter@example.com · Hiring Co')
        ->assertSeeInText('We have a role that looks like a good fit.');
});
