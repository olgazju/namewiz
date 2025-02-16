# Cloudflare Worker Project

This utitlty project is a Cloudflare Worker that handles incoming requests and returns responses to API. Below are the steps to upload the worker using Wrangler, create a secret for your GITHUB_TOKEN in the Cloudflare secret vault, and update the `.env` file with the provided URL.

## Steps to Upload a Cloudflare Worker using Wrangler

1. **Install Wrangler**: If you haven't already, install Wrangler globally using npm:

   ```
   npm install -g wrangler
   ```

2. **Login to Cloudflare**: Authenticate your Wrangler CLI with your Cloudflare account:

   ```
   wrangler login
   ```

3. **Configure your Worker**: Ensure your `wrangler.toml` file is correctly set up with your project name, type, and account ID.

4. **Publish your Worker**: To upload your Cloudflare Worker, run:
   ```
   wrangler publish
   ```

## Creating a Secret for GITHUB_TOKEN

1. **Access Cloudflare Dashboard**: Go to your Cloudflare dashboard.

2. **Navigate to the Workers section**: Select the Workers tab.

3. **Open the Secrets Vault**: Find the option to manage secrets.

4. **Add a new secret**: Create a new secret with the name `GITHUB_TOKEN` and paste your GitHub token as the value.

## Updating the .env File

1. **Locate your .env file**: Open the `.env` file in your frontend project root (not in this worker project).

2. **Add the Cloudflare Worker URL**: Update the file with the following line:
   ```
   VITE_REACT_APP_CLOUD_FLARE_WORKER_URL=https://your-proxy-worker.name.workers.dev
   ```

Now your Cloudflare Worker is set up and ready to handle requests!
