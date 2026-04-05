"use client";

import { useState } from "react";
import { MOCK_JOBS } from "@/lib/mock-data";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Filter, 
  Plus, 
  MapPin, 
  Building2, 
  ChevronRight,
  MoreVertical
} from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function JobsPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const filteredJobs = MOCK_JOBS.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(search.toLowerCase()) || 
                         job.company.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || job.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold text-primary">Job Tracker</h1>
          <p className="text-muted-foreground">Manage and track your saved LinkedIn job opportunities.</p>
        </div>
        <Link href="/dashboard/jobs/new">
          <Button className="rounded-xl shadow-lg shadow-primary/20 gap-2">
            <Plus className="w-5 h-5" /> Import New Job
          </Button>
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search by title or company..." 
            className="pl-9 h-10 rounded-xl"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
          {['all', 'saved', 'applied', 'interview', 'rejected'].map((s) => (
            <Button 
              key={s} 
              variant={filter === s ? "default" : "outline"}
              size="sm"
              className="capitalize rounded-full px-4 h-9"
              onClick={() => setFilter(s)}
            >
              {s}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid gap-4">
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job) => (
            <Card key={job.id} className="border-border/40 shadow-sm hover:shadow-md transition-shadow group">
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row md:items-center p-6 gap-6">
                  <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center shrink-0">
                    <Building2 className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-headline font-bold text-lg group-hover:text-primary transition-colors truncate">
                        {job.title}
                      </h3>
                      <Badge variant={job.status === 'interview' ? 'default' : 'secondary'} className="capitalize">
                        {job.status}
                      </Badge>
                      {job.matchScore && (
                        <Badge variant="outline" className="text-accent border-accent/20 bg-accent/5">
                          {job.matchScore}% AI Match
                        </Badge>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1"><Building2 className="w-3.5 h-3.5" /> {job.company}</span>
                      <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {job.location}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Link href={`/dashboard/jobs/${job.id}`}>
                      <Button variant="ghost" className="rounded-xl group-hover:bg-primary group-hover:text-white transition-all">
                        View Details <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                    </Link>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Mark as Applied</DropdownMenuItem>
                        <DropdownMenuItem>Move to Interview</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">Delete Job</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="py-20 text-center border-2 border-dashed rounded-2xl bg-muted/20">
            <Briefcase className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-lg font-headline font-bold">No jobs found</h3>
            <p className="text-muted-foreground max-w-xs mx-auto mb-6">Start by importing a job from LinkedIn to track your progress.</p>
            <Link href="/dashboard/jobs/new">
              <Button variant="outline" className="rounded-xl">Import First Job</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}