import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { Trash2 } from '@/components/ui/hugeicons';
import { DashboardShell } from '@/src/features/dashboard/components/DashboardShell';
import { RecordCountDialog } from '@/src/features/inventory/components/RecordCountDialog';
import {
  useCancelCountSession,
  useCountSession,
  usePostCountSession,
} from '@/src/features/inventory/api/countSessions';
import { useWarehouse } from '@/src/features/inventory/api/warehouses';
import type { CountSessionLineResponse } from '@/src/features/inventory/types/countSessions';
import { toastApiError } from '@/src/lib/api-error';

type CountSessionDetailPageProps = Readonly<{ countId: string }>;

export function CountSessionDetailPage({ countId }: CountSessionDetailPageProps) {
  const [recordingLine, setRecordingLine] = useState<CountSessionLineResponse | null>(null);
  const [postOpen, setPostOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const countQuery = useCountSession(countId);
  const count = countQuery.data;
  const warehouseQuery = useWarehouse(count?.warehouseId ?? '');
  const postMutation = usePostCountSession(countId);
  const cancelMutation = useCancelCountSession(countId);

  useEffect(() => {
    if (countQuery.isError) {
      toastApiError(
        countQuery.error,
        'Inventory count details could not be loaded. Check your connection and try again.',
        {
          403: 'You do not have permission to view inventory counts. Ask an administrator for inventory:read access.',
        },
      );
    }
  }, [countQuery.error, countQuery.isError]);

  const postCount = () => {
    postMutation.mutate(undefined, {
      onSuccess: (session) => {
        toast.success('Inventory count posted', {
          description: `${session.code} adjustments have been posted.`,
        });
        setPostOpen(false);
      },
      onError: (error) =>
        toastApiError(
          error,
          'The inventory count could not be posted. Check your connection and try again.',
          {
            403: 'You do not have permission to post inventory counts. Ask an administrator for inventory:write access.',
          },
        ),
    });
  };

  const cancelCount = () => {
    cancelMutation.mutate(undefined, {
      onSuccess: (session) => {
        toast.success('Inventory count cancelled', {
          description: `${session.code} is now cancelled.`,
        });
        setCancelOpen(false);
      },
      onError: (error) =>
        toastApiError(
          error,
          'The inventory count could not be cancelled. Check your connection and try again.',
          {
            403: 'You do not have permission to cancel inventory counts. Ask an administrator for inventory:write access.',
          },
        ),
    });
  };

  const canOperate = count?.status === 'DRAFT' || count?.status === 'COUNTING';

  return (
    <DashboardShell>
      {countQuery.isPending ? (
        <div
          className="flex w-full items-center justify-center gap-2 p-12 text-sm text-(--muted)"
          aria-live="polite"
        >
          <Spinner className="size-4 text-(--accent)" aria-label="Loading inventory count" />
          <span>Loading inventory count…</span>
        </div>
      ) : countQuery.isError ? (
        <div className="flex min-h-64 flex-col items-start justify-center gap-3" role="alert">
          <h1 className="font-display text-2xl">Inventory count unavailable</h1>
          <p className="text-sm text-(--accent-deep)">
            Inventory count details could not be loaded.
          </p>
          <Button
            type="button"
            variant="pill-ghost"
            className="border border-(--rule)"
            onClick={() => void countQuery.refetch()}
          >
            Retry
          </Button>
        </div>
      ) : count ? (
        <>
          <div className="mb-7 flex flex-wrap items-end justify-between gap-5 border-b border-(--rule) pb-6">
            <div>
              <h1 className="font-display text-[clamp(36px,4vw,48px)] leading-tight font-light tracking-[-0.03em]">
                {count.code}
              </h1>
              <p className="mt-2 font-mono text-sm text-(--ink-soft)">
                {warehouseQuery.data?.name ?? count.warehouseId}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex h-10 items-center rounded-full bg-(--paper-2) px-3 text-xs font-medium text-(--ink-soft)">
                {count.status}
              </span>
              {canOperate ? (
                <Button
                  type="button"
                  variant="pill-ghost"
                  className="bg-(--ink) text-(--paper) hover:bg-(--accent)"
                  onClick={() => setPostOpen(true)}
                  disabled={postMutation.isPending}
                >
                  Post count
                </Button>
              ) : null}
              {canOperate ? (
                <Button
                  type="button"
                  variant="pill-ghost"
                  className="text-(--accent-deep) hover:bg-(--accent-soft)"
                  onClick={() => setCancelOpen(true)}
                  disabled={cancelMutation.isPending}
                >
                  <Trash2 size={15} />
                  Cancel count
                </Button>
              ) : null}
            </div>
          </div>

          <Card className="mb-5">
            <CardHeader>
              <CardTitle>Count information</CardTitle>
              <CardDescription>
                {count.notes || 'No notes'} ·{' '}
                {count.scheduledFor ? `Scheduled ${count.scheduledFor}` : 'Not scheduled'}
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="overflow-hidden">
            <CardHeader className="border-b border-(--rule)">
              <CardTitle>Count lines</CardTitle>
              <CardDescription>Record the physical quantity for each product line.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {count.lines.length === 0 ? (
                <p className="px-5 py-12 text-center text-sm text-(--muted)">
                  This count has no lines.
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead>Line</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead className="text-right">Expected</TableHead>
                      <TableHead className="text-right">Counted</TableHead>
                      <TableHead className="text-right">Variance</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {count.lines.map((line) => (
                      <TableRow key={line.id}>
                        <TableCell className="font-mono text-xs">{line.lineNumber}</TableCell>
                        <TableCell>
                          <span className="block font-medium">{line.productName}</span>
                          <span className="mt-0.5 block font-mono text-xs text-(--muted)">
                            {line.productSku}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">{line.expectedQuantity}</TableCell>
                        <TableCell className="text-right">{line.countedQuantity ?? '—'}</TableCell>
                        <TableCell className="text-right">{line.varianceQuantity ?? '—'}</TableCell>
                        <TableCell>
                          <div className="flex justify-end">
                            {canOperate ? (
                              <Button
                                type="button"
                                variant="pill-ghost"
                                size="sm"
                                onClick={() => setRecordingLine(line)}
                              >
                                Record
                              </Button>
                            ) : (
                              <span className="text-xs text-(--muted)">Closed</span>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          {recordingLine ? (
            <RecordCountDialog
              key={recordingLine.id}
              countId={count.id}
              line={recordingLine}
              onOpenChange={(open) => {
                if (!open) setRecordingLine(null);
              }}
            />
          ) : null}

          <Dialog
            open={postOpen}
            onOpenChange={(open) => {
              if (!postMutation.isPending) setPostOpen(open);
            }}
          >
            <DialogContent className="top-[20%] sm:max-w-md">
              <DialogTitle>Post inventory count?</DialogTitle>
              <DialogDescription>
                Posting creates adjustment movements for count variances and closes this session.
              </DialogDescription>
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="pill-ghost"
                  onClick={() => setPostOpen(false)}
                  disabled={postMutation.isPending}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  variant="pill-ghost"
                  className="bg-(--ink) text-(--paper) hover:bg-(--accent)"
                  onClick={postCount}
                  disabled={postMutation.isPending}
                >
                  {postMutation.isPending ? 'Posting…' : 'Post count'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog
            open={cancelOpen}
            onOpenChange={(open) => {
              if (!cancelMutation.isPending) setCancelOpen(open);
            }}
          >
            <DialogContent className="top-[20%] sm:max-w-md">
              <DialogTitle>Cancel inventory count?</DialogTitle>
              <DialogDescription>
                The session will be cancelled and no adjustment movements will be posted.
              </DialogDescription>
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="pill-ghost"
                  onClick={() => setCancelOpen(false)}
                  disabled={cancelMutation.isPending}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  variant="pill-ghost"
                  className="bg-(--accent) text-(--paper) hover:bg-(--accent-deep)"
                  onClick={cancelCount}
                  disabled={cancelMutation.isPending}
                >
                  {cancelMutation.isPending ? 'Cancelling…' : 'Cancel count'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </>
      ) : null}
    </DashboardShell>
  );
}
