'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/Sidebar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Chatbot } from '@/components/Chatbot';
import { Recommendations } from '@/components/Recommendations';
import { getCurrentUser, isAuthenticated } from '@/lib/auth';
import { calculateCyclePredictions, getCycleEntries } from '@/lib/cyclePredictions';
import { useCyclePredictions } from '@/hooks/useCyclePredictions';
import { Calendar, Heart, Zap, AlertCircle, Loader2, Plus } from 'lucide-react';
import Link from 'next/link';

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [entries, setEntries] = useState<any[]>([]);
  const [groqApiKey, setGroqApiKey] = useState<string>('');

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }

    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      const cycleEntries = getCycleEntries(currentUser.id);
      setEntries(cycleEntries);
    }

    // Get Groq API key from environment
    const apiKey = process.env.NEXT_PUBLIC_GROQ_API_KEY || '';
    setGroqApiKey(apiKey);

    setLoading(false);
  }, [router]);

  const { prediction } = useCyclePredictions(user?.id, user?.lastPeriodDate, user?.avgCycleLength);

  // Format user history from cycle entries
  const formatUserHistory = () => {
    if (entries.length === 0) {
      return 'No cycle data available yet.';
    }

    return entries
      .map((entry) => {
        const date = new Date(entry.periodStartDate).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        });
        const symptoms = entry.symptoms?.length > 0 ? `Symptoms: ${entry.symptoms.join(', ')}` : '';
        const mood = entry.mood ? `Mood: ${entry.mood}` : '';
        const notes = entry.notes ? `Notes: ${entry.notes}` : '';
        return `[${date}] Flow: ${entry.flowIntensity}, ${mood} ${symptoms} ${notes}`.trim();
      })
      .join(' | ');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-pink-600" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-6 md:p-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
              <p className="text-muted-foreground mt-1">Welcome back, {user.name}!</p>
            </div>
            <Link href="/cycle-entry">
              <Button className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Log Period
              </Button>
            </Link>
          </div>

          {/* Cycle Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {/* Current Cycle Day */}
            <Card className="p-6 bg-gradient-to-br from-blue-50/50 to-transparent dark:from-blue-950/20 border-blue-200/50 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Current Cycle Day</p>
                  <p className="text-3xl font-bold text-foreground">{prediction?.currentCycleDay || '-'}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </Card>

            {/* Next Period */}
            <Card className="p-6 bg-gradient-to-br from-red-50/50 to-transparent dark:from-red-950/20 border-red-200/50 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Next Period</p>
                  <p className="text-lg font-bold text-foreground">
                    {prediction?.nextPeriodDate
                      ? new Date(prediction.nextPeriodDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })
                      : '-'}
                  </p>
                </div>
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900/50 rounded-lg flex items-center justify-center">
                  <Heart className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
              </div>
            </Card>

            {/* Ovulation */}
            <Card className="p-6 bg-gradient-to-br from-amber-50/50 to-transparent dark:from-amber-950/20 border-amber-200/50 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Ovulation</p>
                  <p className="text-lg font-bold text-foreground">
                    {prediction?.ovulationDate
                      ? new Date(prediction.ovulationDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })
                      : '-'}
                  </p>
                </div>
                <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/50 rounded-lg flex items-center justify-center">
                  <Zap className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                </div>
              </div>
            </Card>

            {/* Fertile Window */}
            <Card className="p-6 bg-gradient-to-br from-green-50/50 to-transparent dark:from-green-950/20 border-green-200/50 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Fertile Window</p>
                  <p className="text-sm font-bold text-foreground">
                    {prediction?.fertileWindowStart && prediction?.fertileWindowEnd
                      ? `${new Date(prediction.fertileWindowStart).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${new Date(prediction.fertileWindowEnd).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
                      : '-'}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/50 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </Card>
          </div>

          {/* Alerts */}
          {prediction?.isIrregular && (
            <Card className="p-4 mb-8 border-yellow-200 bg-yellow-50 dark:bg-yellow-950/30">
              <div className="flex gap-3 items-start">
                <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-yellow-900 dark:text-yellow-400 mb-1">Irregular Cycle Detected</h3>
                  <p className="text-sm text-yellow-800 dark:text-yellow-300">
                    Your cycle length varies by more than 5 days. Consider tracking more regularly for accurate predictions.
                  </p>
                </div>
              </div>
            </Card>
          )}

          {/* Insights */}
          <Card className="p-6 mb-8 bg-gradient-to-r from-pink-50/50 to-purple-50/50 dark:from-pink-950/20 dark:to-purple-950/20 border-pink-200/50">
            <h2 className="text-lg font-bold text-foreground mb-3">AI Insights</h2>
            <p className="text-muted-foreground">
              {prediction?.isIrregular
                ? 'Your cycle is somewhat irregular. Keep detailed records to help improve predictions.'
                : 'Your cycle appears to be regular. You can rely on predictions for planning.'}
            </p>
            {entries.length > 0 && (
              <p className="text-sm text-muted-foreground mt-3">
                Based on {entries.length} cycle entr{entries.length === 1 ? 'y' : 'ies'}.
              </p>
            )}
          </Card>

          {/* Recent Entries */}
          <Card className="p-6 bg-background border-border">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-foreground">Recent Cycle Entries</h2>
              {entries.length > 0 && (
                <Link href="/cycle-entry">
                  <Button variant="outline" size="sm" className="border-border text-foreground hover:bg-muted">
                    View All
                  </Button>
                </Link>
              )}
            </div>

            {entries.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
                <p className="text-muted-foreground mb-4">No cycle entries yet. Start tracking to get AI insights!</p>
                <Link href="/cycle-entry">
                  <Button className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Log Your First Entry
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {entries.slice(0, 3).map((entry) => (
                  <div key={entry.id} className="p-3 bg-muted rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-semibold text-foreground">
                          {new Date(entry.periodStartDate).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </p>
                        <p className="text-sm text-muted-foreground capitalize">
                          Flow: {entry.flowIntensity} {entry.mood && `• Mood: ${entry.mood}`}
                        </p>
                      </div>
                      {entry.symptoms.length > 0 && (
                        <span className="text-xs bg-pink-100 dark:bg-pink-950/50 text-pink-700 dark:text-pink-300 px-2 py-1 rounded">
                          {entry.symptoms.length} symptom{entry.symptoms.length !== 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
          {/* AI Features Section */}
          {groqApiKey ? (
            <div className="mt-8">
              <h2 className="text-2xl font-bold text-foreground mb-6">AI-Powered Features</h2>
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Chatbot */}
                <div className="lg:col-span-2">
                  <Chatbot groqApiKey={groqApiKey} />
                </div>

                {/* Recommendations */}
                <div className="lg:col-span-2">
                  <Recommendations groqApiKey={groqApiKey} userHistory={formatUserHistory()} />
                </div>
              </div>
            </div>
          ) : (
            <Card className="p-6 mt-8 border-amber-200 bg-amber-50 dark:bg-amber-950/30">
              <div className="flex gap-4 items-start">
                <AlertCircle className="w-6 h-6 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-amber-900 dark:text-amber-400 mb-2">AI Features Not Available</h3>
                  <p className="text-sm text-amber-800 dark:text-amber-300 mb-4">
                    To use AI-powered Chat, Recommendations, and Data Summarization features, please add your Groq API key
                    to your environment variables.
                  </p>
                  <p className="text-sm text-amber-800 dark:text-amber-300">
                    <strong>Setup Instructions:</strong>
                  </p>
                  <ol className="text-sm text-amber-800 dark:text-amber-300 list-decimal list-inside mt-2 space-y-1">
                    <li>Get your free Groq API key from <a href="https://console.groq.com" target="_blank" rel="noopener noreferrer" className="underline font-semibold">console.groq.com</a></li>
                    <li>Add <code className="bg-amber-100 dark:bg-amber-900/50 px-2 py-1 rounded text-xs">NEXT_PUBLIC_GROQ_API_KEY=your_api_key</code> to <code className="bg-amber-100 dark:bg-amber-900/50 px-2 py-1 rounded text-xs">.env.local</code></li>
                    <li>Restart your development server</li>
                  </ol>
                </div>
              </div>
            </Card>
          )}        </div>
      </main>
    </div>
  );
}
