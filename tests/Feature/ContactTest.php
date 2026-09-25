<?php

use App\Mail\ContactMessageReceived;
use App\Models\ContactMessage;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;

uses(RefreshDatabase::class);

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

test('a message is stored and emailed to the site owner', function () {
    $this->from(route('contact'))
        ->post(route('contact.store'), validMessage())
        ->assertRedirect(route('contact'))
        ->assertSessionHasNoErrors();

    $message = ContactMessage::sole();
    expect($message->email)->toBe('recruiter@example.com');

    Mail::assertSent(ContactMessageReceived::class, fn (ContactMessageReceived $mail) => $mail->hasTo('owner@example.test')
        && $mail->hasReplyTo('recruiter@example.com')
        && $mail->contactMessage->is($message));
});

test('a mail failure still keeps the message', function () {
    Mail::shouldReceive('to')->andThrow(new RuntimeException('Mail is down'));

    $this->post(route('contact.store'), validMessage())->assertSessionHasNoErrors();

    expect(ContactMessage::count())->toBe(1);
});

test('submissions that fill the honeypot are silently dropped', function () {
    $this->post(route('contact.store'), validMessage(['website' => 'https://spam.example']))
        ->assertRedirect()
        ->assertSessionHasNoErrors();

    expect(ContactMessage::count())->toBe(0);
    Mail::assertNothingSent();
});

test('invalid submissions are rejected', function (array $input, string $field) {
    $this->post(route('contact.store'), validMessage($input))->assertSessionHasErrors($field);

    expect(ContactMessage::count())->toBe(0);
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

    expect(ContactMessage::count())->toBe(3);
});
