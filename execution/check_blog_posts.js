const FEED_URL = 'https://law7tech.blogspot.com/feeds/posts/default?alt=json&max-results=3';

async function check() {
    const response = await fetch(FEED_URL);
    if (!response.ok) {
        throw new Error(`Blogger feed returned HTTP ${response.status}`);
    }

    const data = await response.json();
    const entries = data.feed?.entry || [];
    if (entries.length === 0) {
        throw new Error('Blogger feed contains no posts');
    }

    console.log(`Found ${entries.length} recent Blogger posts`);
    entries.forEach((entry, index) => {
        const link = entry.link?.find(item => item.rel === 'alternate')?.href;
        console.log(`${index + 1}. ${entry.published?.$t} | ${entry.title?.$t} | ${link}`);
    });
}

check().catch(error => {
    console.error(error.message);
    process.exitCode = 1;
});
