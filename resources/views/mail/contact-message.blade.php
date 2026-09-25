<x-mail::message>
# {{ $contactMessage->name }}

{{ $contactMessage->email }}@if ($contactMessage->company) · {{ $contactMessage->company }}@endif


<x-mail::panel>
{{ $contactMessage->message }}
</x-mail::panel>

Reply to this email to answer {{ $contactMessage->name }} directly.
</x-mail::message>
