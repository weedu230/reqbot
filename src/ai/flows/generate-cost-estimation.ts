'use server';

/**
 * @fileOverview This flow generates a high-level cost estimation report.
 *
 * - generateCostEstimation - A function that generates the report.
 * - GenerateCostEstimationInput - The input type for the function.
 * - GenerateCostEstimationOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { Requirement } from '@/lib/types';

const GenerateCostEstimationInputSchema = z.object({
  requirements: z.array(z.custom<Requirement>()),
});
export type GenerateCostEstimationInput = z.infer<typeof GenerateCostEstimationInputSchema>;

const GenerateCostEstimationOutputSchema = z.object({
  estimation: z.string().describe("A high-level cost estimation report in HTML format."),
});
export type GenerateCostEstimationOutput = z.infer<typeof GenerateCostEstimationOutputSchema>;


export async function generateCostEstimation(
  input: GenerateCostEstimationInput
): Promise<GenerateCostEstimationOutput> {
  return generateCostEstimationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateCostEstimationPrompt',
  input: { schema: GenerateCostEstimationInputSchema },
  output: { schema: GenerateCostEstimationOutputSchema },
  prompt: `You are an expert project manager. Based on the following requirements, provide a high-level, speculative cost estimation for the project.

For each requirement, provide a rough estimation for cost, labour, and time. Present this in an HTML table with the following columns: "Requirement", "Estimated Cost (USD)", "Estimated Labour (Person-Hours)", and "Estimated Time (Days)".

Requirements:
{{#each requirements}}
- {{this.description}} (Priority: {{this.priority}}, Type: {{this.type}})
{{/each}}

After the table, provide a summary and a breakdown of other potential costs (e.g., Infrastructure, Third-Party Services, Contingency).

**Disclaimer:** This is a preliminary, non-binding estimate for discussion purposes only. Actual costs will vary based on team composition, technology choices, and project scope.

Output the entire response as a single HTML string. Use a <table> with <thead>, <tbody>, <tr>, <th>, and <td> tags for the main estimation. Use headings (<h3>), paragraphs (<p>), and lists (<ul>, <li>) for the summary and disclaimer.
`,
});

const generateCostEstimationFlow = ai.defineFlow(
  {
    name: 'generateCostEstimationFlow',
    inputSchema: GenerateCostEstimationInputSchema,
    outputSchema: GenerateCostEstimationOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
