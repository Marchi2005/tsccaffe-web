"use client";

import { AlertTriangle, CheckCircle2, Info, X } from 'lucide-react';

export type LunaDialogTone = 'danger' | 'error' | 'success' | 'info';

type LunaDialogProps = {
    open: boolean;
    title: string;
    message: string;
    tone?: LunaDialogTone;
    confirmLabel?: string;
    cancelLabel?: string;
    showCancel?: boolean;
    onConfirm: () => void | Promise<void>;
    onCancel: () => void;
};

export default function LunaDialog({
    open,
    title,
    message,
    tone = 'info',
    confirmLabel = 'Ho capito',
    cancelLabel = 'Annulla',
    showCancel = false,
    onConfirm,
    onCancel,
}: LunaDialogProps) {
    if (!open) return null;

    const Icon = tone === 'danger' || tone === 'error'
        ? AlertTriangle
        : tone === 'success'
            ? CheckCircle2
            : Info;
    const iconColor = tone === 'danger' || tone === 'error'
        ? 'text-red-600 bg-red-50'
        : tone === 'success'
            ? 'text-emerald-600 bg-emerald-50'
            : 'text-[#7A0018] bg-[#7A0018]/5';
    const actionColor = tone === 'danger' || tone === 'error'
        ? 'bg-red-600 hover:bg-red-700'
        : 'bg-[#7A0018] hover:bg-[#5C0012]';

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-950/50 backdrop-blur-sm p-4" role="presentation" onMouseDown={event => event.target === event.currentTarget && onCancel()}>
            <section
                role="alertdialog"
                aria-modal="true"
                aria-labelledby="luna-dialog-title"
                aria-describedby="luna-dialog-message"
                className="w-full max-w-md overflow-hidden rounded-2xl border border-[#E8E1D9] bg-[#FAF8F5] shadow-2xl"
            >
                <div className="flex items-start gap-4 p-6">
                    <div className={`mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${iconColor}`}>
                        <Icon size={21} />
                    </div>
                    <div className="min-w-0 flex-1">
                        <h2 id="luna-dialog-title" className="font-serif text-lg font-bold text-slate-900">{title}</h2>
                        <p id="luna-dialog-message" className="mt-2 whitespace-pre-line text-sm leading-relaxed text-slate-600">{message}</p>
                    </div>
                    <button type="button" onClick={onCancel} aria-label="Chiudi" className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-white hover:text-slate-700">
                        <X size={18} />
                    </button>
                </div>
                <div className="flex justify-end gap-3 border-t border-[#E8E1D9] bg-white/80 p-4">
                    {showCancel && (
                        <button type="button" onClick={onCancel} className="rounded-xl border border-[#E8E1D9] px-4 py-2.5 text-sm font-bold text-slate-600 transition-colors hover:bg-slate-50">
                            {cancelLabel}
                        </button>
                    )}
                    <button type="button" onClick={onConfirm} className={`rounded-xl px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-colors ${actionColor}`}>
                        {confirmLabel}
                    </button>
                </div>
            </section>
        </div>
    );
}
