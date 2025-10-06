
'use client';

import { useCallback, useEffect, useState } from 'react';
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
import { Printer, ArrowLeft, Loader2, RefreshCw } from 'lucide-react';
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
      <CardTitle className="text-xl md:text-2xl">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      {requirements.length > 0 ? (
        <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">ID</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right whitespace-nowrap">Priority</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requirements.map((req) => (
              <TableRow key={req.id}>
                <TableCell className="font-medium">{req.id}</TableCell>
                <TableCell className="whitespace-normal">{req.description}</TableCell>
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
        </div>
      ) : (
        <p className="text-muted-foreground text-sm">No {title.toLowerCase()} requirements.</p>
      )}
    </CardContent>
  </Card>
);

const GeneratedSectionContent = ({
  content,
  isLoading,
  error,
  isDiagram = false,
  onRetry,
}: {
  content: string;
  isLoading: boolean;
  error: string;
  isDiagram?: boolean;
  onRetry?: () => void;
}) => {
  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>Generating...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-2 text-sm">
        <p className="text-destructive">{error}</p>
        {onRetry && (
          <Button variant="secondary" size="sm" onClick={onRetry}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry
          </Button>
        )}
      </div>
    );
  }

  if (isDiagram) {
    return <Mermaid chart={content} />;
  }

  return (
    <div
      className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
};


type ReportSectionState = {
  content: string;
  isLoading: boolean;
  error: string;
};

const initialSectionState: ReportSectionState = {
  content: '',
  isLoading: true,
  error: '',
};

export default function ReportPage() {
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [conversationHistory, setConversationHistory] = useState('');
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  const [summaryState, setSummaryState] = useState(initialSectionState);
  const [diagramState, setDiagramState] = useState(initialSectionState);
  const [estimationState, setEstimationState] = useState(initialSectionState);
  const [referencesState, setReferencesState] = useState(initialSectionState);

  const fetchSummary = useCallback(async (reqs: Requirement[]) => {
    setSummaryState({ content: '', error: '', isLoading: true });
    getExecutiveSummary(reqs).then(result => {
      setSummaryState({
        content: result.content || '',
        error: result.error || '',
        isLoading: false,
      });
    });
  }, []);

  const fetchDiagram = useCallback(async (reqs: Requirement[]) => {
    setDiagramState({ content: '', error: '', isLoading: true });
    getActivityDiagram(reqs).then(result => {
      setDiagramState({
        content: result.content || '',
        error: result.error || '',
        isLoading: false,
      });
    });
  }, []);

  const fetchEstimation = useCallback(async (reqs: Requirement[]) => {
    setEstimationState({ content: '', error: '', isLoading: true });
    getCostEstimation(reqs).then(result => {
      setEstimationState({
        content: result.content || '',
        error: result.error || '',
        isLoading: false,
      });
    });
  }, []);

  const fetchReferences = useCallback(async (hist: string) => {
    setReferencesState({ content: '', error: '', isLoading: true });
    getReferences(hist).then(result => {
      setReferencesState({
        content: result.content || '',
        error: result.error || '',
        isLoading: false,
      });
    });
  }, []);


  useEffect(() => {
    setIsClient(true);
    let storedRequirements: Requirement[] = [];
    let storedHistory = '';

    try {
      const reqs = localStorage.getItem('requirements');
      const hist = localStorage.getItem('conversationHistory');

      if (reqs) {
        storedRequirements = JSON.parse(reqs);
        setRequirements(storedRequirements);
      }
      if (hist) {
        storedHistory = hist;
        setConversationHistory(hist);
      }

      if (!reqs) {
        router.push('/');
        return;
      }
      
      fetchSummary(storedRequirements);
      fetchDiagram(storedRequirements);
      fetchEstimation(storedRequirements);
      fetchReferences(storedHistory);

    } catch (error) {
      console.error('Failed to load from local storage or generate report', error);
      router.push('/');
    }
  }, [router, fetchSummary, fetchDiagram, fetchEstimation, fetchReferences]);


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

  const functional = requirements.filter((r) => r.type === 'Functional');
  const nonFunctional = requirements.filter((r) => r.type === 'NonFunctional');
  const domain = requirements.filter((r) => r.type === 'Domain');
  const inverse = requirements.filter((r) => r.type === 'Inverse');

  return (
    <div className="bg-background min-h-screen">
      <Header className="no-print"/>
      <div className="fixed top-20 right-4 z-10 flex flex-col sm:flex-row gap-2 no-print">
          <Button variant="outline" size="icon" onClick={() => router.push('/')}>
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back to Chat</span>
          </Button>
          <Button onClick={() => window.print()}>
            <Printer className="mr-0 sm:mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Print / PDF</span>
          </Button>
      </div>
      <main className="max-w-5xl mx-auto p-4 md:p-8 lg:p-12 print-container">
        <div className="space-y-8">
          <header className="space-y-2 mt-20 sm:mt-0">
            <h1 className="text-3xl md:text-4xl font-bold">Requirements Report</h1>
            <p className="text-muted-foreground">
              Generated by ReqBot on {new Date().toLocaleDateString()}
            </p>
          </header>
          
          <Separator />
          
           <Card>
            <CardHeader><CardTitle className="text-xl md:text-2xl">Executive Summary</CardTitle></CardHeader>
            <CardContent>
              <GeneratedSectionContent {...summaryState} onRetry={() => fetchSummary(requirements)} />
            </CardContent>
          </Card>

          <div className="space-y-6">
            <RequirementSection title="Functional Requirements" requirements={functional} />
            <RequirementSection title="Non-Functional Requirements" requirements={nonFunctional} />
            <RequirementSection title="Domain Requirements" requirements={domain} />
            <RequirementSection title="Inverse Requirements" requirements={inverse} />
          </div>

          <div className="space-y-6">
             <Card>
              <CardHeader><CardTitle className="text-xl md:text-2xl">Activity Diagram</CardTitle></CardHeader>
              <CardContent>
                <GeneratedSectionContent {...diagramState} isDiagram={true} onRetry={() => fetchDiagram(requirements)} />
              </CardContent>
            </Card>
             <Card>
              <CardHeader><CardTitle className="text-xl md:text-2xl">Cost Estimation</CardTitle></CardHeader>
              <CardContent>
                <GeneratedSectionContent {...estimationState} onRetry={() => fetchEstimation(requirements)} />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader><CardTitle className="text-xl md:text-2xl">References</CardTitle></CardHeader>
            <CardContent>
              <GeneratedSectionContent {...referencesState} onRetry={() => fetchReferences(conversationHistory)} />
            </CardContent>
          </Card>

        </div>
      </main>
    </div>
  );
}
