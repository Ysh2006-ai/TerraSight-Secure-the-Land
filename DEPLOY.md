# Deploying TerraSight to Vercel

This guide explains how to deploy the TerraSight application to Vercel.

## Prerequisites

- A [Vercel account](https://vercel.com/signup).
- [Node.js](https://nodejs.org/) installed on your machine.
- (Optional) [Vercel CLI](https://vercel.com/docs/cli) installed globally:
  ```bash
  npm i -g vercel
  ```

## Option 1: Deploying via Vercel CLI (Recommended for Manual Deployment)

1.  **Login to Vercel CLI** (if not already logged in):
    ```bash
    vercel login
    ```

2.  **Deploy the project**:
    Run the following command in the root directory of the project:
    ```bash
    vercel
    ```

3.  **Follow the prompts**:
    -   **Set up and deploy?**: `y`
    -   **Which scope do you want to deploy to?**: Select your account.
    -   **Link to existing project?**: `n` (unless you are updating an existing deployment)
    -   **What's your project's name?**: `terrasight`
    -   **In which directory is your code located?**: `./` (default)
    -   **Want to modify these settings?**: `n` (The auto-detected settings for Vite are usually correct)

4.  **Wait for deployment**:
    Vercel will build and deploy your application. Once finished, it will provide a `Production` URL.

## Option 2: Deploying via GitHub (Recommended for CI/CD)

1.  **Push your code to GitHub**:
    Ensure your project is pushed to a repository on GitHub.

2.  **Import Project in Vercel**:
    -   Go to your [Vercel Dashboard](https://vercel.com/dashboard).
    -   Click **"Add New..."** -> **"Project"**.
    -   Find your GitHub repository in the list and click **"Import"**.

3.  **Configure Project**:
    -   **Framework Preset**: Ensure "Vite" is selected.
    -   **Root Directory**: `./` (default)
    -   **Build Command**: `npm run build` (default)
    -   **Output Directory**: `dist` (default)
    -   **Install Command**: `npm install` (default)

4.  **Deploy**:
    Click **"Deploy"**. Vercel will build the project and deploy it. Any future pushes to the `main` branch will automatically trigger a new deployment.

## Environment Variables

This project uses environment variables (e.g., for Sentinel Hub API). When deploying to Vercel, you must set these variables in your Vercel Project Settings.

1.  Go to your Vercel Project Dashboard.
2.  Navigate to **Settings** -> **Environment Variables**.
3.  Add the variables defined in your `.env` file (e.g., `VITE_SENTINEL_CLIENT_ID`, `VITE_SENTINEL_CLIENT_SECRET`, etc.).

## Common Issues

-   **Routing issues**: If you encounter 404 errors when refreshing pages other than the home page, ensure the `vercel.json` file is present in the root directory.
-   **API Proxy**: This project uses a proxy for Sentinel Hub API calls. The `vercel.json` file should contain the following configuration to handle both SPA routing and API proxying:

    ```json
    {
      "rewrites": [
        {
          "source": "/api/sentinel/:path*",
          "destination": "https://services.sentinel-hub.com/:path*"
        },
        {
          "source": "/(.*)",
          "destination": "/index.html"
        }
      ]
    }
    ```
