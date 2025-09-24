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

const NodeSchema = z.object({
  id: z.string().describe("A short, unique, single-word identifier for the node (e.g., 'A', 'B', 'C1')."),
  label: z.string().describe("The user-visible text for the node. Keep it concise."),
  type: z.enum(['action', 'decision', 'start', 'end']).describe("The shape of the node. Use 'action' for rectangular boxes, 'decision' for diamond shapes, 'start' for the beginning, and 'end' for the termination."),
});

const EdgeSchema = z.object({
  from: z.string().describe("The ID of the starting node."),
  to: z.string().describe("The ID of the ending node."),
  label: z.string().optional().describe("An optional label for the edge, typically used for 'Yes' or 'No' paths from a decision node."),
});

const DiagramStructureSchema = z.object({
  nodes: z.array(NodeSchema).describe("An array of all the nodes in the diagram."),
  edges: z.array(EdgeSchema).describe("An array of the connections between the nodes."),
});

const GenerateActivityDiagramOutputSchema = z.object({
  diagram: z.string().describe("The complete, final activity diagram in valid Mermaid.js 'flowchart TD' syntax."),
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
  output: { schema: DiagramStructureSchema },
  prompt: `You are an expert system designer. Your task is to convert a list of project requirements into a structured activity diagram format.

Based on the following requirements, generate a JSON object containing an array of 'nodes' and an array of 'edges'.

Requirements:
{{#each requirements}}
- {{this.description}} (Priority: {{this.priority}}, Type: {{this.type}})
{{/each}}

Instructions for the JSON structure:
- Nodes:
  - Every diagram MUST have exactly one 'start' node and at least one 'end' node.
  - Each node needs a short, unique 'id' (e.g., 'A', 'B', 'C1').
  - The 'label' should be a concise summary of the step.
  - Node 'type' must be one of: 'action' (for processes), 'decision' (for questions), 'start', or 'end'.
- Edges:
  - Each edge connects two nodes using their 'id' fields in 'from' and 'to'.
  - Decision nodes should have at least two outgoing edges, typically labeled 'Yes' and 'No'.

Provide only the JSON object as your output.
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
    if (!output?.nodes || !output?.edges) {
      throw new Error('Failed to generate diagram structure');
    }

    const { nodes, edges } = output;

    let mermaidSyntax = 'flowchart TD\n';

    // Sanitize labels to prevent Mermaid syntax errors
    const sanitize = (text: string) => text.replace(/["]|[\(\)]/g, '');

    // Add node definitions
    nodes.forEach(node => {
        const label = sanitize(node.label);
        switch (node.type) {
            case 'start':
            case 'end':
                mermaidSyntax += `    ${node.id}[("${label}")]\n`;
                break;
            case 'action':
                mermaidSyntax += `    ${node.id}["${label}"]\n`;
                break;
            case 'decision':
                mermaidSyntax += `    ${node.id}{"${label}"}\n`;
                break;
        }
    });

    // Add edge definitions
    edges.forEach(edge => {
        if (edge.label) {
            const label = sanitize(edge.label);
            mermaidSyntax += `    ${edge.from} -->|${label}| ${edge.to}\n`;
        } else {
            mermaidSyntax += `    ${edge.from} --> ${edge.to}\n`;
        }
    });

    return { diagram: mermaidSyntax };
  }
);
