import { Suspense } from 'react';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import { LoginForm } from '@/components/LoginForm';

export default function Login() {
  return (
    <main className="w-full min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 dark:from-slate-950 dark:to-slate-900">
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
            <Link href="/register" className="text-sm text-muted-foreground hover:text-foreground transition">
              Register
            </Link>
          </div>
        </div>
      </nav>

      {/* Login Form */}
      <Suspense fallback={<div className="flex items-center justify-center min-h-[calc(100vh-64px)]">Loading...</div>}>
        <LoginForm />
      </Suspense>
    </main>
  );
}
