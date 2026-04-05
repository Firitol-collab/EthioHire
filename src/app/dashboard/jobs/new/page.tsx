"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Sparkles, Link as LinkIcon, Loader2, Search } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { extractJobDetails } from "@/ai/flows/extract-job-details";
import { useFirestore, useUser } from "@/firebase";
import { collection, doc, serverTimestamp } from "firebase/firestore";
import { addDocumentNonBlocking } from "@/firebase/non-blocking-updates";

export default function NewJobPage() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const db = useFirestore();
  const { user } = useUser();

  const handleScrape = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.includes("linkedin.com/jobs")) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid LinkedIn job posting URL.",
        variant: "destructive",
      });
      return;
    }

    if (!user || !db) return;

    setLoading(true);
    try {
      const extracted = await extractJobDetails({ url });
      
      const jobRef = collection(db, 'jobPostings');
      const newJobData = {
        ...extracted,
        jobUrl: url,
        extractedAt: new Date().toISOString(),
        scrapedByUserId: user.uid,
        status: 'saved',
      };

      // Add to global job postings
      const jobDoc = await addDocumentNonBlocking(jobRef, newJobData);
      
      // Also link to user's applications
      const appRef = collection(db, 'userProfiles', user.uid, 'applications');
      addDocumentNonBlocking(appRef, {
        jobPostingId: jobDoc?.id || 'temp-id',
        status: 'saved',
        userId: user.uid,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      toast({
        title: "Job Extracted!",
        description: `Analyzed "${extracted.title}" at ${extracted.companyName}.`,
      });
      
      router.push("/dashboard/jobs");
    } catch (e) {
      toast({
        title: "Extraction Failed",
        description: "Could not parse the job posting. Please try another URL.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-headline font-bold text-primary">New Job Application</h1>
        <p className="text-muted-foreground">Paste a LinkedIn job URL and let EthioHire handle the rest.</p>
      </div>

      <Card className="border-border/40 shadow-xl">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
            <LinkIcon className="w-6 h-6 text-primary" />
          </div>
          <CardTitle className="font-headline">Import from LinkedIn</CardTitle>
          <CardDescription>
            We'll automatically extract the job title, company, and description using AI.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleScrape} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="linkedin-url">LinkedIn Job URL</Label>
              <div className="relative">
                <Input
                  id="linkedin-url"
                  placeholder="https://www.linkedin.com/jobs/view/..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="pl-10 h-12 rounded-xl"
                  required
                />
                <Search className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
              </div>
            </div>
            <Button 
              type="submit" 
              className="w-full h-12 rounded-xl text-lg font-bold" 
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Analyzing Job Posting...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Analyze with AI
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { title: "Extract Details", desc: "No more copy-pasting descriptions manually.", icon: Search },
          { title: "Match Score", desc: "See how well your profile fits the requirements.", icon: Sparkles },
          { title: "Draft CV", desc: "Get a tailored version of your resume instantly.", icon: Sparkles },
        ].map((feat, i) => (
          <div key={i} className="flex flex-col items-center text-center p-4">
            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center mb-3">
              <feat.icon className="w-5 h-5 text-primary" />
            </div>
            <h4 className="font-bold text-sm mb-1">{feat.title}</h4>
            <p className="text-xs text-muted-foreground">{feat.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
