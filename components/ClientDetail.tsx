'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FIELDS, formatDate } from '@/lib/fields';

type Measurement = {
  id: string;
  date: string;
  unit: string;
  source: string;
  notes: string | null;
  custom: Record<string, number> | null;
  [key: string]: any;
};

export default function ClientDetail({
  client,
}: {
  client: { id: string; name: string; phone: string | null; measurements: Measurement[] };
}) {
  const [link, setLink] = useState<{ url: string; code: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const [generating, setGenerating] = useState(false);

  async function generateLink() {
    setGenerating(true);
    const res = await fetch(`/api/clients/${client.id}/link`, { method: 'POST' });
    const { code } = await res.json();
    setGenerating(false);
    const url = `${window.location.origin}/m/${code}`;
    setLink({ url, code });
  }

  function copy() {
    if (!link) return;
    navigator.clipboard.writeText(link.url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div>
      <header className="pt-10 pb-4">
        <Link href="/" className="text-indigo text-[13px] underline">&larr; Dashboard</Link>
        <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-brass mt-7 mb-2">Client profile</p>
        <h1 className="font-serif text-4xl font-semibold">{client.name}</h1>
      </header>
      <div className="bg-surface border border-line rounded p-6 mt-4 mb-6">
        <h2 className="font-serif text-xl font-semibold">Fit record</h2>
        <p className="text-inksoft text-sm mt-1 mb-5">{client.phone || 'No phone on file'}</p>
        <div className="flex gap-2 flex-wrap">
          <Link
            href={`/clients/${client.id}/measure`}
            className="bg-indigo hover:bg-indigodeep text-surface2 px-4 py-2 rounded text-[14px] font-medium"
          >
            Record measurement now
          </Link>
          <button
            onClick={generateLink}
            disabled={generating}
            className="border border-indigo text-indigo hover:bg-surface2 px-4 py-2 rounded text-[14px] font-medium disabled:opacity-60"
          >
            {generating ? 'Generating…' : 'Send self-entry link'}
          </button>
        </div>

        {link && (
          <div className="mt-4">
            <div className="bg-surface2 border border-line rounded p-3 flex items-center gap-2">
              <code className="flex-1 text-[13px] text-indigodeep break-all">{link.url}</code>
              <button
                onClick={copy}
                className="bg-indigo hover:bg-indigodeep text-surface2 px-3 py-1 rounded text-[13px]"
              >
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
            <p className="text-inksoft text-[12px] mt-2">
              Or share the code: <strong>{link.code}</strong> — one submission per link.
            </p>
          </div>
        )}
      </div>

      <h3 className="font-serif text-lg font-semibold mb-3">History</h3>
      {client.measurements.length === 0 ? (
        <div className="text-center text-inksoft text-[14px] border border-dashed border-line rounded p-10">
          No measurements recorded yet.
        </div>
      ) : (
        client.measurements.map((m) => (
          <div key={m.id} className="border border-line rounded p-4 mb-3 bg-surface2">
            <div className="flex justify-between items-baseline mb-2">
              <div className="font-semibold text-[14px]">{formatDate(m.date)}</div>
              <div className="text-[12px] text-brass border border-brass rounded-full px-2 py-0">
                {m.source === 'client' ? 'client submitted' : 'in-person'}
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-1">
              {FIELDS.filter((f) => m[f.key] !== null && m[f.key] !== undefined).map((f) => (
                <div key={f.key} className="text-[13px]">
                  <span className="text-inksoft">{f.label}: </span>
                  <span className="tabular font-semibold">
                    {m[f.key]} {m.unit}
                  </span>
                </div>
              ))}
              {m.custom && Object.entries(m.custom).map(([label, value]) => (
                <div key={label} className="text-[13px]">
                  <span className="text-inksoft">{label}: </span>
                  <span className="tabular font-semibold">{value} {m.unit}</span>
                </div>
              ))}
            </div>
            {m.notes && <div className="text-[13px] text-inksoft italic mt-2">{m.notes}</div>}
          </div>
        ))
      )}
    </div>
  );
}
