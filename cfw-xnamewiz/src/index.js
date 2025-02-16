/**
 * this Cloudflare Worker will accept requests add GITHUB_TOKEN to the request headers and forward the request to the target URL
 */

async function handleRequest(request, env) {
	// Construct the new URL by appending the original path/query to your Azure endpoint
	const url = new URL(request.url);
	const azureUrl = new URL('https://models.inference.ai.azure.com' + url.pathname + url.search);

	 // CORS headers
	 const corsHeaders = {
		'Access-Control-Allow-Origin': '*',
		'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
		'Access-Control-Allow-Headers': 'Content-Type, Authorization',
		'Access-Control-Expose-Headers': 'x-ratelimit-remaining-requests,x-ratelimit-remaining-tokens,x-request-time',
	  };
	
	  // Handle OPTIONS request
	  if (request.method === 'OPTIONS') {
		return new Response(null, { 
		  headers: corsHeaders
		});
	  }
	

	// Create a modified request that adds the "Authorization: Bearer GITHUB_TOKEN" header
	// while preserving other headers and the request payload.
	const modifiedRequest = new Request(azureUrl, {
		method: request.method,
		headers: {
			// Spread original request headers if needed
			...Object.fromEntries(request.headers),
			// Add your GitHub token from the Wrangler secret store
			Authorization: `Bearer ${env.GITHUB_TOKEN}`,
		},
		// Pass through the request body for non-GET methods
		body: request.method !== 'GET' ? request.body : null,
	});

	try {
		const response = await fetch(modifiedRequest);
		
		// Get the response body as an ArrayBuffer
		const responseBody = await response.arrayBuffer();
	
		// Combine Azure headers with CORS headers
		const headers = new Headers(response.headers);
		Object.entries(corsHeaders).forEach(([key, value]) => {
		  headers.set(key, value);
		});
	
		// Return new response with original body and combined headers
		return new Response(responseBody, {
		  status: response.status,
		  headers: headers,
		  statusText: response.statusText
		});
	
	  } catch (error) {
		return new Response(JSON.stringify({ error: error.message }), {
		  status: 500,
		  headers: corsHeaders
		});
	  }
}

const worker = {
	async fetch(request, env) {
		return handleRequest(request, env);
	},
};

export default worker;
