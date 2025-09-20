'use client';

import { useState, useRef, useEffect, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Send, FileJson, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import ChatMessage from '@/components/chat/chat-message';
import RequirementsDisplay from '@/components/chat/requirements-display';
import type { Message, Requirement } from '@/lib/types';
import { extractRequirements, getAiChatResponse } from '@/app/actions';

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init',
      text: "Hello! I'm ReqBot. Please describe the project or system you want to build. What are the key features and goals?",
      sender: 'ai',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isExtracting, startExtracting] = useTransition();
  const [isResponding, startResponding] = useTransition();
  const [extractedRequirements, setExtractedRequirements] = useState<Requirement[]>([]);
  
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() === '') return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      text: input,
      sender: 'user',
      timestamp: new Date(),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');

    startResponding(async () => {
      const result = await getAiChatResponse(newMessages);
      if (result.error || !result.response) {
        toast({
          variant: 'destructive',
          title: 'AI Response Error',
          description: result.error || 'An unknown error occurred.',
        });
        // Optionally add a default error message to chat
        const errorResponse: Message = {
            id: crypto.randomUUID(),
            text: "Sorry, I'm having trouble responding right now.",
            sender: 'ai',
            timestamp: new Date(),
        };
        setMessages(prev => [...prev, errorResponse]);
      } else {
        const aiResponse: Message = {
          id: crypto.randomUUID(),
          text: result.response,
          sender: 'ai',
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiResponse]);
      }
    });
  };

  const handleExtract = () => {
    const conversationHistory = messages
      .map((msg) => `${msg.sender === 'user' ? 'User' : 'AI'}: ${msg.text}`)
      .join('\n');

    startExtracting(async () => {
      const result = await extractRequirements(conversationHistory);
      if (result.error || !result.requirements) {
        toast({
          variant: 'destructive',
          title: 'Extraction Failed',
          description: result.error || 'An unknown error occurred.',
        });
      } else {
        setExtractedRequirements(result.requirements);
        toast({
          title: 'Extraction Successful',
          description: 'Requirements have been extracted from the conversation.',
        });
      }
    });
  };

  const handleGenerateReport = () => {
    try {
      localStorage.setItem('requirements', JSON.stringify(extractedRequirements));
      router.push('/report');
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Failed to generate report',
        description: 'Could not save requirements to local storage. It might be too large.',
      });
    }
  };

  return (
    <div className="w-full max-w-4xl h-full flex flex-col bg-card border rounded-lg shadow-lg animate-fade-in-up">
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          {isResponding && (
             <div className="flex items-center gap-2 text-muted-foreground animate-pulse">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>ReqBot is thinking...</span>
            </div>
          )}
          {isExtracting && (
             <div className="flex items-center gap-2 text-muted-foreground animate-pulse">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Analyzing conversation and extracting requirements...</span>
            </div>
          )}
          {extractedRequirements.length > 0 && (
            <RequirementsDisplay requirements={extractedRequirements} />
          )}
        </div>
      </ScrollArea>

      <div className="p-4 border-t bg-background/80 backdrop-blur-sm">
        <form onSubmit={handleSendMessage} className="flex items-start gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe a requirement..."
            className="flex-1 resize-none"
            rows={1}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                handleSendMessage(e);
              }
            }}
            disabled={isResponding}
          />
          <Button type="submit" size="icon" disabled={!input.trim() || isResponding}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
        <div className="flex justify-end gap-2 mt-2">
          <Button variant="outline" onClick={handleExtract} disabled={isExtracting || messages.length < 2 || isResponding}>
            {isExtracting ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <FileJson className="mr-2 h-4 w-4" />}
            Extract Requirements
          </Button>
          <Button onClick={handleGenerateReport} disabled={extractedRequirements.length === 0 || isResponding}>
            <FileText className="mr-2 h-4 w-4" />
            Generate Report
          </Button>
        </div>
      </div>
    </div>
  );
}
