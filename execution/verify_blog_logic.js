const assert = require('node:assert/strict');

function textFromHtml(html) {
    return html
        .replace(/<script[\s\S]*?<\/script>/gi, ' ')
        .replace(/<style[\s\S]*?<\/style>/gi, ' ')
        .replace(/<[^>]+>/g, ' ')
        .replace(/&nbsp;/gi, ' ')
        .replace(/&amp;/gi, '&')
        .replace(/&lt;/gi, '<')
        .replace(/&gt;/gi, '>')
        .replace(/&quot;/gi, '"')
        .replace(/&#39;/gi, "'")
        .replace(/\s+/g, ' ')
        .trim();
}

function parseEntry(entry) {
    const alternateLink = entry.link?.find(link => link.rel === 'alternate');
    const fullText = textFromHtml(entry.summary?.$t || entry.content?.$t || '');

    return {
        title: entry.title?.$t?.trim(),
        brief: fullText.length > 180 ? `${fullText.slice(0, 177).trimEnd()}...` : fullText,
        url: alternateLink?.href,
        publishedAt: entry.published?.$t
    };
}

const fixture = {
    title: { $t: 'A Blogger post' },
    published: { $t: '2026-07-12T09:00:00.001-07:00' },
    summary: { $t: '<p>Law &amp; technology <strong>research</strong>.</p>' },
    link: [{ rel: 'alternate', href: 'https://law7tech.blogspot.com/example' }]
};

const post = parseEntry(fixture);
assert.deepEqual(post, {
    title: 'A Blogger post',
    brief: 'Law & technology research .',
    url: 'https://law7tech.blogspot.com/example',
    publishedAt: '2026-07-12T09:00:00.001-07:00'
});
assert.ok(!post.brief.includes('<strong>'));

console.log('Blogger feed parsing logic verified.');
