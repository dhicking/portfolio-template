---
title: cadence
summary: A small PHP library for recurring schedules ("every second Tuesday, except holidays"). 40k installs, zero dependencies.
year: 2022
role: Author & maintainer
stack: [PHP 8.3, Pest, GitHub Actions]
featured: true
order: 2
links:
  - label: GitHub
    url: https://github.com/
  - label: Packagist
    url: https://packagist.org/
---

## Why it exists

Every booking product I worked on needed recurring appointments, and every
one of them handled daylight-saving transitions differently, usually
wrongly. `cadence` is the version I wished I'd had.

```php
$schedule = Cadence::every(2)->weeks()
    ->on(Weekday::Tuesday)
    ->at('09:30', 'Europe/Amsterdam')
    ->except(Holidays::netherlands());

$schedule->between($start, $end); // CarbonImmutable[]
```

## Design choices

- **Immutable everywhere.** Every modifier returns a new schedule.
- **Time zones are required, not optional.** Most bugs I've seen came from
  a missing zone.
- **No dependencies** beyond Carbon, which every Laravel app already has.

## Maintenance

I release roughly monthly, answer issues within a week, and keep a
changelog written for people rather than for machines.
