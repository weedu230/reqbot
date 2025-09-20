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

Requirements:
{{#each requirements}}
- {{this.description}} (Priority: {{this.priority}}, Type: {{this.type}})
{{/each}}

Break down the estimation into the following categories:
- **Development Team:** (e.g., Frontend, Backend, AI/ML Specialist)
- **Infrastructure:** (e.g., Hosting, Database, APIs)
- **Third-Party Services:** (e.g., Payment gateways, Analytics tools)
- **Contingency:** (A buffer for unforeseen costs)

For each category, provide a brief explanation and a rough cost range (e.g., in developer-hours or a monetary range like '$X,000 - $Y,000').

**Disclaimer:** This is a preliminary, non-binding estimate for discussion purposes only. Actual costs will vary based on team composition, technology choices, and project scope.

Output the entire response as a single HTML string. Use headings (<h3>), paragraphs (<p>), lists (<ul>, <li>), and bold tags (<strong>) for formatting.
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
