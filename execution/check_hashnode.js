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

async function check() {
    try {
        const response = await fetch('https://gql.hashnode.com', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query }),
        });
        const data = await response.json();
        console.log(JSON.stringify(data, null, 2));
    } catch (e) {
        console.error(e);
    }
}

check();
