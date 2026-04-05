"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  UserCircle, 
  Mail, 
  Phone, 
  Plus, 
  X, 
  Briefcase, 
  GraduationCap, 
  Save,
  Upload,
  Loader2
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useFirestore, useUser, useDoc, useMemoFirebase } from "@/firebase";
import { doc } from "firebase/firestore";
import { updateDocumentNonBlocking, setDocumentNonBlocking } from "@/firebase/non-blocking-updates";

export default function ProfilePage() {
  const { user } = useUser();
  const db = useFirestore();
  
  const userDocRef = useMemoFirebase(() => {
    if (!db || !user) return null;
    return doc(db, 'userProfiles', user.uid);
  }, [db, user]);

  const { data: profile, isLoading } = useDoc(userDocRef);
  const [localProfile, setLocalProfile] = useState<any>(null);
  const [newSkill, setNewSkill] = useState("");

  useEffect(() => {
    if (profile) {
      setLocalProfile(profile);
    }
  }, [profile]);

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSkill && !localProfile.skills?.includes(newSkill)) {
      const updatedSkills = [...(localProfile.skills || []), newSkill];
      setLocalProfile({ ...localProfile, skills: updatedSkills });
      setNewSkill("");
    }
  };

  const removeSkill = (skill: string) => {
    const updatedSkills = localProfile.skills.filter((s: string) => s !== skill);
    setLocalProfile({ ...localProfile, skills: updatedSkills });
  };

  const handleSave = () => {
    if (!userDocRef || !localProfile) return;
    
    setDocumentNonBlocking(userDocRef, {
      ...localProfile,
      updatedAt: new Date().toISOString()
    }, { merge: true });

    toast({ title: "Profile Saved", description: "Your details have been updated successfully." });
  };

  if (isLoading || !localProfile) return <div className="py-20 flex justify-center"><Loader2 className="animate-spin" /></div>;

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
              <h3 className="font-headline font-bold text-xl">{localProfile.firstName} {localProfile.lastName}</h3>
              <p className="text-sm text-muted-foreground mb-4">{localProfile.currentJobTitle || 'Software Professional'}</p>
              <div className="w-full space-y-2 pt-4 border-t">
                 <div className="flex items-center gap-2 text-sm text-muted-foreground">
                   <Mail className="w-4 h-4" /> {localProfile.email}
                 </div>
                 {localProfile.phoneNumber && (
                   <div className="flex items-center gap-2 text-sm text-muted-foreground">
                     <Phone className="w-4 h-4" /> {localProfile.phoneNumber}
                   </div>
                 )}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/40 shadow-sm">
            <CardHeader>
              <CardTitle className="text-sm font-headline">Skills</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {localProfile.skills?.map((skill: string) => (
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
                value={localProfile.bio || ""} 
                onChange={(e) => setLocalProfile({ ...localProfile, bio: e.target.value })}
                className="min-h-[120px]"
                placeholder="Write a brief professional summary..."
              />
            </CardContent>
          </Card>

          <Card className="border-border/40 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="font-headline">Experience & Education</CardTitle>
                <CardDescription>Your career and academic history.</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Label>Current Company</Label>
              <Input 
                value={localProfile.currentCompany || ""} 
                onChange={(e) => setLocalProfile({ ...localProfile, currentCompany: e.target.value })}
              />
              <Label>Current Title</Label>
              <Input 
                value={localProfile.currentJobTitle || ""} 
                onChange={(e) => setLocalProfile({ ...localProfile, currentJobTitle: e.target.value })}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
