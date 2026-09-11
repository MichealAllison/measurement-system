'use client';

import { useState } from 'react';
import { FIELDS } from '@/lib/fields';

export default function MeasurementForm({
  onSubmit,
  submitLabel = 'Save measurements',
  heading,
  sub,
}: {
  onSubmit: (data: Record<string, string> & { unit: string; notes: string }) => Promise<void>;
  submitLabel?: string;
  heading: string;
  sub: string;
}) {
  const [unit, setUnit] = useState<'cm' | 'in'>('cm');
  const [values, setValues] = useState<Record<string, string>>({});
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit() {
    const hasAny = Object.values(values).some((v) => v !== '' && v !== undefined);
    if (!hasAny) {
      setError('Enter at least one measurement');
      return;
    }
    setSaving(true);
    setError('');
    try {
      await onSubmit({ ...values, unit, notes });
    } catch (e) {
      setError('Something went wrong — try again');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="bg-surface border border-line rounded p-6">
      <h2 className="font-serif text-xl font-semibold">{heading}</h2>
      <p className="text-inksoft text-sm mt-1 mb-5">{sub}</p>

      <div className="mb-5">
        <label className="block text-xs text-inksoft mb-1.5">Units</label>
        <div className="inline-flex border border-line rounded overflow-hidden">
          {(['cm', 'in'] as const).map((u) => (
            <button
              key={u}
              type="button"
              onClick={() => setUnit(u)}
              className={`px-4 py-2 text-sm ${
                unit === u ? 'bg-indigo text-surface2' : 'bg-surface2 text-inksoft'
              }`}
            >
              {u === 'cm' ? 'cm' : 'inches'}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {FIELDS.map((f) => (
          <div key={f.key}>
            <label className="block text-xs text-inksoft mb-1.5">{f.label}</label>
            <input
              type="number"
              step="0.1"
              min="0"
              placeholder="0"
              value={values[f.key] || ''}
              onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))}
              className="tabular w-full px-3 py-2.5 border border-line rounded bg-surface2 text-ink text-[15px] focus:outline-none focus:ring-2 focus:ring-brass"
            />
          </div>
        ))}
      </div>

      <div className="mt-5">
        <label className="block text-xs text-inksoft mb-1.5">Notes (fit preferences, etc.)</label>
        <input
          type="text"
          placeholder="e.g. likes a loose sleeve"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full px-3 py-2.5 border border-line rounded bg-surface2 text-ink text-[15px] focus:outline-none focus:ring-2 focus:ring-brass"
        />
      </div>

      {error && <p className="text-rust text-sm mt-3">{error}</p>}

      <button
        onClick={handleSubmit}
        disabled={saving}
        className="mt-6 bg-indigo hover:bg-indigodeep text-surface2 px-5 py-2.5 rounded text-[14.5px] font-medium disabled:opacity-60"
      >
        {saving ? 'Saving…' : submitLabel}
      </button>
    </div>
  );
}
