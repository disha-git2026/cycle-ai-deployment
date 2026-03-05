'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Heart, Database, Zap, Lock } from 'lucide-react';

export default function About() {
  return (
    <main className="w-full">
      {/* Navigation */}
      <nav className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg text-foreground">CycleAI</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition">
              Home
            </Link>
            <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground transition">
              Login
            </Link>
            <Link href="/register">
              <Button size="sm" className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="w-full py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-pink-50 to-purple-50 dark:from-slate-950 dark:to-slate-900">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl sm:text-6xl font-bold text-foreground mb-6">About CycleAI</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Empowering women with intelligent menstrual cycle insights powered by advanced AI algorithms.
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="w-full py-20 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-4xl mx-auto">
          {/* Objectives */}
          <div className="mb-20">
            <h2 className="text-3xl font-bold text-foreground mb-8">Our Objectives</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6 bg-gradient-to-br from-pink-50/50 to-transparent dark:from-pink-950/20 border-pink-200/50">
                <h3 className="font-bold text-lg mb-3 text-foreground">Accurate Predictions</h3>
                <p className="text-muted-foreground">
                  Provide precise predictions for menstrual cycles using machine learning and historical pattern analysis.
                </p>
              </Card>
              <Card className="p-6 bg-gradient-to-br from-purple-50/50 to-transparent dark:from-purple-950/20 border-purple-200/50">
                <h3 className="font-bold text-lg mb-3 text-foreground">Health Awareness</h3>
                <p className="text-muted-foreground">
                  Increase awareness of menstrual health and help users understand their body better.
                </p>
              </Card>
              <Card className="p-6 bg-gradient-to-br from-pink-50/50 to-transparent dark:from-pink-950/20 border-pink-200/50">
                <h3 className="font-bold text-lg mb-3 text-foreground">Symptom Tracking</h3>
                <p className="text-muted-foreground">
                  Track symptoms and mood patterns to identify correlations and manage health proactively.
                </p>
              </Card>
              <Card className="p-6 bg-gradient-to-br from-purple-50/50 to-transparent dark:from-purple-950/20 border-purple-200/50">
                <h3 className="font-bold text-lg mb-3 text-foreground">Data Privacy</h3>
                <p className="text-muted-foreground">
                  Ensure complete privacy and security of sensitive health information with local encryption.
                </p>
              </Card>
            </div>
          </div>

          {/* Advantages */}
          <div className="mb-20">
            <h2 className="text-3xl font-bold text-foreground mb-8">Why Choose CycleAI?</h2>
            <div className="space-y-4">
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground mb-2">Fast & Responsive</h3>
                  <p className="text-muted-foreground">
                    Lightning-fast predictions and real-time tracking updates on all your devices.
                  </p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Lock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground mb-2">Privacy First</h3>
                  <p className="text-muted-foreground">
                    Your data never leaves your device. All processing happens locally with end-to-end encryption.
                  </p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Database className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground mb-2">Smart Analytics</h3>
                  <p className="text-muted-foreground">
                    Comprehensive analytics dashboard with visual trends, symptom patterns, and health insights.
                  </p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground mb-2">Health Focused</h3>
                  <p className="text-muted-foreground">
                    Designed with women's health in mind. Made by experts who care about your well-being.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Tech Stack */}
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-8">Technology Stack</h2>
            <Card className="p-8 bg-gradient-to-br from-slate-50/50 to-transparent dark:from-slate-900/50 border-slate-200/50">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Frontend</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>Next.js 15</li>
                    <li>React 19</li>
                    <li>TypeScript</li>
                    <li>Tailwind CSS</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Libraries</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>React Hook Form</li>
                    <li>Zod Validation</li>
                    <li>Recharts</li>
                    <li>shadcn/ui</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Storage</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>localStorage</li>
                    <li>JWT Auth</li>
                    <li>Client-side</li>
                    <li>Encryption</li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-pink-100 to-purple-100 dark:from-pink-950/40 dark:to-purple-950/40">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-foreground mb-6">Start Your Journey Today</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join our community of women taking control of their health with CycleAI.
          </p>
          <Link href="/register">
            <Button size="lg" className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white">
              Get Started for Free
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <div className="w-6 h-6 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Heart className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-foreground">CycleAI</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 CycleAI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
