import { config } from 'dotenv';
config();

import '@/ai/flows/extract-requirements-and-generate-json.ts';
import '@/ai/flows/generate-chat-response.ts';
import '@/ai/flows/generate-executive-summary.ts';
import '@/ai/flows/generate-activity-diagram.ts';
import '@/ai/flows/generate-cost-estimation.ts';
import '@/ai/flows/generate-references.ts';
