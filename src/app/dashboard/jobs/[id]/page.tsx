"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { MOCK_JOBS, MOCK_USER_PROFILE } from "@/lib/mock-data";
import { Job } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Sparkles, 
  MapPin, 
  Building2, 
  Calendar, 
  ExternalLink, 
  FileText, 
  CheckCircle2, 
  ArrowRight,
  Loader2,
  Copy,
  Download
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";

// Import AI Flows
import { calculateJobMatchScore } from "@/ai/flows/calculate-job-match-score";
import { generateTailoredCv } from "@/ai/flows/generate-tailored-cv";
import { generatePersonalizedCoverLetter } from "@/ai/flows/generate-personalized-cover-letter";

export default function JobDetailPage() {
  const { id } = useParams();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState<Record<string, boolean>>({
    match: false,
    cv: false,
    cover: false
  });

  const [aiData, setAiData] = useState<{
    matchScore?: number;
    matchExplanation?: string;
    tailoredCv?: string;
    coverLetter?: string;
  }>({});

  useEffect(() => {
    const foundJob = MOCK_JOBS.find(j => j.id === id);
    if (foundJob) {
      setJob(foundJob);
      setAiData({
        matchScore: foundJob.matchScore,
        matchExplanation: "This matches your core experience in frontend development."
      });
    }
  }, [id]);

  const handleGenerateMatch = async () => {
    if (!job) return;
    setLoading(prev => ({ ...prev, match: true }));
    try {
      const result = await calculateJobMatchScore({
        userSkills: MOCK_USER_PROFILE.skills,
        userExperienceEducation: JSON.stringify(MOCK_USER_PROFILE.experience) + JSON.stringify(MOCK_USER_PROFILE.education),
        userCvContent: MOCK_USER_PROFILE.summary,
        jobDescription: job.description
      });
      setAiData(prev => ({ ...prev, matchScore: result.matchScore, matchExplanation: result.explanation }));
      toast({ title: "Analysis Complete", description: "Your match score has been updated." });
    } catch (e) {
      toast({ title: "Error", description: "Failed to generate match score.", variant: "destructive" });
    } finally {
      setLoading(prev => ({ ...prev, match: false }));
    }
  };

  const handleGenerateCv = async () => {
    if (!job) return;
    setLoading(prev => ({ ...prev, cv: true }));
    try {
      const result = await generateTailoredCv({
        jobDescription: job.description,
        userProfile: MOCK_USER_PROFILE
      });
      setAiData(prev => ({ ...prev, tailoredCv: result.tailoredCvContent }));
      toast({ title: "CV Tailored", description: "A custom CV for this role has been generated." });
    } catch (e) {
      toast({ title: "Error", description: "Failed to generate tailored CV.", variant: "destructive" });
    } finally {
      setLoading(prev => ({ ...prev, cv: false }));
    }
  };

  const handleGenerateCover = async () => {
    if (!job) return;
    setLoading(prev => ({ ...prev, cover: true }));
    try {
      const result = await generatePersonalizedCoverLetter({
        jobDescription: job.description,
        userProfileSummary: MOCK_USER_PROFILE.summary
      });
      setAiData(prev => ({ ...prev, coverLetter: result.coverLetter }));
      toast({ title: "Cover Letter Ready", description: "Personalized cover letter generated." });
    } catch (e) {
      toast({ title: "Error", description: "Failed to generate cover letter.", variant: "destructive" });
    } finally {
      setLoading(prev => ({ ...prev, cover: false }));
    }
  };

  if (!job) return <div className="flex justify-center py-20"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge className="capitalize">{job.status}</Badge>
            <span className="text-sm text-muted-foreground flex items-center gap-1">
              <Calendar className="w-3 h-3" /> Added on {job.dateAdded}
            </span>
          </div>
          <h1 className="text-3xl font-headline font-bold text-primary">{job.title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
            <span className="flex items-center gap-1"><Building2 className="w-4 h-4" /> {job.company}</span>
            <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {job.location}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <a href={job.url} target="_blank" rel="noopener noreferrer">
              View on LinkedIn <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </Button>
          <Button className="bg-primary hover:bg-primary/90">
            Apply Now <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          <Card className="border-border/40 shadow-sm">
            <CardHeader>
              <CardTitle className="font-headline">Job Description</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {job.description}
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="ai-assistant" className="w-full">
            <TabsList className="grid w-full grid-cols-3 rounded-xl">
              <TabsTrigger value="ai-assistant" className="gap-2">
                <Sparkles className="w-4 h-4" /> AI Assistant
              </TabsTrigger>
              <TabsTrigger value="tailored-cv" className="gap-2">
                <FileText className="w-4 h-4" /> Tailored CV
              </TabsTrigger>
              <TabsTrigger value="cover-letter" className="gap-2">
                <FileText className="w-4 h-4" /> Cover Letter
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="ai-assistant" className="mt-6 space-y-6">
              <Card className="border-border/40 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-headline">Match Analysis</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex flex-col md:flex-row md:items-center gap-8">
                    <div className="relative h-24 w-24 flex items-center justify-center">
                       <svg className="w-full h-full transform -rotate-90">
                        <circle
                          cx="48"
                          cy="48"
                          r="40"
                          stroke="currentColor"
                          strokeWidth="8"
                          fill="transparent"
                          className="text-secondary"
                        />
                        <circle
                          cx="48"
                          cy="48"
                          r="40"
                          stroke="currentColor"
                          strokeWidth="8"
                          fill="transparent"
                          strokeDasharray={251.2}
                          strokeDashoffset={251.2 - (251.2 * (aiData.matchScore || 0)) / 100}
                          className="text-accent transition-all duration-1000 ease-out"
                        />
                      </svg>
                      <span className="absolute text-2xl font-bold">{aiData.matchScore || 0}%</span>
                    </div>
                    <div className="flex-1 space-y-2">
                      <h4 className="font-bold">Match Summary</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {aiData.matchExplanation || "Click 'Update Match Analysis' to see how your skills align with this job requirement."}
                      </p>
                    </div>
                  </div>
                  <Button 
                    onClick={handleGenerateMatch} 
                    disabled={loading.match}
                    variant="outline"
                    className="w-full"
                  >
                    {loading.match ? <Loader2 className="animate-spin mr-2" /> : <Sparkles className="mr-2 h-4 w-4" />}
                    Update Match Analysis
                  </Button>
                </CardContent>
              </Card>

              <div className="grid md:grid-cols-2 gap-4">
                <Card className="border-border/40 shadow-sm hover:border-accent/50 transition-colors cursor-pointer" onClick={handleGenerateCv}>
                  <CardContent className="pt-6">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <FileText className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="font-bold mb-2">Tailor My CV</h3>
                    <p className="text-xs text-muted-foreground mb-4">Generate a markdown CV optimized for this role.</p>
                    <Button variant="link" className="p-0 text-primary h-auto" disabled={loading.cv}>
                      {loading.cv ? "Generating..." : "Generate CV"}
                    </Button>
                  </CardContent>
                </Card>
                <Card className="border-border/40 shadow-sm hover:border-accent/50 transition-colors cursor-pointer" onClick={handleGenerateCover}>
                  <CardContent className="pt-6">
                    <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                      <Sparkles className="w-5 h-5 text-accent" />
                    </div>
                    <h3 className="font-bold mb-2">Write Cover Letter</h3>
                    <p className="text-xs text-muted-foreground mb-4">Create a personalized message for the hiring team.</p>
                    <Button variant="link" className="p-0 text-accent h-auto" disabled={loading.cover}>
                      {loading.cover ? "Generating..." : "Generate Letter"}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="tailored-cv">
              <Card className="border-border/40 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="font-headline">Your Tailored CV</CardTitle>
                    <CardDescription>AI-generated markdown optimized for {job.company}.</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => {
                      navigator.clipboard.writeText(aiData.tailoredCv || "");
                      toast({ title: "Copied", description: "CV content copied to clipboard." });
                    }}>
                      <Copy className="w-4 h-4 mr-2" /> Copy
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {aiData.tailoredCv ? (
                    <div className="bg-muted p-6 rounded-xl font-mono text-sm whitespace-pre-wrap max-h-[600px] overflow-y-auto">
                      {aiData.tailoredCv}
                    </div>
                  ) : (
                    <div className="py-20 text-center border-2 border-dashed rounded-xl space-y-4">
                      <p className="text-muted-foreground">No tailored CV generated yet.</p>
                      <Button onClick={handleGenerateCv} disabled={loading.cv}>
                        {loading.cv ? <Loader2 className="animate-spin" /> : "Generate Now"}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="cover-letter">
              <Card className="border-border/40 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="font-headline">Personalized Cover Letter</CardTitle>
                    <CardDescription>Ready to use with your application.</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => {
                    navigator.clipboard.writeText(aiData.coverLetter || "");
                    toast({ title: "Copied", description: "Cover letter copied to clipboard." });
                  }}>
                    <Copy className="w-4 h-4 mr-2" /> Copy
                  </Button>
                </CardHeader>
                <CardContent>
                  {aiData.coverLetter ? (
                    <div className="bg-muted p-6 rounded-xl text-sm leading-relaxed whitespace-pre-wrap">
                      {aiData.coverLetter}
                    </div>
                  ) : (
                    <div className="py-20 text-center border-2 border-dashed rounded-xl space-y-4">
                      <p className="text-muted-foreground">Need a cover letter?</p>
                      <Button onClick={handleGenerateCover} disabled={loading.cover}>
                        {loading.cover ? <Loader2 className="animate-spin" /> : "Generate Now"}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card className="border-border/40 shadow-sm sticky top-24">
            <CardHeader>
              <CardTitle className="font-headline text-lg">Application Checklist</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: "Review Job Requirements", done: true },
                { label: "Update Profile Skills", done: true },
                { label: "Generate Tailored CV", done: !!aiData.tailoredCv },
                { label: "Write Cover Letter", done: !!aiData.coverLetter },
                { label: "Submit on LinkedIn", done: job.status === 'applied' || job.status === 'interview' },
              ].map((step, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center ${step.done ? 'bg-green-500 text-white' : 'border-2 border-muted'}`}>
                    {step.done && <CheckCircle2 className="w-3 h-3" />}
                  </div>
                  <span className={`text-sm ${step.done ? 'text-foreground' : 'text-muted-foreground'}`}>{step.label}</span>
                </div>
              ))}
              <div className="pt-4 border-t mt-4">
                <Button className="w-full bg-primary" onClick={() => toast({ title: "Success", description: "Application status updated to Applied." })}>
                  Mark as Applied
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}