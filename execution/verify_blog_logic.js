// NOTE: Using global fetch available in Node 18+

const query = `
    query {
        publication(host: "justice-ai.hashnode.dev") {
            pinnedPost {
                title
                url
            }
            posts(first: 5) {
                edges {
                    node {
                        title
                        url
                        publishedAt
                    }
                }
            }
        }
    }
`;

async function verifyLogic() {
    try {
        const response = await fetch('https://gql.hashnode.com', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query }),
            cache: 'no-store'
        });
        const data = await response.json();

        const publication = data.data.publication;
        const pinnedPost = publication.pinnedPost;
        const latestPosts = publication.posts.edges.map(edge => edge.node);

        console.log("--- RAW DATA ---");
        console.log("Pinned:", pinnedPost ? pinnedPost.title : "None");
        console.log("Latest:", latestPosts.map(p => p.title));

        let displayPosts = [];

        if (pinnedPost) {
            pinnedPost.isPinned = true;
            displayPosts.push(pinnedPost);
        }

        for (const post of latestPosts) {
            if (displayPosts.length >= 3) break;
            const isDuplicate = displayPosts.some(p => p.url === post.url);
            if (!isDuplicate) {
                displayPosts.push(post);
            }
        }

        console.log("\n--- DISPLAY POSTS ---");
        displayPosts.forEach((p, index) => {
            console.log(`${index + 1}. [${p.isPinned ? "PINNED" : "LATEST"}] ${p.title}`);
        });

    } catch (e) {
        console.error(e);
    }
}

verifyLogic();
