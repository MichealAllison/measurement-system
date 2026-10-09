'use client';

import { useState } from 'react';
import { DEFAULT_MEASUREMENTS, FIELD_STYLES, FIELDS, getFieldsForStyle } from '@/lib/fields';

type MeasurementFormData = {
  unit: string;
  notes: string;
  customMeasurements: Record<string, string>;
  [key: string]: string | Record<string, string>;
};

type MeasurementInitialData = {
  unit: string;
  notes: string | null;
  custom: Record<string, number> | null;
  [key: string]: number | string | Record<string, number> | null | undefined;
};

export default function MeasurementForm({
  onSubmit,
  submitLabel = 'Save measurements',
  heading,
  sub,
  initialData,
  onCancel,
}: {
  onSubmit: (data: MeasurementFormData) => Promise<void>;
  submitLabel?: string;
  heading: string;
  sub: string;
  initialData?: MeasurementInitialData;
  onCancel?: () => void;
}) {
  const [unit, setUnit] = useState<'cm' | 'in'>(initialData?.unit === 'in' ? 'in' : 'cm');
  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(FIELDS.map((field) => [
      field.key,
      initialData?.[field.key] == null ? '' : String(initialData[field.key]),
    ]))
  );
  const [defaultValues, setDefaultValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(DEFAULT_MEASUREMENTS.map((field) => [
      field.key,
      initialData?.custom?.[field.label] == null ? '' : String(initialData.custom[field.label]),
    ]))
  );
  const [style, setStyle] = useState('full');
  const [customMeasurements, setCustomMeasurements] = useState<{ label: string; value: string }[]>(() =>
    Object.entries(initialData?.custom || {})
      .filter(([label]) => !DEFAULT_MEASUREMENTS.some((field) => field.label === label))
      .map(([label, value]) => ({ label, value: String(value) }))
  );
  const [notes, setNotes] = useState(initialData?.notes || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit() {
    const custom = Object.fromEntries([
      ...DEFAULT_MEASUREMENTS
        .filter((field) => defaultValues[field.key] !== '')
        .map((field) => [field.label, defaultValues[field.key]]),
      ...customMeasurements
        .filter((item) => item.label.trim() && item.value !== '')
        .map((item) => [item.label.trim(), item.value]),
    ]);
    const hasAny = Object.values(values).some((v) => v !== '' && v !== undefined) || Object.keys(custom).length > 0;
    if (!hasAny) {
      setError('Enter at least one measurement');
      return;
    }
    setSaving(true);
    setError('');
    try {
      await onSubmit({ ...values, unit, notes, customMeasurements: custom });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong — try again');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="bg-surface border border-line rounded p-6">
      <h2 className="font-serif text-xl font-semibold">{heading}</h2>
      <p className="text-inksoft text-sm mt-1 mb-5">{sub}</p>

      <div className="grid gap-4 sm:grid-cols-[1fr_auto] mb-6">
        <div>
          <p className="text-xs text-inksoft mt-2">Enter the main fitting criteria below, or add any extra measurements.</p>
        </div>
        <div>
          <label className="block text-xs text-inksoft mb-1">Units</label>
          <div className="inline-flex border border-line rounded overflow-hidden h-[42px]">
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
      </div>

      <div className="flex items-end justify-between mb-3">
        <div>
          <p className="text-[11px] font-semibold tracking-[0.14em] uppercase text-brass">Main measurement criteria</p>
          <p className="text-xs text-inksoft mt-1">Enter the measurements needed for this fitting.</p>
        </div>
        <span className="text-xs text-inksoft">{DEFAULT_MEASUREMENTS.length} fields</span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {DEFAULT_MEASUREMENTS.map((field) => (
          <div key={field.key}>
            <label className="block text-xs text-inksoft mb-1">{field.label}</label>
            <input
              type="number"
              step="0.1"
              min="0"
              placeholder="0"
              value={defaultValues[field.key] || ''}
              onChange={(e) => setDefaultValues((current) => ({ ...current, [field.key]: e.target.value }))}
              className="tabular w-full px-3 py-2 border border-line rounded bg-surface2 text-ink text-[15px] focus:outline-none focus:ring-2 focus:ring-brass"
            />
          </div>
        ))}
      </div>

      <details className="mt-6 border-t border-line pt-4">
        <summary className="cursor-pointer text-sm font-medium text-indigo">Other standard measurements</summary>
        <div className="mt-4">
          <label className="block text-xs text-inksoft mb-1">Measurement style</label>
          <select
            value={style}
            onChange={(e) => setStyle(e.target.value)}
            className="w-full px-3 py-2 border border-line rounded bg-surface2 text-[14px] focus:outline-none focus:ring-2 focus:ring-brass"
          >
            {FIELD_STYLES.map((item) => <option key={item.key} value={item.key}>{item.label}</option>)}
          </select>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
            {getFieldsForStyle(style).map((field) => (
              <div key={field.key}>
                <label className="block text-xs text-inksoft mb-1">{field.label}</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  placeholder="0"
                  value={values[field.key] || ''}
                  onChange={(e) => setValues((current) => ({ ...current, [field.key]: e.target.value }))}
                  className="tabular w-full px-3 py-2 border border-line rounded bg-surface2 text-ink text-[15px] focus:outline-none focus:ring-2 focus:ring-brass"
                />
              </div>
            ))}
          </div>
        </div>
      </details>

      <div className="mt-7 pt-5 border-t border-line">
        <div className="flex items-start justify-between gap-4 mb-3">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.14em] uppercase text-brass">Additional measurements</p>
            <p className="text-xs text-inksoft mt-1">Add any garment, body, or fitting detail not listed above.</p>
          </div>
          <button
            type="button"
            onClick={() => setCustomMeasurements((items) => [...items, { label: '', value: '' }])}
            className="text-indigo text-xs font-semibold whitespace-nowrap hover:underline"
          >
            + Add field
          </button>
        </div>
        {customMeasurements.length === 0 ? (
          <div className="border border-dashed border-line rounded p-3 text-xs text-inksoft">No extra fields yet.</div>
        ) : (
          <div className="space-y-2">
            {customMeasurements.map((item, index) => (
              <div key={index} className="grid grid-cols-[1fr_6rem_auto] gap-2 items-center">
                <input
                  type="text"
                  placeholder="e.g. Wrist"
                  value={item.label}
                  onChange={(e) => setCustomMeasurements((items) => items.map((current, i) => i === index ? { ...current, label: e.target.value } : current))}
                  className="w-full px-3 py-2 border border-line rounded bg-surface2 text-sm focus:outline-none focus:ring-2 focus:ring-brass"
                />
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  placeholder="0"
                  value={item.value}
                  onChange={(e) => setCustomMeasurements((items) => items.map((current, i) => i === index ? { ...current, value: e.target.value } : current))}
                  className="tabular w-full px-3 py-2 border border-line rounded bg-surface2 text-sm focus:outline-none focus:ring-2 focus:ring-brass"
                />
                <button
                  type="button"
                  aria-label="Remove measurement field"
                  onClick={() => setCustomMeasurements((items) => items.filter((_, i) => i !== index))}
                  className="text-inksoft hover:text-rust px-1 text-lg leading-none"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-5">
        <label className="block text-xs text-inksoft mb-1">Notes (fit preferences, etc.)</label>
        <input
          type="text"
          placeholder="e.g. likes a loose sleeve"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full px-3 py-2 border border-line rounded bg-surface2 text-ink text-[15px] focus:outline-none focus:ring-2 focus:ring-brass"
        />
      </div>

      {error && <p className="text-rust text-sm mt-3">{error}</p>}

      <div className="mt-6 flex gap-2">
        <button
          onClick={handleSubmit}
          disabled={saving}
          className="bg-indigo hover:bg-indigodeep text-surface2 px-5 py-2 rounded text-[14px] font-medium disabled:opacity-60"
        >
          {saving ? 'Saving…' : submitLabel}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={saving}
            className="border border-line px-5 py-2 rounded text-[14px] font-medium disabled:opacity-60"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}
