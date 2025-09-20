import { ThemeToggle } from '@/components/common/theme-toggle';
import { Bot } from 'lucide-react';

export function Header() {
  return (
    <header className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center gap-2">
        <Bot className="h-6 w-6 text-primary" />
        <h1 className="text-lg font-semibold tracking-tight">
          ReqBot – AI Business Analyst
        </h1>
      </div>
      <ThemeToggle />
    </header>
  );
}
