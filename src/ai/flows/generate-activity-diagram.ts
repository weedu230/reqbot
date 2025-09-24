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
  diagram: z.string().describe("The activity diagram in Mermaid syntax, excluding the 'flowchart TD' declaration."),
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
  prompt: `You are an expert system designer. Based on the following requirements, generate the body of an Activity Diagram in Mermaid.js 'flowchart TD' syntax.

Requirements:
{{#each requirements}}
- {{this.description}} (Priority: {{this.priority}}, Type: {{this.type}})
{{/each}}

You MUST ONLY generate the sequence of nodes and edges.
- Start with a 'start' node like this: A["Start"]
- End with an 'end' node like this: Z["End"]
- Use clear, concise labels for activities and decisions. Keep labels short and AVOID special characters like '/', '(', ')', or '"'.
- Each node must have a unique ID (e.g., A, B, C).

Example of the required output format:
A[Start] --> B(User authenticates);
B --> C{Is authentication successful?};
C -->|Yes| D[User views dashboard];
C -->|No| E[Show error message];
D --> F[End];
E --> A;

DO NOT include the 'flowchart TD' line or the code block fences (\`\`\`mermaid). Only provide the node and edge definitions.
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
    // Sanitize the output to prevent Mermaid syntax errors
    const sanitizedDiagram = output.diagram
      .replace(/[\(\)\"]/g, '') // Remove parentheses and double quotes
      .replace(/\//g, ' or '); // Replace slashes

    return { diagram: `flowchart TD\n${sanitizedDiagram}` };
  }
);
