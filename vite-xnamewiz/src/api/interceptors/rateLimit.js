import axios from 'axios';

const rateLimitInterceptor = (response) => {
  // Add custom exposed headers
  const exposedHeaders = 'x-request-time,x-ratelimit-remaining-requests,x-ratelimit-remaining-tokens';
  response.headers['access-control-expose-headers'] = exposedHeaders;

  // Copy rate limit headers to custom headers
  const rateLimitRequests = response.headers['x-ratelimit-remaining-requests'];
  const rateLimitTokens = response.headers['x-ratelimit-remaining-tokens'];
  if (rateLimitRequests) {
    response.headers['x-custom-rate-limit-requests'] = rateLimitRequests;
  }
  if (rateLimitTokens) {
    response.headers['x-custom-rate-limit-tokens'] = rateLimitTokens;
  }

  return response;
};

axios.interceptors.response.use(rateLimitInterceptor);

export default rateLimitInterceptor;
