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
  prompt: `You are an expert system designer. Based on the following requirements, generate an Activity Diagram in Mermaid.js syntax. The diagram must illustrate the primary user flow or process.

Requirements:
{{#each requirements}}
- {{this.description}} (Priority: {{this.priority}}, Type: {{this.type}})
{{/each}}

You MUST use the "flowchart TD" syntax. Start with a 'start' node and end with an 'end' node. Use clear and concise labels for activities and decisions. Keep labels short and avoid special characters like '/', '(', or ')'.

Example of Mermaid Activity Diagram syntax:
flowchart TD
    A[Start] --> B(User authenticates);
    B --> C{Is authentication successful?};
    C -->|Yes| D[User views dashboard];
    C -->|No| E[Show error message];
    D --> F[End];
    E --> A;

Generate only the Mermaid syntax for the diagram. Do not include the \`\`\`mermaid opening and closing tags.
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
    if (!output) {
      throw new Error('Failed to generate diagram');
    }
    // Sanitize the output to remove characters that can break Mermaid syntax
    const sanitizedDiagram = output.diagram
      .replace(/[\(\)]/g, '') // Remove parentheses
      .replace(/\//g, ' or '); // Replace slashes

    return { diagram: sanitizedDiagram };
  }
);