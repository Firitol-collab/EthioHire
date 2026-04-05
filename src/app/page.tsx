import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Rocket, Sparkles, Briefcase, ChevronRight, CheckCircle2 } from 'lucide-react';

export default function Home() {
  const heroImage = PlaceHolderImages.find(img => img.id === 'hero-image');

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <Link className="flex items-center justify-center" href="/">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center mr-2">
            <Briefcase className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-headline font-bold text-primary">EthioHire</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:text-primary transition-colors mt-2" href="#features">Features</Link>
          <Link href="/dashboard">
            <Button variant="default" size="sm">Get Started</Button>
          </Link>
        </nav>
      </header>
      
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-background">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid gap-6 lg:grid-cols-[1fr_500px] lg:gap-12 xl:grid-cols-[1fr_600px] items-center">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <div className="inline-flex items-center rounded-full bg-accent/10 px-3 py-1 text-sm font-medium text-accent ring-1 ring-inset ring-accent/20 mb-4">
                    <Sparkles className="mr-2 h-4 w-4" />
                    AI-Powered Job Hunting
                  </div>
                  <h1 className="text-4xl font-headline font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-primary">
                    Your Dream Career in Ethiopia Starts Here
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl leading-relaxed">
                    EthioHire helps you discover top LinkedIn jobs and uses AI to craft the perfect application. Tailored CVs and cover letters in seconds.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row pt-4">
                  <Link href="/dashboard">
                    <Button size="lg" className="h-12 px-8 text-lg rounded-xl shadow-lg shadow-primary/20">
                      Explore Jobs <ChevronRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Button variant="outline" size="lg" className="h-12 px-8 text-lg rounded-xl">
                    Watch Demo
                  </Button>
                </div>
                <div className="flex items-center space-x-4 pt-4 text-sm text-muted-foreground">
                  <div className="flex items-center"><CheckCircle2 className="mr-1 h-4 w-4 text-green-500" /> Free for candidates</div>
                  <div className="flex items-center"><CheckCircle2 className="mr-1 h-4 w-4 text-green-500" /> AI-Powered</div>
                </div>
              </div>
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                {heroImage && (
                  <Image
                    src={heroImage.imageUrl}
                    alt={heroImage.description}
                    width={1200}
                    height={800}
                    className="relative rounded-2xl object-cover shadow-2xl"
                    priority
                    data-ai-hint={heroImage.imageHint}
                  />
                )}
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-24 bg-white">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-headline font-bold sm:text-4xl text-primary">Everything you need to get hired</h2>
              <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
                We've combined the power of LinkedIn job listings with cutting-edge AI to streamline your job search.
              </p>
            </div>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <div className="p-8 rounded-2xl border bg-background hover:shadow-xl transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                  <Rocket className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-headline font-bold mb-3">One-Click Aggregation</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Paste any LinkedIn job URL and we'll extract the details, skills, and requirements automatically.
                </p>
              </div>
              <div className="p-8 rounded-2xl border bg-background hover:shadow-xl transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-6">
                  <Sparkles className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-xl font-headline font-bold mb-3">AI CV Tailoring</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Our AI analyzes your profile and the job description to generate a CV that highlights your most relevant experiences.
                </p>
              </div>
              <div className="p-8 rounded-2xl border bg-background hover:shadow-xl transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                  <Briefcase className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-headline font-bold mb-3">Application Tracking</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Stay organized with a beautiful dashboard to track every stage of your applications from "Saved" to "Hired".
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="w-full py-12 bg-primary text-primary-foreground">
        <div className="container px-4 md:px-6 mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
               <Briefcase className="w-6 h-6" />
               <span className="text-2xl font-headline font-bold">EthioHire</span>
            </div>
            <p className="text-primary-foreground/70 max-w-xs">
              Empowering the next generation of Ethiopian professionals with AI-driven job tools.
            </p>
          </div>
          <div className="flex gap-8">
            <Link href="#" className="hover:underline">Privacy</Link>
            <Link href="#" className="hover:underline">Terms</Link>
            <Link href="#" className="hover:underline">Contact</Link>
          </div>
        </div>
        <div className="container mx-auto px-4 mt-12 pt-8 border-t border-primary-foreground/10 text-center text-sm text-primary-foreground/50">
          © {new Date().getFullYear()} EthioHire. All rights reserved.
        </div>
      </footer>
    </div>
  );
}