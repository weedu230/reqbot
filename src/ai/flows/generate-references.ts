'use server';

/**
 * @fileOverview This flow generates the references section of the report.
 *
 * - generateReferences - A function that generates the references.
 * - GenerateReferencesInput - The input type for the function.
 * - GenerateReferencesOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateReferencesInputSchema = z.object({
  conversationHistory: z.string(),
});
export type GenerateReferencesInput = z.infer<typeof GenerateReferencesInputSchema>;

const GenerateReferencesOutputSchema = z.object({
  references: z.string().describe("The references section in HTML format."),
});
export type GenerateReferencesOutput = z.infer<typeof GenerateReferencesOutputSchema>;


export async function generateReferences(
  input: GenerateReferencesInput
): Promise<GenerateReferencesOutput> {
  return generateReferencesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateReferencesPrompt',
  input: { schema: GenerateReferencesInputSchema },
  output: { schema: GenerateReferencesOutputSchema },
  prompt: `You are an expert documentation specialist. The following is a conversation history between a user and an AI business analyst (ReqBot).

Conversation:
{{{conversationHistory}}}

Your task is to format this conversation into a "References" section for a report. The requirements in the report were derived from this conversation.

The format should be a simple acknowledgment that the requirements were based on this dialogue. Summarize the key discussion points briefly.

Output the entire response as a single HTML string. Use a heading (<h3>) for "Source" and paragraphs (<p>) for the text. You can use a blockquote (<blockquote>) to wrap the summarized conversation.
`,
});

const generateReferencesFlow = ai.defineFlow(
  {
    name: 'generateReferencesFlow',
    inputSchema: GenerateReferencesInputSchema,
    outputSchema: GenerateReferencesOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
