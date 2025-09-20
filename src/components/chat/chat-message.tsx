import { Bot, User } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

import { cn } from '@/lib/utils';
import type { Message } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface ChatMessageProps {
  message: Message;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.sender === 'user';

  return (
    <div
      className={cn(
        'flex items-start gap-3',
        isUser ? 'justify-end' : 'justify-start'
      )}
    >
      {!isUser && (
        <Avatar className="h-8 w-8">
          <div className="flex h-full w-full items-center justify-center rounded-full bg-primary/20 text-primary">
            <Bot className="h-5 w-5" />
          </div>
        </Avatar>
      )}
      <div
        className={cn(
          'flex flex-col gap-1',
          isUser ? 'items-end' : 'items-start'
        )}
      >
        <div
          className={cn(
            'max-w-xs md:max-w-md lg:max-w-lg rounded-lg px-4 py-2 text-sm shadow-sm animate-fade-in-up',
            isUser
              ? 'bg-primary text-primary-foreground rounded-br-none'
              : 'bg-muted rounded-bl-none'
          )}
        >
          <p className="whitespace-pre-wrap">{message.text}</p>
        </div>
        <span className="text-xs text-muted-foreground">
          {formatDistanceToNow(message.timestamp, { addSuffix: true })}
        </span>
      </div>
       {isUser && (
        <Avatar className="h-8 w-8">
           <div className="flex h-full w-full items-center justify-center rounded-full bg-secondary">
            <User className="h-5 w-5 text-secondary-foreground" />
          </div>
        </Avatar>
      )}
    </div>
  );
}
