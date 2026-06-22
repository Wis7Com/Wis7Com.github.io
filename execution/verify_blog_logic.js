const fs = require('node:fs');
const path = require('node:path');

const postsPath = path.join(__dirname, '..', 'data', 'blog-posts.json');

function verifyLogic() {
    const posts = JSON.parse(fs.readFileSync(postsPath, 'utf8'));

    if (!Array.isArray(posts)) {
        throw new Error('data/blog-posts.json must contain an array');
    }

    const displayPosts = posts
        .filter(post => post?.title && post?.brief && post?.url && post?.publishedAt)
        .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
        .slice(0, 3);

    if (displayPosts.length === 0) {
        throw new Error('No valid blog posts found');
    }

    console.log('--- DISPLAY POSTS ---');
    displayPosts.forEach((post, index) => {
        console.log(`${index + 1}. ${post.publishedAt} | ${post.title}`);
    });
}

verifyLogic();
