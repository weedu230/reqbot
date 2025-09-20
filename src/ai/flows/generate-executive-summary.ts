'use server';

/**
 * @fileOverview This flow generates an executive summary from requirements.
 *
 * - generateExecutiveSummary - A function that generates the summary.
 * - GenerateExecutiveSummaryInput - The input type for the function.
 * - GenerateExecutiveSummaryOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { Requirement } from '@/lib/types';

const GenerateExecutiveSummaryInputSchema = z.object({
  requirements: z.array(z.custom<Requirement>()),
});
export type GenerateExecutiveSummaryInput = z.infer<typeof GenerateExecutiveSummaryInputSchema>;

const GenerateExecutiveSummaryOutputSchema = z.object({
  summary: z.string().describe("The executive summary in HTML format."),
});
export type GenerateExecutiveSummaryOutput = z.infer<typeof GenerateExecutiveSummaryOutputSchema>;


export async function generateExecutiveSummary(
  input: GenerateExecutiveSummaryInput
): Promise<GenerateExecutiveSummaryOutput> {
  return generateExecutiveSummaryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateExecutiveSummaryPrompt',
  input: { schema: GenerateExecutiveSummaryInputSchema },
  output: { schema: GenerateExecutiveSummaryOutputSchema },
  prompt: `You are an expert business analyst. Based on the following requirements, write a concise executive summary for a project report.

Requirements:
{{#each requirements}}
- {{this.description}} (Priority: {{this.priority}}, Type: {{this.type}})
{{/each}}

The summary should:
1.  Start with a high-level overview of the project's purpose and key goals.
2.  Highlight the most critical functional and non-functional requirements.
3.  Conclude with a statement about the project's expected impact or outcome.

Keep the tone professional and the language clear and direct. The summary should be no more than 3-4 paragraphs.

Output the entire summary as a single HTML string, using paragraphs (<p>) for structure.
`,
});

const generateExecutiveSummaryFlow = ai.defineFlow(
  {
    name: 'generateExecutiveSummaryFlow',
    inputSchema: GenerateExecutiveSummaryInputSchema,
    outputSchema: GenerateExecutiveSummaryOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
