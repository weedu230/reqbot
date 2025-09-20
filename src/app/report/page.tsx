'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Requirement } from '@/lib/types';
import { Header } from '@/components/layout/header';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Printer, ArrowLeft, Loader2 } from 'lucide-react';
import {
  getExecutiveSummary,
  getActivityDiagram,
  getCostEstimation,
  getReferences,
} from '@/app/actions';
import Mermaid from '@/components/report/mermaid';

const RequirementSection = ({
  title,
  requirements,
}: {
  title: string;
  requirements: Requirement[];
}) => (
  <Card>
    <CardHeader>
      <CardTitle>{title}</CardTitle>
    </CardHeader>
    <CardContent>
      {requirements.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Priority</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requirements.map((req) => (
              <TableRow key={req.id}>
                <TableCell className="font-medium">{req.id}</TableCell>
                <TableCell>{req.description}</TableCell>
                <TableCell className="text-right">
                  <Badge
                    variant={
                      req.priority === 'High'
                        ? 'destructive'
                        : req.priority === 'Med'
                        ? 'secondary'
                        : 'outline'
                    }
                  >
                    {req.priority}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <p className="text-muted-foreground text-sm">No {title.toLowerCase()} requirements.</p>
      )}
    </CardContent>
  </Card>
);

const GeneratedSection = ({
  title,
  fetcher,
  payload,
  isDiagram = false,
}: {
  title: string;
  fetcher: (payload: any) => Promise<{ content?: string; error?: string }>;
  payload: any;
  isDiagram?: boolean;
}) => {
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      const result = await fetcher(payload);
      if (result.content) {
        setContent(result.content);
      } else {
        setError(result.error || 'Failed to load content.');
      }
      setIsLoading(false);
    }
    fetchData();
  }, [fetcher, payload]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Generating...</span>
          </div>
        )}
        {error && <p className="text-destructive text-sm">{error}</p>}
        {!isLoading && !error && (
            isDiagram ? (
                <Mermaid chart={content} />
            ) : (
                <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: content }} />
            )
        )}
      </CardContent>
    </Card>
  );
};

export default function ReportPage() {
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [conversationHistory, setConversationHistory] = useState('');
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
    try {
      const storedRequirements = localStorage.getItem('requirements');
      const storedHistory = localStorage.getItem('conversationHistory');
      if (storedRequirements) {
        setRequirements(JSON.parse(storedRequirements));
      } else {
        // Only redirect if there are truly no requirements to show
        if (!localStorage.getItem('requirements')) {
          router.push('/');
        }
      }
      if (storedHistory) {
        setConversationHistory(storedHistory);
      }
    } catch (error) {
      console.error('Failed to load from local storage', error);
      router.push('/');
    }
  }, [router]);

  const memoizedRequirements = useMemo(() => requirements, [requirements]);
  const memoizedHistory = useMemo(() => conversationHistory, [conversationHistory]);


  if (!isClient) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading report...</p>
        </div>
      </div>
    );
  }

  // This prevents a flash of "No requirements" before they are loaded from localStorage
  if (requirements.length === 0 && conversationHistory === '') {
     return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading requirements...</p>
        </div>
      </div>
    );
  }

  const functional = requirements.filter((r) => r.type === 'Functional');
  const nonFunctional = requirements.filter((r) => r.type === 'NonFunctional');
  const domain = requirements.filter((r) => r.type === 'Domain');

  return (
    <div className="bg-background min-h-screen">
      <Header className="no-print"/>
      <div className="fixed top-20 right-4 z-10 flex gap-2 no-print">
          <Button variant="outline" size="icon" onClick={() => router.push('/')}>
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back to Chat</span>
          </Button>
          <Button onClick={() => window.print()}>
            <Printer className="mr-2 h-4 w-4" />
            Print / Save as PDF
          </Button>
      </div>
      <main className="max-w-5xl mx-auto p-4 md:p-8 lg:p-12 print-container">
        <div className="space-y-8">
          <header className="space-y-2">
            <h1 className="text-4xl font-bold">Requirements Report</h1>
            <p className="text-muted-foreground">
              Generated by ReqBot on {new Date().toLocaleDateString()}
            </p>
          </header>
          
          <Separator />
          
          <GeneratedSection title="Executive Summary" fetcher={getExecutiveSummary} payload={memoizedRequirements} />

          <div className="space-y-6">
            <RequirementSection title="Functional Requirements" requirements={functional} />
            <RequirementSection title="Non-Functional Requirements" requirements={nonFunctional} />
            <RequirementSection title="Domain Requirements" requirements={domain} />
          </div>

          <div className="space-y-6">
            <GeneratedSection title="Activity Diagram" fetcher={getActivityDiagram} payload={memoizedRequirements} isDiagram={true} />
            <GeneratedSection title="Cost Estimation" fetcher={getCostEstimation} payload={memoizedRequirements} />
          </div>

          <GeneratedSection title="References" fetcher={getReferences} payload={memoizedHistory} />

        </div>
      </main>
    </div>
  );
}
