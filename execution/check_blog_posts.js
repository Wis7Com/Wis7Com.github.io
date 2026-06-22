const fs = require('node:fs');
const path = require('node:path');

const postsPath = path.join(__dirname, '..', 'data', 'blog-posts.json');

function check() {
    const posts = JSON.parse(fs.readFileSync(postsPath, 'utf8'));

    if (!Array.isArray(posts)) {
        throw new Error('data/blog-posts.json must contain an array');
    }

    console.log(`Found ${posts.length} blog posts in data/blog-posts.json`);
    posts
        .slice()
        .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
        .forEach((post, index) => {
            console.log(`${index + 1}. ${post.publishedAt} | ${post.title}`);
        });
}

check();
