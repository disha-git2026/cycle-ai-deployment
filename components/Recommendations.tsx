import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Spinner } from './ui/spinner';
import { Lightbulb, RefreshCw } from 'lucide-react';

interface RecommendationProps {
  groqApiKey: string;
  userHistory: string;
}

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = 'llama-3.3-70b-versatile';
const SYSTEM_PROMPT = `You are a friendly health and wellness advisor specializing in menstrual health.
Provide CONCISE personalized recommendations in under 250 words.
Be brief, practical, and empathetic.
Use a numbered or bulleted format with maximum 5-6 key points.
Each point should be 1-2 sentences max.
Focus on the most impactful recommendations only.`;

export const Recommendations: React.FC<RecommendationProps> = ({ groqApiKey, userHistory }) => {
  const [recommendation, setRecommendation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRecommendation = async () => {
    setLoading(true);
    setError(null);
    setRecommendation('');

    try {
      if (!groqApiKey) {
        throw new Error('Groq API key is not configured. Please add NEXT_PUBLIC_GROQ_API_KEY to your environment variables.');
      }

      if (!userHistory || userHistory.trim() === '') {
        setRecommendation('No cycle data available yet. Log some entries to get personalized recommendations!');
        setLoading(false);
        return;
      }

      const response = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${groqApiKey}`,
        },
        body: JSON.stringify({
          model: GROQ_MODEL,
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            {
              role: 'user',
              content: `Based on this cycle history: ${userHistory}, provide 5-6 concise, actionable recommendations. Keep each under 2 sentences.`,
            },
          ],
          max_tokens: 512,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.error?.message || 'Failed to generate recommendations');
      }

      const data = await response.json();
      setRecommendation(data.choices?.[0]?.message?.content || 'No recommendations available.');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred while fetching recommendations.';
      setError(errorMessage);
      setRecommendation('');
    }
    setLoading(false);
  };

  return (
    <Card className="w-full p-6 bg-gradient-to-br from-amber-50/50 to-orange-50/50 dark:from-amber-950/20 dark:to-orange-950/20 border-amber-200/50">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/50 rounded-lg flex items-center justify-center">
            <Lightbulb className="w-6 h-6 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Personalized Recommendations</h3>
            <p className="text-xs text-muted-foreground">Health & wellness tips</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-4">
        {error && (
          <div className="p-3 bg-red-100 dark:bg-red-950/50 border border-red-200 dark:border-red-800 rounded text-sm text-red-700 dark:text-red-400">
            ⚠️ {error}
          </div>
        )}

        {recommendation && (
          <div className="text-sm p-5 bg-white dark:bg-slate-800 rounded-lg border border-border max-h-[450px] overflow-y-auto space-y-3">
            <div className="whitespace-pre-wrap text-foreground text-sm leading-relaxed break-words">{recommendation}</div>
          </div>
        )}

        {!loading && !recommendation && !error && (
          <div className="text-center py-6">
            <p className="text-sm text-muted-foreground">Get personalized health and wellness recommendations</p>
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center py-8">
            <Spinner />
            <p className="text-sm text-muted-foreground mt-3">Generating personalized recommendations...</p>
          </div>
        )}
      </div>

      {/* Action Button */}
      <div className="mt-4">
        <Button
          onClick={fetchRecommendation}
          disabled={loading}
          className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold shadow-md hover:shadow-lg transition-shadow"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          {loading ? 'Generating...' : 'Get Recommendations'}
        </Button>
      </div>
    </Card>
  );
};
