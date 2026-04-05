"use client";

import { useState } from "react";
import { MOCK_USER_PROFILE } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  UserCircle, 
  Mail, 
  Phone, 
  Linkedin, 
  Plus, 
  X, 
  Briefcase, 
  GraduationCap, 
  Save,
  Upload
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function ProfilePage() {
  const [profile, setProfile] = useState(MOCK_USER_PROFILE);
  const [newSkill, setNewSkill] = useState("");

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSkill && !profile.skills.includes(newSkill)) {
      setProfile(prev => ({ ...prev, skills: [...prev.skills, newSkill] }));
      setNewSkill("");
    }
  };

  const removeSkill = (skill: string) => {
    setProfile(prev => ({ ...prev, skills: prev.skills.filter(s => s !== skill) }));
  };

  const handleSave = () => {
    toast({ title: "Profile Saved", description: "Your details have been updated successfully." });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-headline font-bold text-primary">Your Profile</h1>
          <p className="text-muted-foreground">Manage your information to help the AI tailor your applications.</p>
        </div>
        <Button onClick={handleSave} className="gap-2">
          <Save className="w-4 h-4" /> Save Profile
        </Button>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-1 space-y-6">
          <Card className="border-border/40 shadow-sm overflow-hidden">
            <div className="h-24 bg-primary"></div>
            <CardContent className="relative pt-0 flex flex-col items-center text-center">
              <div className="relative -mt-12 mb-4">
                <div className="w-24 h-24 rounded-full border-4 border-background bg-secondary flex items-center justify-center overflow-hidden">
                  <UserCircle className="w-16 h-16 text-muted-foreground" />
                </div>
                <Button size="icon" variant="secondary" className="absolute bottom-0 right-0 h-8 w-8 rounded-full shadow-md">
                   <Upload className="h-4 w-4" />
                </Button>
              </div>
              <h3 className="font-headline font-bold text-xl">{profile.name}</h3>
              <p className="text-sm text-muted-foreground mb-4">Software Engineer</p>
              <div className="w-full space-y-2 pt-4 border-t">
                 <div className="flex items-center gap-2 text-sm text-muted-foreground">
                   <Mail className="w-4 h-4" /> {profile.email}
                 </div>
                 <div className="flex items-center gap-2 text-sm text-muted-foreground">
                   <Phone className="w-4 h-4" /> {profile.phone}
                 </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/40 shadow-sm">
            <CardHeader>
              <CardTitle className="text-sm font-headline">Skills</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill) => (
                  <Badge key={skill} variant="secondary" className="gap-1 px-3 py-1">
                    {skill}
                    <button onClick={() => removeSkill(skill)} className="hover:text-destructive">
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <form onSubmit={handleAddSkill} className="flex gap-2">
                <Input 
                  placeholder="Add skill..." 
                  value={newSkill} 
                  onChange={(e) => setNewSkill(e.target.value)}
                  className="h-9"
                />
                <Button size="sm" type="submit"><Plus className="w-4 h-4" /></Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2 space-y-6">
          <Card className="border-border/40 shadow-sm">
            <CardHeader>
              <CardTitle className="font-headline">Professional Summary</CardTitle>
              <CardDescription>A short bio used to contextualize your applications.</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea 
                value={profile.summary} 
                onChange={(e) => setProfile(prev => ({ ...prev, summary: e.target.value }))}
                className="min-h-[120px]"
                placeholder="Write a brief professional summary..."
              />
            </CardContent>
          </Card>

          <Card className="border-border/40 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="font-headline">Work Experience</CardTitle>
                <CardDescription>Your career history.</CardDescription>
              </div>
              <Button variant="outline" size="sm" className="gap-2">
                <Plus className="w-4 h-4" /> Add Experience
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              {profile.experience.map((exp) => (
                <div key={exp.id} className="relative pl-6 border-l-2 border-muted pb-6 last:pb-0">
                  <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                    <Briefcase className="w-2 h-2 text-white" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-lg">{exp.title}</h4>
                    <p className="text-primary font-medium">{exp.company}</p>
                    <p className="text-xs text-muted-foreground">{exp.startDate} - {exp.endDate}</p>
                    <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{exp.description}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-border/40 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="font-headline">Education</CardTitle>
                <CardDescription>Academic background.</CardDescription>
              </div>
              <Button variant="outline" size="sm" className="gap-2">
                <Plus className="w-4 h-4" /> Add Education
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              {profile.education.map((edu) => (
                <div key={edu.id} className="relative pl-6 border-l-2 border-muted pb-6 last:pb-0">
                  <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-accent flex items-center justify-center">
                    <GraduationCap className="w-2 h-2 text-white" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-lg">{edu.degree}</h4>
                    <p className="text-accent font-medium">{edu.institution}</p>
                    <p className="text-xs text-muted-foreground">{edu.startDate} - {edu.endDate}</p>
                    {edu.description && <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{edu.description}</p>}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}