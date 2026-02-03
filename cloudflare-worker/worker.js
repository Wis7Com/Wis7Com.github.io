/**
 * Cloudflare Worker - Hashnode GraphQL Proxy
 * Bypasses CDN caching by making server-side requests
 */

const HASHNODE_API = 'https://gql.hashnode.com';
const ALLOWED_ORIGINS = [
  'https://wis7com.github.io',
  'http://localhost',
  'http://127.0.0.1'
];

export default {
  async fetch(request, env, ctx) {
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return handleCORS(request);
    }

    // Only allow POST
    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    // Validate origin
    const origin = request.headers.get('Origin') || '';
    const isAllowed = ALLOWED_ORIGINS.some(o => origin.startsWith(o));

    try {
      const body = await request.json();

      // Forward request to Hashnode API with cache bypass
      const requestId = Date.now() + '-' + Math.random().toString(36).slice(2);
      const response = await fetch(HASHNODE_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'CloudflareWorker/1.0',
          'X-Request-ID': requestId
        },
        body: JSON.stringify(body),
        cf: {
          cacheTtl: 0,
          cacheEverything: false,
          cacheKey: requestId
        }
      });

      const data = await response.text();

      // Return with CORS headers and aggressive cache prevention
      return new Response(data, {
        status: response.status,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': isAllowed ? origin : ALLOWED_ORIGINS[0],
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': isAllowed ? origin : ALLOWED_ORIGINS[0]
        }
      });
    }
  }
};

function handleCORS(request) {
  const origin = request.headers.get('Origin') || '';
  const isAllowed = ALLOWED_ORIGINS.some(o => origin.startsWith(o));

  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': isAllowed ? origin : ALLOWED_ORIGINS[0],
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400'
    }
  });
}
