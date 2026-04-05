"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, CreditCard, Sparkles, CheckCircle2 } from "lucide-react";
import { useUser, useDoc, useFirestore, useMemoFirebase } from "@/firebase";
import { doc } from "firebase/firestore";
import { UpgradeButton } from "@/components/dashboard/upgrade-button";

export default function SettingsPage() {
  const { user } = useUser();
  const db = useFirestore();
  
  const userRef = useMemoFirebase(() => {
    if (!db || !user) return null;
    return doc(db, 'userProfiles', user.uid);
  }, [db, user]);

  const { data: profile } = useDoc(userRef);
  const isPro = profile?.subscriptionStatus === "pro";

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
          <ShieldCheck className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-headline font-bold text-primary">Settings</h1>
          <p className="text-muted-foreground">Manage your account and subscription plans.</p>
        </div>
      </div>

      <div className="grid gap-6">
        <Card className="border-border/40 shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="font-headline">Subscription Plan</CardTitle>
                <CardDescription>Current tier and billing information.</CardDescription>
              </div>
              <Badge variant={isPro ? "default" : "secondary"} className="h-6">
                {isPro ? "PRO TIER" : "FREE TIER"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-start gap-4 p-4 rounded-xl bg-muted/50 border">
              <div className={`p-2 rounded-lg ${isPro ? 'bg-accent/10' : 'bg-primary/10'}`}>
                {isPro ? <Sparkles className="w-6 h-6 text-accent" /> : <CreditCard className="w-6 h-6 text-primary" />}
              </div>
              <div className="flex-1">
                <h4 className="font-bold">{isPro ? "EthioHire Pro" : "EthioHire Free"}</h4>
                <p className="text-sm text-muted-foreground">
                  {isPro 
                    ? "Unlimited AI-powered job analysis and document tailoring." 
                    : "Basic job tracking with 3 AI generations per day."}
                </p>
                {!isPro && (
                  <div className="mt-4">
                    <UpgradeButton />
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <h5 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Plan Features</h5>
              <div className="grid md:grid-cols-2 gap-3">
                {[
                  { label: "Job Import from LinkedIn", included: true },
                  { label: "AI Match Score Analysis", included: true },
                  { label: "AI Document Tailoring", included: true },
                  { label: "Unlimited Usage", included: isPro },
                  { label: "Priority AI Processing", included: isPro },
                  { label: "Custom Export Formats", included: isPro },
                ].map((feat, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className={`w-4 h-4 ${feat.included ? 'text-green-500' : 'text-muted-foreground/30'}`} />
                    <span className={feat.included ? 'text-foreground' : 'text-muted-foreground'}>{feat.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
