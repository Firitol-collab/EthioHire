import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Briefcase, FileText, CheckCircle, Clock, ArrowUpRight, Sparkles } from "lucide-react";
import { MOCK_JOBS } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const stats = [
    { name: 'Total Saved', value: MOCK_JOBS.length, icon: Briefcase, color: 'text-primary' },
    { name: 'Applications Sent', value: MOCK_JOBS.filter(j => j.status === 'applied' || j.status === 'interview').length, icon: FileText, color: 'text-accent' },
    { name: 'Interviews', value: MOCK_JOBS.filter(j => j.status === 'interview').length, icon: CheckCircle, color: 'text-green-500' },
    { name: 'Response Rate', value: '45%', icon: Clock, color: 'text-orange-500' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold text-primary">Welcome back, Abebe</h1>
          <p className="text-muted-foreground mt-1">Here's what's happening with your job search.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-secondary rounded-xl border border-border/50">
          <Sparkles className="w-4 h-4 text-accent" />
          <span className="text-sm font-medium">Daily AI Limit: 3/3 left</span>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.name} className="border-border/40 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.name}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">+2 from last week</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-border/40 shadow-sm col-span-1">
          <CardHeader>
            <CardTitle className="font-headline">Recent Job Activity</CardTitle>
            <CardDescription>Your latest saved and applied jobs.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {MOCK_JOBS.slice(0, 4).map((job) => (
                <div key={job.id} className="flex items-center justify-between group">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none group-hover:text-primary transition-colors">{job.title}</p>
                    <p className="text-xs text-muted-foreground">{job.company} • {job.location}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={job.status === 'interview' ? 'default' : 'secondary'} className="capitalize">
                      {job.status}
                    </Badge>
                    <Link href={`/dashboard/jobs/${job.id}`}>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <ArrowUpRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            <Link href="/dashboard/jobs">
              <Button variant="outline" className="w-full mt-6">View All Jobs</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="border-border/40 shadow-sm col-span-1 bg-primary text-primary-foreground">
          <CardHeader>
            <CardTitle className="font-headline text-white">AI Assistant Insight</CardTitle>
            <CardDescription className="text-primary-foreground/70">Boost your application success.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-4 bg-white/10 rounded-xl border border-white/10">
              <h4 className="font-bold flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-accent" />
                Improve your Match Score
              </h4>
              <p className="text-sm text-primary-foreground/80 leading-relaxed">
                Your profile is a 92% match for the "UI/UX Designer" role at Gebeya Inc. We've generated a tailored cover letter that emphasizes your Next.js expertise.
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-xs text-primary-foreground/50 uppercase tracking-widest font-bold">Quick Tips</p>
              <ul className="text-sm space-y-2 list-disc list-inside text-primary-foreground/80">
                <li>Add "Kubernetes" to your skills for cloud roles.</li>
                <li>Your CV works best for Frontend positions.</li>
                <li>4 jobs from Safaricom match your profile.</li>
              </ul>
            </div>
            <Link href="/dashboard/jobs/new">
              <Button className="w-full bg-accent text-white hover:bg-accent/90 border-none">
                Start New Application
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
