'use server';

import { extractRequirementsAndGenerateJson } from '@/ai/flows/extract-requirements-and-generate-json';
import { generateChatResponse } from '@/ai/flows/generate-chat-response';
import { Requirement, Message } from '@/lib/types';

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

type ChatActionResult = {
    response?: string;
    error?: string;
};

export async function getAiChatResponse(messages: Message[]): Promise<ChatActionResult> {
    try {
        const history = messages.slice(0, -1).map(m => ({
            role: m.sender === 'user' ? 'user' as const : 'model' as const,
            content: [{ text: m.text }],
        }));

        const latestMessage = messages[messages.length-1];

        const result = await generateChatResponse({ history: history, message: latestMessage.text });
        return { response: result.response };

    } catch (error: any) {
        console.error('Error generating chat response:', error);
        return {
            error: error.message || 'Failed to get AI response due to an unexpected error.',
        };
    }
}
