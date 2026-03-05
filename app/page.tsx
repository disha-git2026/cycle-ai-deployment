'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Heart, BarChart3, Brain, Calendar } from 'lucide-react';
import { useEffect } from 'react';
import { initializeDemoData } from '@/lib/auth';

export default function Home() {
  useEffect(() => {
    // Initialize demo data on first load
    initializeDemoData();
  }, []);

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
            <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground transition">
              About
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
          <h1 className="text-5xl sm:text-6xl font-bold text-foreground mb-6 leading-tight">
            Understand Your <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">Cycle</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            AI-powered insights into your menstrual cycle. Get accurate predictions, track patterns, and make informed decisions about your health.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white">
                Start for Free
              </Button>
            </Link>
            <Link href="/about">
              <Button size="lg" variant="outline" className="border-pink-200 text-foreground hover:bg-pink-50">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-20 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-foreground mb-16">Powerful Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1 */}
            <Card className="p-6 border-pink-200/50 hover:border-pink-300/80 hover:shadow-lg transition-all bg-gradient-to-br from-pink-50/50 to-transparent dark:from-pink-950/20">
              <div className="w-12 h-12 bg-gradient-to-r from-pink-100 to-pink-200 dark:from-pink-900/50 dark:to-pink-800/50 rounded-lg flex items-center justify-center mb-4">
                <Calendar className="w-6 h-6 text-pink-600" />
              </div>
              <h3 className="font-bold text-lg mb-2 text-foreground">Cycle Tracking</h3>
              <p className="text-sm text-muted-foreground">Log your period, flow intensity, and symptoms with ease.</p>
            </Card>

            {/* Feature 2 */}
            <Card className="p-6 border-purple-200/50 hover:border-purple-300/80 hover:shadow-lg transition-all bg-gradient-to-br from-purple-50/50 to-transparent dark:from-purple-950/20">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-100 to-purple-200 dark:from-purple-900/50 dark:to-purple-800/50 rounded-lg flex items-center justify-center mb-4">
                <Brain className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-bold text-lg mb-2 text-foreground">AI Predictions</h3>
              <p className="text-sm text-muted-foreground">Get intelligent predictions for your next period and fertile window.</p>
            </Card>

            {/* Feature 3 */}
            <Card className="p-6 border-pink-200/50 hover:border-pink-300/80 hover:shadow-lg transition-all bg-gradient-to-br from-pink-50/50 to-transparent dark:from-pink-950/20">
              <div className="w-12 h-12 bg-gradient-to-r from-pink-100 to-pink-200 dark:from-pink-900/50 dark:to-pink-800/50 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-pink-600" />
              </div>
              <h3 className="font-bold text-lg mb-2 text-foreground">Analytics</h3>
              <p className="text-sm text-muted-foreground">Visualize trends and identify patterns in your cycle.</p>
            </Card>

            {/* Feature 4 */}
            <Card className="p-6 border-purple-200/50 hover:border-purple-300/80 hover:shadow-lg transition-all bg-gradient-to-br from-purple-50/50 to-transparent dark:from-purple-950/20">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-100 to-purple-200 dark:from-purple-900/50 dark:to-purple-800/50 rounded-lg flex items-center justify-center mb-4">
                <Heart className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-bold text-lg mb-2 text-foreground">Health Insights</h3>
              <p className="text-sm text-muted-foreground">Receive personalized health insights based on your data.</p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-pink-100 to-purple-100 dark:from-pink-950/40 dark:to-purple-950/40">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-foreground mb-6">Ready to Take Control?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join thousands of users who are tracking their cycle smarter with CycleAI.
          </p>
          <Link href="/register">
            <Button size="lg" className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white">
              Create Your Account
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
              © 2024 CycleAI. All rights reserved. Your privacy is our priority.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
