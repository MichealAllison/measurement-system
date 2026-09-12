'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
  client: initialClient,
}: {
  client: { id: string; name: string; phone: string | null; measurements: Measurement[] };
}) {
  const router = useRouter();
  const [client, setClient] = useState(initialClient);
  const [link, setLink] = useState<{ url: string; code: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(initialClient.name);
  const [phone, setPhone] = useState(initialClient.phone || '');
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

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

  async function saveProfile() {
    if (!name.trim()) {
      setError('Name is required');
      return;
    }

    setSaving(true);
    setError('');

    const res = await fetch(`/api/clients/${client.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, phone }),
    });
    const data = await res.json();

    setSaving(false);
    if (!res.ok) {
      setError(data.error || 'Something went wrong');
      return;
    }

    setClient((current) => ({
      ...current,
      name: data.name,
      phone: data.phone,
    }));
    setEditing(false);
  }

  async function deleteClient() {
    const confirmed = window.confirm(`Delete ${client.name} from the system? This also removes their measurements.`);
    if (!confirmed) return;

    setDeleting(true);
    setError('');

    const res = await fetch(`/api/clients/${client.id}`, { method: 'DELETE' });
    const data = await res.json();

    setDeleting(false);
    if (!res.ok) {
      setError(data.error || 'Could not delete client');
      return;
    }

    router.push('/');
    router.refresh();
  }

  return (
    <div>
      <header className="pt-10 pb-4">
        <Link href="/" className="text-indigo text-[13px] underline">&larr; Dashboard</Link>
        <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-brass mt-7 mb-2">Client profile</p>
        <h1 className="font-serif text-4xl font-semibold">{client.name}</h1>
      </header>
      <div className="bg-surface border border-line rounded p-6 mt-4 mb-6">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <h2 className="font-serif text-xl font-semibold">Fit record</h2>
            <p className="text-inksoft text-sm mt-1">{client.phone || 'No phone on file'}</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => {
                setName(client.name);
                setPhone(client.phone || '');
                setError('');
                setEditing(true);
              }}
              className="border border-indigo text-indigo hover:bg-surface2 px-3 py-2 rounded text-[14px] font-medium"
            >
              Edit profile
            </button>
            <button
              onClick={deleteClient}
              disabled={deleting}
              className="border border-rust text-rust hover:bg-rust/5 px-3 py-2 rounded text-[14px] font-medium disabled:opacity-60"
            >
              {deleting ? 'Deleting…' : 'Delete'}
            </button>
          </div>
        </div>

        {editing && (
          <div className="mt-5 border-t border-line pt-5">
            <div className="mb-3">
              <label className="block text-xs text-inksoft mb-1">Full name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-line rounded bg-surface2 text-[15px] focus:outline-none focus:ring-2 focus:ring-brass"
              />
            </div>
            <div className="mb-3">
              <label className="block text-xs text-inksoft mb-1">Phone number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 border border-line rounded bg-surface2 text-[15px] focus:outline-none focus:ring-2 focus:ring-brass"
              />
            </div>
            {error && <p className="text-rust text-sm mt-2">{error}</p>}
            <div className="flex gap-2 mt-4 flex-wrap">
              <button
                onClick={saveProfile}
                disabled={saving}
                className="bg-indigo hover:bg-indigodeep text-surface2 px-4 py-2 rounded text-[14px] font-medium disabled:opacity-60"
              >
                {saving ? 'Saving…' : 'Save changes'}
              </button>
              <button
                onClick={() => {
                  setEditing(false);
                  setError('');
                  setName(client.name);
                  setPhone(client.phone || '');
                }}
                className="border border-indigo text-indigo hover:bg-surface2 px-4 py-2 rounded text-[14px] font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {!editing && (
          <div className="flex gap-2 flex-wrap mt-5">
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
        )}

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
