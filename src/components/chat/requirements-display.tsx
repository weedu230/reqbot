'use client';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { Requirement } from '@/lib/types';

interface RequirementsDisplayProps {
  requirements: Requirement[];
}

const RequirementTable = ({
  requirements,
  title,
}: {
  requirements: Requirement[];
  title: string;
}) => (
  <AccordionItem value={title.toLowerCase().replace(' ', '-')}>
    <AccordionTrigger>
      {title} ({requirements.length})
    </AccordionTrigger>
    <AccordionContent>
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
        <p className="text-muted-foreground text-sm p-4 text-center">
          No {title.toLowerCase()} requirements were extracted.
        </p>
      )}
    </AccordionContent>
  </AccordionItem>
);

export default function RequirementsDisplay({
  requirements,
}: RequirementsDisplayProps) {
  const functional = requirements.filter((r) => r.type === 'Functional');
  const nonFunctional = requirements.filter(
    (r) => r.type === 'NonFunctional'
  );
  const domain = requirements.filter((r) => r.type === 'Domain');
  const inverse = requirements.filter((r) => r.type === 'Inverse');

  return (
    <div className="my-4 p-4 border rounded-lg bg-background animate-fade-in">
      <h3 className="text-lg font-semibold mb-2">Extracted Requirements</h3>
      <Accordion type="multiple" defaultValue={['functional', 'non-functional', 'domain', 'inverse']}>
        <RequirementTable requirements={functional} title="Functional" />
        <RequirementTable requirements={nonFunctional} title="Non-Functional" />
        <RequirementTable requirements={domain} title="Domain" />
        <RequirementTable requirements={inverse} title="Inverse" />
      </Accordion>
    </div>
  );
}
