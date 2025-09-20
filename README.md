# ReqBot – AI-Powered Business Analyst

ReqBot is a Next.js web application that acts as an AI-powered business analyst. It helps users elicit, refine, and document project requirements through an intuitive conversational interface, complete with voice capabilities.

## Features

-   **Conversational Requirement Gathering:** Engage in a natural conversation with ReqBot to describe your project needs.
-   **Voice-to-Text & Text-to-Speech:** Interact with the bot using your voice and hear its responses spoken back to you.
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

3.  **Set up environment variables:**
    Create a `.env` file in the root of your project and add your Google AI API key:
    ```
    GEMINI_API_KEY=your_google_ai_api_key_here
    ```

### Running the Development Server

To run the app in development mode, you need to run both the Next.js frontend and the Genkit AI flows concurrently.

1.  **Start the Next.js development server:**
    ```sh
    npm run dev
    ```
    This will start the web application, typically on `http://localhost:9002`.

2.  **Start the Genkit flows:**
    In a separate terminal, run the following command to start the Genkit development server:
    ```sh
    npm run genkit:dev
    ```
    This allows the Next.js app to communicate with your AI flows. The Genkit UI will be available at `http://localhost:4000`.
