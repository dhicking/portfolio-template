---
title: Clinic booking flow
summary: Rebuilt a five-step booking wizard as a single Inertia page. Median time-to-book dropped from 3m10s to 1m05s.
year: 2022
role: Full-stack developer
stack: [Laravel, Inertia, React, Tailwind]
featured: true
order: 3
---

## Context

Kliniekplan's patients booked physiotherapy through a five-page wizard with
a full reload on every step. Around a third of them abandoned at the
"choose a therapist" step.

## Approach

I rebuilt the flow as one Inertia page using partial reloads, so choosing a
date only re-fetched the availability grid. Therapist photos and bios
moved to deferred props, so the first paint no longer waited on them.

## Outcome

- Median time-to-book: **3m10s → 1m05s**
- Abandonment at step two: **34% → 12%**
- No new infrastructure. The same Laravel app, the same database.
