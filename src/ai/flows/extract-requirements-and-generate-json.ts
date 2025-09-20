'use server';

/**
 * @fileOverview This flow extracts requirements from a conversation and generates a JSON output.
 *
 * - extractRequirementsAndGenerateJson - A function that handles the extraction and generation process.
 * - ExtractRequirementsAndGenerateJsonInput - The input type for the extractRequirementsAndGenerateJson function.
 * - ExtractRequirementsAndGenerateJsonOutput - The return type for the extractRequirementsAndGenerateJson function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExtractRequirementsAndGenerateJsonInputSchema = z.object({
  conversationHistory: z
    .string()
    .describe("The complete conversation history between the user and the AI assistant."),
});
export type ExtractRequirementsAndGenerateJsonInput = z.infer<typeof ExtractRequirementsAndGenerateJsonInputSchema>;

const RequirementSchema = z.object({
  id: z.string().describe("A unique identifier for the requirement."),
  type: z.enum(["Functional", "NonFunctional", "Domain"]).describe("The type of requirement."),
  description: z.string().describe("A detailed description of the requirement."),
  priority: z.enum(["Low", "Med", "High"]).describe("The priority of the requirement."),
  confidence_score: z.number().min(0).max(1).describe("A score (0-1) indicating the confidence in the accuracy of the requirement."),
});

const ExtractRequirementsAndGenerateJsonOutputSchema = z.object({
  requirements: z.array(RequirementSchema).describe("An array of extracted requirements in JSON format."),
});
export type ExtractRequirementsAndGenerateJsonOutput = z.infer<typeof ExtractRequirementsAndGenerateJsonOutputSchema>;

export async function extractRequirementsAndGenerateJson(
  input: ExtractRequirementsAndGenerateJsonInput
): Promise<ExtractRequirementsAndGenerateJsonOutput> {
  return extractRequirementsAndGenerateJsonFlow(input);
}

const prompt = ai.definePrompt({
  name: 'extractRequirementsAndGenerateJsonPrompt',
  input: {schema: ExtractRequirementsAndGenerateJsonInputSchema},
  output: {schema: ExtractRequirementsAndGenerateJsonOutputSchema},
  prompt: `You are ReqBot, a professional Business Analyst. You have had the following conversation with a user:

{{{conversationHistory}}}

Based on this conversation, extract the requirements and output them as a JSON object with a 'requirements' array. Each requirement should have the following fields:

- id: A unique identifier for the requirement.
- type: The type of requirement (Functional, NonFunctional, or Domain).
- description: A detailed description of the requirement.
- priority: The priority of the requirement (Low, Med, or High).
- confidence_score: A score (0-1) indicating your confidence in the accuracy of the requirement.

Ensure the output is a valid JSON object.
`,
});

const extractRequirementsAndGenerateJsonFlow = ai.defineFlow(
  {
    name: 'extractRequirementsAndGenerateJsonFlow',
    inputSchema: ExtractRequirementsAndGenerateJsonInputSchema,
    outputSchema: ExtractRequirementsAndGenerateJsonOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
