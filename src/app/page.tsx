'use client';

import { useState } from 'react';
import { Bot } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Header } from '@/components/layout/header';
import ChatInterface from '@/components/chat/chat-interface';

export default function Home() {
  const [chatStarted, setChatStarted] = useState(false);

  return (
    <div className="flex flex-col h-screen bg-background">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-6">
        {!chatStarted ? (
          <div className="flex flex-col items-center text-center gap-6 animate-fade-in">
            <div className="p-4 bg-primary/10 rounded-full">
              <Bot className="h-12 w-12 text-primary" />
            </div>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
              AI-Powered Business Analyst
            </h1>
            <p className="max-w-2xl text-muted-foreground md:text-lg">
              Welcome to ReqBot. Start a conversation to elicit, refine, and document your project requirements effortlessly.
            </p>
            <Button size="lg" onClick={() => setChatStarted(true)}>
              Start Chat
            </Button>
          </div>
        ) : (
          <ChatInterface />
        )}
      </main>
    </div>
  );
}
