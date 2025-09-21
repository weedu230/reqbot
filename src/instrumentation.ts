// This file is used to load all Genkit flows for Next.js.
// It's referenced in `next.config.ts` under `experimental.instrumentationHook`.

import { config } from 'dotenv';

// Load environment variables from .env file,
// mainly for local development. In a deployed environment,
// these should be set in your hosting provider's settings.
config();

import '@/ai/flows/extract-requirements-and-generate-json';
import '@/ai/flows/generate-chat-response';
import '@/ai/flows/generate-executive-summary';
import '@/ai/flows/generate-activity-diagram';
import '@/ai-flows/generate-cost-estimation';
import '@/ai/flows/generate-references';
import '@/ai/flows/generate-speech';
