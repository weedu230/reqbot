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
  isDiagram = false
}: {
  content: string;
  isLoading: boolean;
  error: string;
  isDiagram?: boolean;
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
    return <p className="text-destructive text-sm">{error}</p>;
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


type ReportData = {
  summary: string;
  diagram: string;
  estimation: string;
  references: string;
};

type ReportErrors = {
  summary?: string;
  diagram?: string;
  estimation?: string;
  references?: string;
};


export default function ReportPage() {
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [conversationHistory, setConversationHistory] = useState('');
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  const [reportData, setReportData] = useState<Partial<ReportData>>({});
  const [reportErrors, setReportErrors] = useState<ReportErrors>({});
  const [isGenerating, setIsGenerating] = useState(true);

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
        setConversationHistory(storedHistory);
      }

      if (!reqs) {
        router.push('/');
      } else {
        // Fetch all generated data in parallel
        const fetchAllData = async () => {
          setIsGenerating(true);
          const [summaryResult, diagramResult, estimationResult, referencesResult] = await Promise.all([
            getExecutiveSummary(storedRequirements),
            getActivityDiagram(storedRequirements),
            getCostEstimation(storedRequirements),
            getReferences(storedHistory),
          ]);

          setReportData({
            summary: summaryResult.content,
            diagram: diagramResult.content,
            estimation: estimationResult.content,
            references: referencesResult.content,
          });

          setReportErrors({
            summary: summaryResult.error,
            diagram: diagramResult.error,
            estimation: estimationResult.error,
            references: referencesResult.error,
          });

          setIsGenerating(false);
        };
        fetchAllData();
      }
    } catch (error) {
      console.error('Failed to load from local storage or generate report', error);
      router.push('/');
    }
  }, [router]);


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
              <GeneratedSectionContent content={reportData.summary || ''} isLoading={isGenerating} error={reportErrors.summary || ''} />
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
                <GeneratedSectionContent content={reportData.diagram || ''} isLoading={isGenerating} error={reportErrors.diagram || ''} isDiagram={true} />
              </CardContent>
            </Card>
             <Card>
              <CardHeader><CardTitle className="text-xl md:text-2xl">Cost Estimation</CardTitle></CardHeader>
              <CardContent>
                <GeneratedSectionContent content={reportData.estimation || ''} isLoading={isGenerating} error={reportErrors.estimation || ''} />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader><CardTitle className="text-xl md:text-2xl">References</CardTitle></CardHeader>
            <CardContent>
              <GeneratedSectionContent content={reportData.references || ''} isLoading={isGenerating} error={reportErrors.references || ''} />
            </CardContent>
          </Card>

        </div>
      </main>
    </div>
  );
}
