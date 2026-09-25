---
title: Carrier invoice sync
summary: Moved a freight broker's carrier invoicing from nightly CSV imports to webhooks, cutting monthly invoice disputes by 85%.
year: 2024
role: Lead engineer
stack: [Laravel, MySQL, SQS, Pest]
featured: true
order: 1
links:
  - label: Write-up
    url: /writing/moving-a-queue-off-cron
---

## The problem

Havenlijn paid around 120 carriers. Every night, a cron job pulled a CSV
from each carrier's SFTP server and matched rows against shipments. When a
file was late, malformed or silently truncated, invoices went out wrong and
finance spent the next week on the phone.

## What I did

- Added webhook endpoints for the eleven carriers that supported them,
  covering 70% of volume.
- Put every inbound event on a queue with an idempotency key, so a carrier
  retrying a webhook could never double-bill.
- Kept the CSV path for the remaining carriers, but made it validate row
  counts against a checksum file before touching any data.

```php
public function handle(CarrierEvent $event): void
{
    if (ProcessedEvent::where('key', $event->idempotencyKey())->exists()) {
        return;
    }

    DB::transaction(function () use ($event) {
        $this->ledger->apply($event);
        ProcessedEvent::create(['key' => $event->idempotencyKey()]);
    });
}
```

## Result

Disputes went from roughly 40 a month to 6. Finance stopped reconciling by
hand, and the nightly job now handles only a small tail of carriers.
