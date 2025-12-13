Project Report: ReqBot – AI-Powered Business Analyst
Course: Software Requirements Engineering (SEN-211)
Class: BSE-03 (A&B)
Submitted to: Engr. Nabiha Faisal
Submitted by: M.WALEED AHMED
Enrolment No: 02-131242-119
Date: November 22, 2025
________________________________________
Abstract
ReqBot is an AI-powered web application that transforms natural language conversations into structured software requirements. Built with Next.js and Google's Gemini AI, it serves as an intelligent business analyst, helping users define, categorize, and document project requirements through conversational interfaces. The system extracts requirements (functional, non-functional, domain, inverse) and generates comprehensive reports with diagrams and cost estimations, addressing traditional requirements engineering challenges.
1. Introduction
Requirements engineering is critical but challenging, often leading to project failures due to ambiguous specifications. ReqBot bridges the gap between informal project discussions and formal documentation using AI. It targets developers, business analysts, product managers, and students, making requirements engineering accessible and efficient through natural language interaction.
2. Problem Statement
Traditional requirements engineering suffers from:
1.	Time consumption (20-30% of project timelines)
2.	Ambiguity in natural language communication
3.	Inconsistent documentation quality
4.	High barrier for non-technical stakeholders
5.	Context loss during information transfer

3. Hardware and Software Requirements
Development:
•	Hardware: 8GB RAM, 20GB storage, modern processor
•	Software: Node.js 18+, Next.js 14, TypeScript 5
•	AI Services: Google Gemini API key
Production:
•	Browsers: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
•	Microphone for voice input
•	Internet for AI service connectivity
Tech Stack:
•	Frontend: Next.js 14, React 18, TypeScript, Tailwind CSS, ShadCN/UI
•	Backend: Genkit AI flows, Server Actions
•	AI: Google Gemini LLM via Genkit
•	Diagramming: Mermaid.js


4.Diagrams
4.1 Context Diagrams
 <img width="1083" height="577" alt="image" src="https://github.com/user-attachments/assets/9e332364-4f33-4da7-bb49-b25cb441d1a7" />

4.2 Usecase Diagram
 <img width="1092" height="431" alt="image" src="https://github.com/user-attachments/assets/dd687121-c93b-4552-913b-ec1ae270115b" />


4.3  Report generation workflow (flowchart/activity diagram)
 <img width="1093" height="312" alt="image" src="https://github.com/user-attachments/assets/3cdca099-5953-4cd6-b9b3-363b8eba5c51" />

4.4 Sequence Diagram
 <img width="1101" height="647" alt="image" src="https://github.com/user-attachments/assets/ec87daa4-111a-452b-a982-17cffc190c50" />

5. How It Works
5.1 Conversational Workflow:
1.	User Input: Text or voice through Web Speech API
2.	AI Processing: Messages sent to Gemini via Genkit flows
3.	Context Maintenance: Conversation history preserved in localStorage
4.	Intelligent Dialogue: AI asks clarifying questions and suggests requirements
5.2 Requirement Extraction:
1.	Analysis: AI analyzes complete conversation
2.	Categorization: Requirements sorted into:
o	Functional: System behaviors/features
o	Non-Functional: Performance/security
o	Domain: Industry-specific
o	Inverse: What not to do
3.	Validation: Confidence scoring and user review
5.3 Report Generation:
1.	Data Compilation: All requirements and conversation data gathered
2.	Parallel Processing: Sections generated simultaneously:
o	Executive summary from context
o	Mermaid.js activity diagrams
o	Cost/timeline estimations
o	Conversation references
3.	Formatting: Professional layout with export options (PDF, print)
5.4 Technical Architecture:
•	Frontend: React components with Zustand state management
•	Backend: Next.js server actions for secure API calls
•	AI Layer: Genkit flows with structured prompt engineering
•	Data Layer: localStorage for client-side persistence
•	Security: API keys server-side only, HTTPS encryption

6. Screenshots
1.	Main Chat Interface with conversation history
 <img width="976" height="546" alt="image" src="https://github.com/user-attachments/assets/bfbb782a-9680-4747-b131-7ac9d0a6b0fd" />

2.	Voice Input with recording indicators
 <img width="983" height="569" alt="image" src="https://github.com/user-attachments/assets/46a5ae78-6739-4957-b577-9dd592fc0ae7" />

3.	Extracted Requirements panel with categories
 <img width="991" height="246" alt="image" src="https://github.com/user-attachments/assets/502d38e7-0c0b-4b40-a5d8-1bf1a09f38ed" />

4.	Generated Report with sections and diagrams
 <img width="994" height="548" alt="image" src="https://github.com/user-attachments/assets/9213f8cd-697a-443a-9508-835ef970fb22" />

7. References
1.	IEEE Std 830-1998 - Software Requirements Specifications
2.	Next.js Documentation: https://nextjs.org/docs
3.	Google AI Gemini API Documentation
4.	Genkit Framework Documentation
5.	W3C Web Speech API Specification
6.	Mermaid.js Diagramming Guide
________________________________________
8. Appendix: Key Code Files
GITHUB: https://github.com/weedu230/reqbot
-8.1 Main Chat Interface (components/ChatInterface.tsx):
typescript
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Send, Mic, Loader2 } from "lucide-react";
import { getAiChatResponse } from "@/lib/actions/chat";

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: "user",
      timestamp: new Date(),
    };
    
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await getAiChatResponse(newMessages);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages([...newMessages, aiMessage]);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // ... rest of component
}
-8.2 Genkit AI Flow (lib/flows/chat.ts):
typescript
import { generate } from "@genkit-ai/ai";
import { geminiPro } from "@genkit-ai/googleai";
import { z } from "zod";

export const generateChatResponse = generate(
  {
    name: "generateChatResponse",
    inputSchema: z.object({
      conversation: z.array(z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string(),
      })),
    }),
    outputSchema: z.object({ response: z.string() }),
  },
  async ({ conversation }) => {
    const systemPrompt = `You are ReqBot, an AI Business Analyst. Help users define software requirements.`;
    
    const messages = [
      { role: "system", content: systemPrompt },
      ...conversation.slice(-10),
    ];

    const result = await generate({
      model: geminiPro,
      messages: messages,
      config: { temperature: 0.7, maxOutputTokens: 1000 },
    });

    return { response: result.text };
  }
);
-8.3 Server Action (lib/actions/chat.ts):
typescript
"use server";
import { generateChatResponse } from "@/lib/flows/chat";

export async function getAiChatResponse(messages: Message[]): Promise<string> {
  try {
    const conversation = messages.map(msg => ({
      role: msg.sender === "user" ? "user" : "assistant",
      content: msg.content
    }));

    const response = await generateChatResponse(conversation);
    return response.response;
  } catch (error) {
    throw new Error("Failed to get AI response");
  }
}
-8.4 Package Configuration (package.json):
json
{
  "name": "reqbot",
  "version": "0.1.0",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "genkit:dev": "genkit start --port 4000"
  },
  "dependencies": {
    "@genkit-ai/ai": "^0.10.0",
    "@genkit-ai/googleai": "^0.10.0",
    "next": "14.0.4",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "lucide-react": "^0.309.0",
    "tailwindcss": "^3.3.0",
    "zod": "^3.22.0"
  }
}
________________________________________
Conclusion
ReqBot successfully demonstrates AI-powered requirements engineering with a modern web stack. It addresses traditional challenges through conversational interfaces, automated extraction, and comprehensive reporting. The project showcases practical application of software engineering principles, AI integration, and user-centered design.


