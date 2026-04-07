"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  ExternalLink, 
  Clock, 
  CheckCircle2, 
  Loader2,
  Briefcase
} from "lucide-react";
import Link from "next/link";
import { useFirestore, useCollection, useMemoFirebase, useUser } from "@/firebase";
import { collection, query, orderBy, where } from "firebase/firestore";

export default function ApplicationsPage() {
  const { user } = useUser();
  const db = useFirestore();

  const applicationsQuery = useMemoFirebase(() => {
    if (!db || !user) return null;
    return query(
      collection(db, 'userProfiles', user.uid, 'applications'),
      where('status', 'in', ['applied', 'interview', 'offered', 'rejected']),
      orderBy('updatedAt', 'desc')
    );
  }, [db, user?.uid]); // Use uid for more stable dependency

  const { data: applications, isLoading } = useCollection(applicationsQuery);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-headline font-bold text-primary">My Applications</h1>
        <p className="text-muted-foreground mt-1">Track the progress of your active job submissions.</p>
      </div>

      <div className="grid gap-4">
        {isLoading ? (
          <div className="py-20 flex justify-center">
            <Loader2 className="animate-spin text-primary h-8 w-8" />
          </div>
        ) : applications && applications.length > 0 ? (
          applications.map((app) => (
            <Card key={app.id} className="border-border/40 shadow-sm hover:shadow-md transition-all group">
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row md:items-center p-6 gap-6">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <FileText className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-headline font-bold text-lg truncate">
                        {app.jobTitle || "Job Application"}
                      </h3>
                      <Badge variant={getStatusVariant(app.status)} className="capitalize">
                        {app.status}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> 
                        Updated {new Date(app.updatedAt).toLocaleDateString()}
                      </span>
                      {app.status === 'interview' && (
                        <span className="flex items-center gap-1 text-accent font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5" /> 
                          Interview Scheduled
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link href={`/dashboard/jobs/${app.jobPostingId}`}>
                      <Button variant="outline" className="rounded-xl">
                        View Log <ExternalLink className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="py-20 text-center border-2 border-dashed rounded-2xl bg-muted/20">
            <Briefcase className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-lg font-headline font-bold">No active applications</h3>
            <p className="text-muted-foreground max-w-xs mx-auto mb-6">You haven't applied to any jobs yet. Browse your saved jobs to get started.</p>
            <Link href="/dashboard/jobs">
              <Button className="rounded-xl">Go to Job Tracker</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

function getStatusVariant(status: string) {
  switch (status) {
    case 'interview': return 'default';
    case 'applied': return 'secondary';
    case 'offered': return 'default';
    case 'rejected': return 'destructive';
    default: return 'outline';
  }
}
