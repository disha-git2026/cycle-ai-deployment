// Cycle prediction engine

export interface CycleEntry {
  id: string;
  userId: string;
  periodStartDate: string;
  periodEndDate: string;
  flowIntensity: 'light' | 'medium' | 'heavy';
  mood: string;
  symptoms: string[];
  notes: string;
  createdAt: string;
}

export interface CyclePrediction {
  currentCycleDay: number;
  nextPeriodDate: string;
  ovulationDate: string;
  fertileWindowStart: string;
  fertileWindowEnd: string;
  isIrregular: boolean;
  averageCycleLength: number;
  cycleLengthStdDev: number;
}

const CYCLES_KEY = 'cycle_entries';

export function getCycleEntries(userId: string): CycleEntry[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(`${CYCLES_KEY}_${userId}`);
  return data ? JSON.parse(data) : [];
}

export function addCycleEntry(userId: string, entry: Omit<CycleEntry, 'id' | 'userId' | 'createdAt'>): CycleEntry {
  if (typeof window === 'undefined') throw new Error('localStorage not available');

  const newEntry: CycleEntry = {
    ...entry,
    id: generateId(),
    userId,
    createdAt: new Date().toISOString(),
  };

  const entries = getCycleEntries(userId);
  entries.push(newEntry);
  localStorage.setItem(`${CYCLES_KEY}_${userId}`, JSON.stringify(entries));

  return newEntry;
}

export function deleteCycleEntry(userId: string, entryId: string): void {
  if (typeof window === 'undefined') return;

  const entries = getCycleEntries(userId);
  const filtered = entries.filter((e) => e.id !== entryId);
  localStorage.setItem(`${CYCLES_KEY}_${userId}`, JSON.stringify(filtered));
}

export function calculateCyclePredictions(
  userId: string,
  lastPeriodDate: string,
  avgCycleLength: number,
): CyclePrediction {
  const entries = getCycleEntries(userId);
  const last = new Date(lastPeriodDate);

  // Calculate actual cycle lengths from entries
  let cycleLengths: number[] = [];
  if (entries.length >= 2) {
    for (let i = 1; i < entries.length; i++) {
      const prev = new Date(entries[i - 1].periodStartDate);
      const current = new Date(entries[i].periodStartDate);
      const diffDays = Math.round((current.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays > 0) {
        cycleLengths.push(diffDays);
      }
    }
  }

  // Calculate statistics
  const calculatedAvgLength = cycleLengths.length > 0 ? Math.round(cycleLengths.reduce((a, b) => a + b) / cycleLengths.length) : avgCycleLength;

  const stdDev =
    cycleLengths.length > 0
      ? Math.sqrt(
          cycleLengths.reduce((sum, len) => sum + Math.pow(len - calculatedAvgLength, 2), 0) / cycleLengths.length,
        )
      : 0;

  // Calculate current cycle day
  const today = new Date();
  const currentCycleDay = Math.floor((today.getTime() - last.getTime()) / (1000 * 60 * 60 * 24)) + 1;

  // Predictions
  const nextPeriod = new Date(last);
  nextPeriod.setDate(nextPeriod.getDate() + calculatedAvgLength);

  const ovulation = new Date(nextPeriod);
  ovulation.setDate(ovulation.getDate() - 14);

  const fertileStart = new Date(ovulation);
  fertileStart.setDate(fertileStart.getDate() - 3);

  const fertileEnd = new Date(ovulation);
  fertileEnd.setDate(fertileEnd.getDate() + 3);

  return {
    currentCycleDay,
    nextPeriodDate: nextPeriod.toISOString().split('T')[0],
    ovulationDate: ovulation.toISOString().split('T')[0],
    fertileWindowStart: fertileStart.toISOString().split('T')[0],
    fertileWindowEnd: fertileEnd.toISOString().split('T')[0],
    isIrregular: stdDev > 5,
    averageCycleLength: calculatedAvgLength,
    cycleLengthStdDev: Math.round(stdDev * 100) / 100,
  };
}

export function getSymptomFrequency(
  userId: string,
): { [key: string]: number } {
  const entries = getCycleEntries(userId);
  const frequency: { [key: string]: number } = {};

  entries.forEach((entry) => {
    entry.symptoms.forEach((symptom) => {
      frequency[symptom] = (frequency[symptom] || 0) + 1;
    });
  });

  return frequency;
}

export function getTrendData(userId: string) {
  const entries = getCycleEntries(userId);
  return entries
    .map((entry, index) => ({
      month: new Date(entry.periodStartDate).toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
      flow: entry.flowIntensity === 'light' ? 1 : entry.flowIntensity === 'medium' ? 2 : 3,
      symptoms: entry.symptoms.length,
      date: entry.periodStartDate,
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}
