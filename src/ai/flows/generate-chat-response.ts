'use server';

/**
 * @fileOverview This flow generates a chat response from the AI.
 *
 * - generateChatResponse - A function that generates a response.
 * - GenerateChatResponseInput - The input type for the generateChatResponse function.
 * - GenerateChatResponseOutput - The return type for the generateChatResponse function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateChatResponseInputSchema = z.object({
  history: z.array(z.object({
    role: z.enum(['user', 'model']),
    content: z.array(z.object({
      text: z.string(),
    })),
  })),
  message: z.string().describe("The user's latest message."),
});
export type GenerateChatResponseInput = z.infer<typeof GenerateChatResponseInputSchema>;

const GenerateChatResponseOutputSchema = z.object({
  response: z.string().describe("The AI's response to the user."),
});
export type GenerateChatResponseOutput = z.infer<typeof GenerateChatResponseOutputSchema>;

export async function generateChatResponse(
  input: GenerateChatResponseInput
): Promise<GenerateChatResponseOutput> {
  return generateChatResponseFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateChatResponsePrompt',
  input: {schema: GenerateChatResponseInputSchema},
  output: {schema: GenerateChatResponseOutputSchema},
  prompt: `You are ReqBot, a professional Business Analyst. Your goal is to elicit, refine, and document project requirements from the user. Engage in a natural, conversational manner. Ask clarifying questions, confirm your understanding, and guide the user to provide detailed requirements.

Here is the conversation so far:
{{#each history}}
{{role}}: {{#each content}}{{text}}{{/each}}
{{/each}}
user: {{{message}}}

Based on this conversation, provide a relevant and helpful response.
`,
});

const generateChatResponseFlow = ai.defineFlow(
  {
    name: 'generateChatResponseFlow',
    inputSchema: GenerateChatResponseInputSchema,
    outputSchema: GenerateChatResponseOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
