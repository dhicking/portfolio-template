---
title: Deferred props in practice
summary: Where Inertia's deferred props made our booking page faster, and the one place they made it worse.
date: 2026-02-03
---

Deferred props let a page render before its slowest data arrives. On the
booking page they took about 400ms off first paint.

```php
return Inertia::render('booking/show', [
    'clinic' => $clinic,
    'therapists' => Inertia::defer(fn () => $clinic->therapists()->with('bio')->get()),
]);
```

The one place they hurt was the availability grid. Users would click a
date before it loaded, and the layout jumped underneath them. We moved it
back to a regular prop. The page got 90ms slower and the complaints
stopped.

The rule we landed on: defer what people **look at**, not what they
**click**.
