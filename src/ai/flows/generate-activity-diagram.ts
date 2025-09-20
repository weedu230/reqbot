'use server';

/**
 * @fileOverview This flow generates an activity diagram in Mermaid syntax.
 *
 * - generateActivityDiagram - A function that generates the diagram.
 * - GenerateActivityDiagramInput - The input type for the function.
 * - GenerateActivityDiagramOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { Requirement } from '@/lib/types';

const GenerateActivityDiagramInputSchema = z.object({
  requirements: z.array(z.custom<Requirement>()),
});
export type GenerateActivityDiagramInput = z.infer<typeof GenerateActivityDiagramInputSchema>;

const GenerateActivityDiagramOutputSchema = z.object({
  diagram: z.string().describe("The activity diagram in Mermaid syntax."),
});
export type GenerateActivityDiagramOutput = z.infer<typeof GenerateActivityDiagramOutputSchema>;


export async function generateActivityDiagram(
  input: GenerateActivityDiagramInput
): Promise<GenerateActivityDiagramOutput> {
  return generateActivityDiagramFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateActivityDiagramPrompt',
  input: { schema: GenerateActivityDiagramInputSchema },
  output: { schema: GenerateActivityDiagramOutputSchema },
  prompt: `You are an expert system designer. Based on the following requirements, generate an Activity Diagram in Mermaid syntax. The diagram should illustrate the primary user flow or process described in the functional requirements.

Requirements:
{{#each requirements}}
- {{this.description}} (Priority: {{this.priority}}, Type: {{this.type}})
{{/each}}

Focus on the main user journey. Start with a 'start' node and end with an 'end' node. Use clear and concise labels for activities and decisions.

Example of Mermaid Activity Diagram syntax:
graph TD
    A[Start] --> B(Do something);
    B --> C{Check condition?};
    C -->|Yes| D[Do another thing];
    C -->|No| E[Do something else];
    D --> F[End];
    E --> F[End];

Generate only the Mermaid syntax for the diagram.
`,
});

const generateActivityDiagramFlow = ai.defineFlow(
  {
    name: 'generateActivityDiagramFlow',
    inputSchema: GenerateActivityDiagramInputSchema,
    outputSchema: GenerateActivityDiagramOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
