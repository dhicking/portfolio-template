---
title: What I learned moving a queue off cron
summary: Three things that broke when we switched carrier imports from a nightly job to webhooks, and what fixed them.
date: 2026-05-12
---

For four years, our carrier invoices arrived once a night. When we moved
to webhooks, the work was spread across the day instead, and three
assumptions we didn't know we had stopped holding.

## 1. "It runs once" was load-bearing

The nightly job never had to worry about duplicates, because it only ran
once. Webhooks retry. Our first week produced eleven double-billed
invoices before we added idempotency keys.

```php
$key = hash('xxh128', $carrier->id.'|'.$payload['event_id']);
```

## 2. Ordering is not guaranteed

A `shipment.delivered` event occasionally arrived before `shipment.picked_up`.
We stopped treating events as instructions and started treating them as
facts. Each handler now checks the current state before it changes
anything.

## 3. Nobody was watching the queue

With cron, a failure meant an empty report in the morning. With queues,
a failure meant a job quietly sitting in `failed_jobs`. We added a daily
count to the team channel. It's boring, and it's the most useful alert we
have.
