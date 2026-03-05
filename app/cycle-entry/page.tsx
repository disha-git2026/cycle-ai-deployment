'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/Sidebar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { getCurrentUser, isAuthenticated } from '@/lib/auth';
import { addCycleEntry, getCycleEntries } from '@/lib/cyclePredictions';
import { CheckCircle, Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const SYMPTOMS = [
  'Cramps',
  'Headache',
  'Mood Swings',
  'Acne',
  'Fatigue',
  'Bloating',
  'Tender Breasts',
  'Back Pain',
];

const MOODS = ['Very Happy', 'Happy', 'Neutral', 'Sad', 'Very Sad', 'Stressed', 'Anxious'];

export default function CycleEntry() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    periodStartDate: '',
    periodEndDate: '',
    flowIntensity: 'medium' as 'light' | 'medium' | 'heavy',
    mood: '',
    symptoms: [] as string[],
    notes: '',
  });

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }

    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      // Set default start date to today
      const today = new Date().toISOString().split('T')[0];
      setFormData((prev) => ({
        ...prev,
        periodStartDate: today,
      }));
    }
    setLoading(false);
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const toggleSymptom = (symptom: string) => {
    setFormData((prev) => ({
      ...prev,
      symptoms: prev.symptoms.includes(symptom)
        ? prev.symptoms.filter((s) => s !== symptom)
        : [...prev.symptoms, symptom],
    }));
  };

  const handleFlowChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      flowIntensity: value as 'light' | 'medium' | 'heavy',
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (!user) throw new Error('User not found');

      if (!formData.periodStartDate) {
        alert('Please select a period start date');
        setSubmitting(false);
        return;
      }

      addCycleEntry(user.id, {
        periodStartDate: formData.periodStartDate,
        periodEndDate: formData.periodEndDate || formData.periodStartDate,
        flowIntensity: formData.flowIntensity,
        mood: formData.mood,
        symptoms: formData.symptoms,
        notes: formData.notes,
      });

      setSuccess(true);

      // Reset form
      setFormData({
        periodStartDate: new Date().toISOString().split('T')[0],
        periodEndDate: '',
        flowIntensity: 'medium',
        mood: '',
        symptoms: [],
        notes: '',
      });

      // Redirect after 2 seconds
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    } catch (error: any) {
      alert('Error saving entry: ' + error.message);
      setSubmitting(false);
    }
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
        <div className="p-6 md:p-8 max-w-3xl">
          {/* Header */}
          <div className="mb-8">
            <Link href="/dashboard" className="inline-flex items-center gap-2 text-pink-600 hover:text-pink-700 mb-4">
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-foreground">Log Period Entry</h1>
            <p className="text-muted-foreground mt-1">Track your cycle to improve predictions</p>
          </div>

          {success && (
            <Card className="p-6 mb-8 bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-900">
              <div className="flex gap-3 items-center">
                <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-green-900 dark:text-green-400">Entry Saved Successfully!</h3>
                  <p className="text-sm text-green-800 dark:text-green-300">Redirecting to dashboard...</p>
                </div>
              </div>
            </Card>
          )}

          {/* Form */}
          <Card className="p-6 md:p-8 bg-background border-border">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Period Dates */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-foreground">Period Dates</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="periodStartDate" className="text-foreground">
                      Period Start Date
                    </Label>
                    <Input
                      id="periodStartDate"
                      name="periodStartDate"
                      type="date"
                      value={formData.periodStartDate}
                      onChange={handleInputChange}
                      disabled={submitting}
                      required
                      className="border-border bg-background"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="periodEndDate" className="text-foreground">
                      Period End Date (Optional)
                    </Label>
                    <Input
                      id="periodEndDate"
                      name="periodEndDate"
                      type="date"
                      value={formData.periodEndDate}
                      onChange={handleInputChange}
                      disabled={submitting}
                      className="border-border bg-background"
                    />
                  </div>
                </div>
              </div>

              {/* Flow Intensity */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-foreground">Flow Intensity</h2>

                <div className="flex gap-3">
                  {(['light', 'medium', 'heavy'] as const).map((intensity) => (
                    <Button
                      key={intensity}
                      type="button"
                      onClick={() => handleFlowChange(intensity)}
                      disabled={submitting}
                      className={`flex-1 capitalize ${
                        formData.flowIntensity === intensity
                          ? 'bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white'
                          : 'bg-muted text-foreground hover:bg-muted/80 border border-border'
                      }`}
                    >
                      {intensity}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Mood */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-foreground">Mood</h2>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {MOODS.map((mood) => (
                    <Button
                      key={mood}
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          mood: prev.mood === mood ? '' : mood,
                        }))
                      }
                      disabled={submitting}
                      className={`text-sm ${
                        formData.mood === mood
                          ? 'bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white'
                          : 'bg-muted text-foreground hover:bg-muted/80 border border-border'
                      }`}
                    >
                      {mood}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Symptoms */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-foreground">Symptoms</h2>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {SYMPTOMS.map((symptom) => (
                    <div key={symptom} className="flex items-center space-x-2">
                      <Checkbox
                        id={symptom}
                        checked={formData.symptoms.includes(symptom)}
                        onCheckedChange={() => toggleSymptom(symptom)}
                        disabled={submitting}
                      />
                      <Label htmlFor={symptom} className="text-foreground cursor-pointer font-normal">
                        {symptom}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes" className="text-foreground">
                  Notes (Optional)
                </Label>
                <textarea
                  id="notes"
                  name="notes"
                  placeholder="Add any additional notes about your period..."
                  value={formData.notes}
                  onChange={handleInputChange}
                  disabled={submitting}
                  rows={4}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent disabled:opacity-50"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Entry'
                  )}
                </Button>

                <Link href="/dashboard" className="flex-1">
                  <Button type="button" variant="outline" className="w-full border-border text-foreground hover:bg-muted" disabled={submitting}>
                    Cancel
                  </Button>
                </Link>
              </div>
            </form>
          </Card>
        </div>
      </main>
    </div>
  );
}
