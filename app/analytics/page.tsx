'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/Sidebar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { getCurrentUser, isAuthenticated } from '@/lib/auth';
import { getCycleEntries, getSymptomFrequency, getTrendData } from '@/lib/cyclePredictions';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Download, Loader2, ArrowLeft, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import jsPDF from 'jspdf';

const COLORS = ['#ec4899', '#a855f7', '#f43f5e', '#f59e0b', '#10b981', '#3b82f6'];

export default function Analytics() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [entries, setEntries] = useState<any[]>([]);
  const [trendData, setTrendData] = useState<any[]>([]);
  const [symptomFreq, setSymptomFreq] = useState<any>({});

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

      const trends = getTrendData(currentUser.id);
      setTrendData(trends);

      const symptoms = getSymptomFrequency(currentUser.id);
      setSymptomFreq(symptoms);
    }
    setLoading(false);
  }, [router]);

  const symptomChartData = Object.entries(symptomFreq)
    .map(([name, count]) => ({
      name,
      count,
    }))
    .sort((a, b) => (b.count as number) - (a.count as number));

  const flowData = [
    {
      name: 'Light',
      value: entries.filter((e) => e.flowIntensity === 'light').length,
    },
    {
      name: 'Medium',
      value: entries.filter((e) => e.flowIntensity === 'medium').length,
    },
    {
      name: 'Heavy',
      value: entries.filter((e) => e.flowIntensity === 'heavy').length,
    },
  ].filter((item) => item.value > 0);

  const handleDownloadPDF = () => {
    setDownloading(true);
    try {
      const pdf = new jsPDF();

      // Title
      pdf.setFontSize(20);
      pdf.text('CycleAI Analytics Report', 20, 20);

      // User Info
      pdf.setFontSize(12);
      pdf.text(`User: ${user.name}`, 20, 35);
      pdf.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 45);

      let yPosition = 60;

      // Summary Statistics
      pdf.setFontSize(14);
      pdf.text('Summary Statistics', 20, yPosition);
      yPosition += 10;

      pdf.setFontSize(11);
      pdf.text(`Total Entries: ${entries.length}`, 20, yPosition);
      yPosition += 7;
      pdf.text(`Average Cycle Length: ${user.avgCycleLength} days`, 20, yPosition);
      yPosition += 7;

      // Recent Entries
      yPosition += 5;
      pdf.setFontSize(14);
      pdf.text('Recent Cycle Entries', 20, yPosition);
      yPosition += 10;

      pdf.setFontSize(10);
      entries.slice(0, 5).forEach((entry) => {
        const dateStr = new Date(entry.periodStartDate).toLocaleDateString();
        pdf.text(`${dateStr} - Flow: ${entry.flowIntensity}, Mood: ${entry.mood || 'N/A'}, Symptoms: ${entry.symptoms.length}`, 20, yPosition);
        yPosition += 6;

        if (yPosition > 270) {
          pdf.addPage();
          yPosition = 20;
        }
      });

      pdf.save('cycle-analytics-report.pdf');
    } catch (error) {
      alert('Error downloading PDF');
    } finally {
      setDownloading(false);
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
        <div className="p-6 md:p-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <Link href="/dashboard" className="inline-flex items-center gap-2 text-pink-600 hover:text-pink-700 mb-4">
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
              </Link>
              <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
              <p className="text-muted-foreground mt-1">Track trends and identify patterns</p>
            </div>
            <Button
              onClick={handleDownloadPDF}
              disabled={downloading || entries.length === 0}
              className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white"
            >
              {downloading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Downloading...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </>
              )}
            </Button>
          </div>

          {entries.length === 0 ? (
            <Card className="p-8 text-center">
              <AlertCircle className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
              <h2 className="text-lg font-semibold text-foreground mb-2">No Data Available</h2>
              <p className="text-muted-foreground mb-6">Log cycle entries to see analytics and trends.</p>
              <Link href="/cycle-entry">
                <Button className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white">
                  Log Your First Entry
                </Button>
              </Link>
            </Card>
          ) : (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-6 bg-gradient-to-br from-blue-50/50 to-transparent dark:from-blue-950/20 border-blue-200/50">
                  <p className="text-sm text-muted-foreground mb-2">Total Entries</p>
                  <p className="text-3xl font-bold text-foreground">{entries.length}</p>
                </Card>

                <Card className="p-6 bg-gradient-to-br from-purple-50/50 to-transparent dark:from-purple-950/20 border-purple-200/50">
                  <p className="text-sm text-muted-foreground mb-2">Most Common Symptom</p>
                  <p className="text-2xl font-bold text-foreground">
                    {symptomChartData.length > 0 ? symptomChartData[0].name : 'None'}
                  </p>
                </Card>

                <Card className="p-6 bg-gradient-to-br from-pink-50/50 to-transparent dark:from-pink-950/20 border-pink-200/50">
                  <p className="text-sm text-muted-foreground mb-2">Average Cycle Length</p>
                  <p className="text-3xl font-bold text-foreground">{user.avgCycleLength} days</p>
                </Card>
              </div>

              {/* Trend Chart */}
              {trendData.length > 0 && (
                <Card className="p-6 bg-background border-border">
                  <h2 className="text-lg font-bold text-foreground mb-6">Cycle Flow Trends</h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={trendData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
                      <XAxis dataKey="month" stroke="currentColor" className="text-muted-foreground" />
                      <YAxis stroke="currentColor" className="text-muted-foreground" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'rgba(0,0,0,0.8)',
                          border: 'none',
                          borderRadius: '8px',
                          color: '#fff',
                        }}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="flow"
                        stroke="#ec4899"
                        name="Flow Intensity"
                        strokeWidth={2}
                        connectNulls
                      />
                      <Line
                        type="monotone"
                        dataKey="symptoms"
                        stroke="#a855f7"
                        name="Symptom Count"
                        strokeWidth={2}
                        connectNulls
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Card>
              )}

              {/* Symptom Frequency Chart */}
              {symptomChartData.length > 0 && (
                <Card className="p-6 bg-background border-border">
                  <h2 className="text-lg font-bold text-foreground mb-6">Symptom Frequency</h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={symptomChartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
                      <XAxis dataKey="name" stroke="currentColor" className="text-muted-foreground" />
                      <YAxis stroke="currentColor" className="text-muted-foreground" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'rgba(0,0,0,0.8)',
                          border: 'none',
                          borderRadius: '8px',
                          color: '#fff',
                        }}
                      />
                      <Bar dataKey="count" fill="#ec4899" name="Occurrences" />
                    </BarChart>
                  </ResponsiveContainer>
                </Card>
              )}

              {/* Flow Distribution Pie Chart */}
              {flowData.length > 0 && (
                <Card className="p-6 bg-background border-border">
                  <h2 className="text-lg font-bold text-foreground mb-6">Flow Distribution</h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={flowData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value}`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {flowData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'rgba(0,0,0,0.8)',
                          border: 'none',
                          borderRadius: '8px',
                          color: '#fff',
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </Card>
              )}

              {/* Cycle Calendar */}
              <Card className="p-6 bg-background border-border">
                <h2 className="text-lg font-bold text-foreground mb-6">Cycle Calendar</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {entries.slice(0, 6).map((entry) => {
                    const startDate = new Date(entry.periodStartDate);
                    const endDate = new Date(entry.periodEndDate);
                    const duration = Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;

                    return (
                      <div key={entry.id} className="p-4 bg-muted rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-semibold text-foreground">
                              {startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </p>
                            <p className="text-sm text-muted-foreground">Duration: {duration} day{duration !== 1 ? 's' : ''}</p>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              entry.flowIntensity === 'light'
                                ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300'
                                : entry.flowIntensity === 'medium'
                                  ? 'bg-purple-100 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300'
                                  : 'bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-300'
                            }`}
                          >
                            {entry.flowIntensity.charAt(0).toUpperCase() + entry.flowIntensity.slice(1)}
                          </span>
                        </div>
                        {entry.mood && <p className="text-sm text-muted-foreground mb-2">Mood: {entry.mood}</p>}
                        {entry.symptoms.length > 0 && (
                          <p className="text-sm text-muted-foreground">Symptoms: {entry.symptoms.join(', ')}</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
