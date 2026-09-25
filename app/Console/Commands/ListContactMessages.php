<?php

namespace App\Console\Commands;

use App\Models\ContactMessage;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;

#[Signature('contact:messages {--limit=20 : How many of the newest messages to show}')]
#[Description('Show the newest contact form messages')]
class ListContactMessages extends Command
{
    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $messages = ContactMessage::latest()->limit((int) $this->option('limit'))->get();

        if ($messages->isEmpty()) {
            $this->components->info('No messages yet.');

            return self::SUCCESS;
        }

        foreach ($messages as $message) {
            $this->components->twoColumnDetail(
                "<fg=gray>{$message->created_at?->toDateTimeString()}</> {$message->name} ({$message->email})",
                (string) $message->company,
            );
            $this->line('  '.$message->message);
            $this->newLine();
        }

        return self::SUCCESS;
    }
}
