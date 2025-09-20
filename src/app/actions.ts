'use server';

import { extractRequirementsAndGenerateJson } from '@/ai/flows/extract-requirements-and-generate-json';
import { generateChatResponse } from '@/ai/flows/generate-chat-response';
import { generateExecutiveSummary } from '@/ai/flows/generate-executive-summary';
import { generateActivityDiagram } from '@/ai/flows/generate-activity-diagram';
import { generateCostEstimation } from '@/ai/flows/generate-cost-estimation';
import { generateReferences } from '@/ai/flows/generate-references';
import { generateSpeech } from '@/ai/flows/generate-speech';
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

type ReportSectionResult = {
  content?: string;
  error?: string;
};

export async function getExecutiveSummary(requirements: Requirement[]): Promise<ReportSectionResult> {
  try {
    const result = await generateExecutiveSummary({ requirements });
    return { content: result.summary };
  } catch (error: any) {
    console.error('Error generating executive summary:', error);
    return {
      error: error.message || 'Failed to generate executive summary.',
    };
  }
}

export async function getActivityDiagram(requirements: Requirement[]): Promise<ReportSectionResult> {
    try {
        const result = await generateActivityDiagram({ requirements });
        return { content: result.diagram };
    } catch (error: any) {
        console.error('Error generating activity diagram:', error);
        return {
            error: error.message || 'Failed to generate activity diagram.',
        };
    }
}

export async function getCostEstimation(requirements: Requirement[]): Promise<ReportSectionResult> {
    try {
        const result = await generateCostEstimation({ requirements });
        return { content: result.estimation };
    } catch (error: any) {
        console.error('Error generating cost estimation:', error);
        return {
            error: error.message || 'Failed to generate cost estimation.',
        };
    }
}

export async function getReferences(conversationHistory: string): Promise<ReportSectionResult> {
    try {
        const result = await generateReferences({ conversationHistory });
        return { content: result.references };
    } catch (error: any) {
        console.error('Error generating references:', error);
        return {
            error: error.message || 'Failed to generate references.',
        };
    }
}

type SpeechActionResult = {
    audio?: string;
    error?: string;
}

export async function getAiSpeechResponse(text: string): Promise<SpeechActionResult> {
    try {
        const result = await generateSpeech(text);
        return { audio: result.media };
    } catch (error: any) {
        console.error('Error generating speech:', error);
        return {
            error: error.message || 'Failed to generate speech.',
        };
    }
}
