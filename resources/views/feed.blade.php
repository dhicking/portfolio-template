{!! '<'.'?xml version="1.0" encoding="UTF-8"?'.'>' !!}
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
    <channel>
        <title>{{ $site['name'] }} — Writing</title>
        <link>{{ route('posts.index') }}</link>
        <description>{{ $site['role'] ?? '' }}</description>
        <language>{{ str_replace('_', '-', app()->getLocale()) }}</language>
        <atom:link href="{{ route('feed') }}" rel="self" type="application/rss+xml" />
        @foreach ($posts as $post)
            <item>
                <title>{{ $post['title'] }}</title>
                <link>{{ route('posts.show', $post['slug']) }}</link>
                <guid isPermaLink="true">{{ route('posts.show', $post['slug']) }}</guid>
                <pubDate>{{ \Illuminate\Support\Carbon::parse($post['date'])->toRssString() }}</pubDate>
                <description><![CDATA[{!! $post['body'] !!}]]></description>
            </item>
        @endforeach
    </channel>
</rss>
