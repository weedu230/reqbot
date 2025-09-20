'use server';

import { extractRequirementsAndGenerateJson } from '@/ai/flows/extract-requirements-and-generate-json';
import { Requirement } from '@/lib/types';

type ActionResult = {
  requirements?: Requirement[];
  error?: string;
};

export async function extractRequirements(
  conversationHistory: string
): Promise<ActionResult> {
  try {
    const result = await extractRequirementsAndGenerateJson({
      conversationHistory,
    });
    return { requirements: result.requirements };
  } catch (error: any) {
    console.error('Error extracting requirements:', error);
    return {
      error: error.message || 'Failed to extract requirements due to an unexpected error.',
    };
  }
}
