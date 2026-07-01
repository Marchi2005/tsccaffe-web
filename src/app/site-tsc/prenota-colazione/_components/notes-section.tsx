"use client";

interface NotesSectionProps {
  notes: string;
  setNotes: (val: string) => void;
}

export default function NotesSection({ notes, setNotes }: NotesSectionProps) {
  return (
    <section>
      <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
        <span className="w-5 h-5 rounded-full bg-amber-900 text-white text-[10px] flex items-center justify-center font-bold">5</span>
        Note per lo Staff
      </h3>
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 w-full">
        <textarea
          name="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Es. Latte ben caldo, doppio zucchero, ecc..."
          className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:bg-white outline-none focus:border-amber-300 transition-colors resize-none h-24"
        />
      </div>
    </section>
  );
}