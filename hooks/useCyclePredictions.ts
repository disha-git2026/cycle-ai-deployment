'use client';

import { useEffect, useState } from 'react';
import { calculateCyclePredictions, CyclePrediction } from '@/lib/cyclePredictions';

export function useCyclePredictions(userId: string | null, lastPeriodDate: string, avgCycleLength: number) {
  const [prediction, setPrediction] = useState<CyclePrediction | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const result = calculateCyclePredictions(userId, lastPeriodDate, avgCycleLength);
    setPrediction(result);
    setLoading(false);
  }, [userId, lastPeriodDate, avgCycleLength]);

  return { prediction, loading };
}
