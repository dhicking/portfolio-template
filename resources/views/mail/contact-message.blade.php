<x-mail::message>
# {{ $senderName }}

{{ $senderEmail }}@if ($company) · {{ $company }}@endif


<x-mail::panel>
{{ $body }}
</x-mail::panel>

Reply to this email to answer {{ $senderName }} directly.
</x-mail::message>
