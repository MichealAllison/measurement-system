'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewClientPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function create(goToMeasure: boolean) {
    if (!name.trim()) {
      setError('Enter a name first');
      return;
    }
    setSaving(true);
    const res = await fetch('/api/clients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, phone }),
    });
    const client = await res.json();
    setSaving(false);
    if (!res.ok) {
      setError(client.error || 'Something went wrong');
      return;
    }
    router.push(goToMeasure ? `/clients/${client.id}/measure` : `/clients/${client.id}`);
  }

  return (
    <div>
      <Link href="/" className="text-indigo text-[13.5px] underline">
        &larr; Back to dashboard
      </Link>
      <div className="bg-surface border border-line rounded p-6 mt-4">
        <h2 className="font-serif text-xl font-semibold">New client</h2>
        <p className="text-inksoft text-sm mt-1 mb-5">
          Just the basics for now — you'll add measurements next, or send them a link to fill in their own.
        </p>
        <div className="mb-3.5">
          <label className="block text-xs text-inksoft mb-1.5">Full name</label>
          <input
            type="text"
            placeholder="e.g. Adaeze Okonkwo"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2.5 border border-line rounded bg-surface2 text-[15px] focus:outline-none focus:ring-2 focus:ring-brass"
          />
        </div>
        <div className="mb-1">
          <label className="block text-xs text-inksoft mb-1.5">Phone number</label>
          <input
            type="text"
            placeholder="e.g. 0803 123 4567"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-3 py-2.5 border border-line rounded bg-surface2 text-[15px] focus:outline-none focus:ring-2 focus:ring-brass"
          />
        </div>
        {error && <p className="text-rust text-sm mt-3">{error}</p>}
        <div className="flex gap-2.5 mt-5 flex-wrap">
          <button
            onClick={() => create(true)}
            disabled={saving}
            className="bg-indigo hover:bg-indigodeep text-surface2 px-4 py-2 rounded text-[14.5px] font-medium disabled:opacity-60"
          >
            Save & add measurements
          </button>
          <button
            onClick={() => create(false)}
            disabled={saving}
            className="border border-indigo text-indigo hover:bg-surface2 px-4 py-2 rounded text-[14.5px] font-medium disabled:opacity-60"
          >
            Save profile only
          </button>
        </div>
      </div>
    </div>
  );
}
