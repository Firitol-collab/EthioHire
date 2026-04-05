"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2, Check } from "lucide-react";
import { useUser, useFirestore } from "@/firebase";
import { doc } from "firebase/firestore";
import { updateDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { toast } from "@/hooks/use-toast";

export function UpgradeButton() {
  const [loading, setLoading] = useState(false);
  const { user } = useUser();
  const db = useFirestore();

  const handleUpgrade = async () => {
    if (!user || !db) return;
    setLoading(true);

    // Simulate Stripe Checkout delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const userRef = doc(db, "userProfiles", user.uid);
    updateDocumentNonBlocking(userRef, {
      subscriptionStatus: "pro",
      updatedAt: new Date().toISOString()
    });

    toast({
      title: "Welcome to Pro!",
      description: "Your account has been upgraded. Enjoy unlimited AI generations.",
    });
    setLoading(false);
  };

  return (
    <Button 
      onClick={handleUpgrade} 
      className="bg-accent hover:bg-accent/90 text-white font-bold gap-2"
      disabled={loading}
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
      Upgrade to Pro
    </Button>
  );
}
