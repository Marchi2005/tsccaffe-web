// src/lib/business-hours.ts

export type BusinessState = 'open' | 'closing-soon' | 'closed';

interface TimeRange {
  start: string; // formato "HH:mm"
  end: string;   // formato "HH:mm"
}

interface DaySchedule {
  ranges: TimeRange[];
}

// Configurazione orari
const SCHEDULE: Record<number, DaySchedule> = {
  // 0 = Domenica
  0: {
    ranges: [{ start: '07:30', end: '14:30' }],
  },
  // 1-6 = Lunedì - Sabato
  1: { ranges: [{ start: '06:30', end: '13:30' }, { start: '15:30', end: '20:00' }] },
  2: { ranges: [{ start: '06:30', end: '13:30' }, { start: '15:30', end: '20:00' }] },
  3: { ranges: [{ start: '06:30', end: '13:30' }, { start: '15:30', end: '20:00' }] },
  4: { ranges: [{ start: '06:30', end: '13:30' }, { start: '15:30', end: '20:00' }] },
  5: { ranges: [{ start: '06:30', end: '13:30' }, { start: '15:30', end: '20:00' }] },
  6: { ranges: [{ start: '06:30', end: '13:30' }, { start: '15:30', end: '20:00' }] },
};

// Helper: converte "HH:mm" in minuti totali da mezzanotte
function getMinutesFromMidnight(timeStr: string): number {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
}

export function getBusinessStatus(): { state: BusinessState; label: string; nextChange?: string } {
  // Ottieni l'ora attuale in Italia
  const now = new Date();
  const options: Intl.DateTimeFormatOptions = { timeZone: 'Europe/Rome', hour: 'numeric', minute: 'numeric', hour12: false, weekday: 'narrow' };
  
  // Nota: Dobbiamo ricostruire l'oggetto Date in base al fuso orario per estrarre day/hours/minutes corretti
  const romeTimeStr = now.toLocaleString('en-US', { timeZone: 'Europe/Rome' });
  const romeDate = new Date(romeTimeStr);
  
  const currentDay = romeDate.getDay(); // 0-6
  const currentMinutes = romeDate.getHours() * 60 + romeDate.getMinutes();

  const schedule = SCHEDULE[currentDay];
  
  if (!schedule) return { state: 'closed', label: 'Chiuso' };

  for (const range of schedule.ranges) {
    const startMin = getMinutesFromMidnight(range.start);
    const endMin = getMinutesFromMidnight(range.end);
    
    // Logica "In chiusura": 30 minuti prima della chiusura
    const closingSoonThreshold = 30; 

    if (currentMinutes >= startMin && currentMinutes < endMin) {
      // Siamo dentro un intervallo di apertura
      if (endMin - currentMinutes <= closingSoonThreshold) {
        return { state: 'closing-soon', label: 'In chiusura', nextChange: range.end };
      }
      return { state: 'open', label: 'Aperto ora', nextChange: range.end };
    }
  }

  return { state: 'closed', label: 'Attualmente chiuso' };
}