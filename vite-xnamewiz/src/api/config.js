const API_CONFIG = {
  endpoint:
    import.meta.env.VITE_REACT_APP_CLOUD_FLARE_WORKER_URL ||
    "https://you.need.your.workers.cloudlare.workers.dev",
  authHeader: null,
  headers: {
    "Content-Type": "application/json",
  },
};

export default API_CONFIG;
