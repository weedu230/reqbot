# ReqBot – AI-Powered Business Analyst

ReqBot is a Next.js web application that acts as an AI-powered business analyst. It helps users elicit, refine, and document project requirements through an intuitive conversational interface, complete with voice capabilities.

## Features

-   **Conversational Requirement Gathering:** Engage in a natural conversation with ReqBot to describe your project needs.
-   **AI-Powered Requirement Extraction:** At any point, the AI can analyze the conversation and automatically extract structured requirements, categorizing them as Functional, Non-Functional, and Domain-specific.
-   **Automated Report Generation:** With a single click, generate a comprehensive and printable project report that includes:
    -   **Executive Summary:** A high-level overview of the project's goals.
    -   **Detailed Requirements:** A categorized list of all extracted requirements.
    -   **Activity Diagram:** A Mermaid.js-powered visual flowchart of the system's processes.
    -   **Cost Estimation:** A speculative breakdown of potential project costs, labor, and timelines.
    -   **References:** The conversation history that served as the source for the report.

## Tech Stack

-   **Framework:** [Next.js](https://nextjs.org/) (App Router)
-   **AI/Generative:** [Google AI & Genkit](https://firebase.google.com/docs/genkit)
-   **UI:** [React](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [ShadCN/UI](https://ui.shadcn.com/)
-   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
-   **Speech Recognition:** Web Speech API
---
## Demo


https://github.com/user-attachments/assets/b2a0cdb6-4833-4f1e-a940-74ad8ed55c73


---
## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

-   [Node.js](https://nodejs.org/en) (v18 or later)
-   [npm](https://www.npmjs.com/)

### Installation

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/your-username/reqbot.git
    cd reqbot
    ```

2.  **Install NPM packages:**
    ```sh
    npm install
    ```

3.  **Set up environment variables for local development:**
    Create a `.env` file in the root of your project and add your Google AI API key. You can get a key from [Google AI Studio](https://aistudio.google.com/app/apikey).
    ```.env
    # This file is for local development only and should not be committed to Git.
    GEMINI_API_KEY="your_google_ai_api_key_here"
    ```
    **Important:** Add `.env` to your `.gitignore` file to prevent committing your API key.

### Running the Development Server

To run the app in development mode, you need to run both the Next.js frontend and the Genkit AI flows concurrently.

1.  **Start the Next.js development server:**
    ```sh
    npm run dev
    ```
    This will start the web application, typically on `http://localhost:9002`.

2.  **Start the Genkit flows (for debugging):**
    To inspect your AI flows, run the following command in a separate terminal:
    ```sh
    npm run genkit:dev
    ```
    This allows the Next.js app to communicate with your AI flows and provides the Genkit Inspector UI at `http://localhost:4000`.

## Saving Your Changes to GitHub

After we've made changes to the code, those changes exist on your local machine. To save them to your GitHub repository, you'll need to commit them.

1.  **Stage your changes:**
    This command adds all modified files to a staging area, preparing them for a commit.
    ```sh
    git add .
    ```

2.  **Commit your changes:**
    This command saves your staged changes with a descriptive message.
    ```sh
    git commit -m "feat: Describe the feature or fix you added"
    ```

3.  **Push to GitHub:**
    This command uploads your committed changes to your remote repository on GitHub.
    ```sh
    git push
    ```

## Deployment with Vercel

Follow these steps to deploy your application to Vercel directly from your GitHub repository.

### Step 1: Sign up and Connect to GitHub
1.  Go to [vercel.com](https://vercel.com) and sign up for a free account.
2.  During the sign-up process or from your dashboard, connect your GitHub account to Vercel.

### Step 2: Import Your Project
1.  From your Vercel dashboard, click the **"Add New..."** button and select **"Project"**.
2.  The "Import Git Repository" screen will appear. Find your `reqbot` repository in the list and click the **"Import"** button next to it.

### Step 3: Configure Your Project
Vercel is smart and will automatically detect that you are deploying a Next.js application. The default settings for the "Framework Preset" and "Build and Output Settings" should be correct. You do not need to change them.

### Step 4: Add the Environment Variable (Crucial Step)
This is the most important step to ensure the AI features work on your deployed site.
1.  Expand the **"Environment Variables"** section.
2.  Add a new variable:
    -   **Name:** `GEMINI_API_KEY`
    -   **Value:** Paste your Google AI API key here (the same one from your `.env` file).
3.  Ensure the variable is available for all environments (Production, Preview, and Development).
4.  Click the **"Add"** button.

### Step 5: Deploy
1.  Click the **"Deploy"** button.
2.  Vercel will now start building and deploying your application. You can watch the progress in the build logs.
3.  Once the deployment is complete, Vercel will provide you with a URL to your live application.

Your application is now live! Every time you push a new commit to your main branch on GitHub, Vercel will automatically redeploy the application with the latest changes.
