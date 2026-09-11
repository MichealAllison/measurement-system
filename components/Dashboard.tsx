'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { formatDate } from '@/lib/fields';

type ClientRow = {
  id: string;
  name: string;
  phone: string | null;
  measurements: { date: string }[];
};

export default function Dashboard({ clients }: { clients: ClientRow[] }) {
  const [q, setQ] = useState('');

  const shown = useMemo(() => {
    const f = q.trim().toLowerCase();
    if (!f) return clients;
    return clients.filter(
      (c) => c.name.toLowerCase().includes(f) || (c.phone || '').includes(f)
    );
  }, [q, clients]);

  return (
    <div>
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pt-10 pb-7">
        <div>
          <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-brass mb-2">Your studio</p>
          <h1 className="font-serif text-4xl sm:text-5xl font-semibold leading-none">A better fit, recorded.</h1>
          <p className="text-inksoft text-sm mt-3 max-w-md">Keep every client, fitting, and custom detail in one calm place.</p>
        </div>
        <Link href="/redeem" className="text-indigo text-[13px] underline">
          I have a client link
        </Link>
      </header>

      <div className="grid sm:grid-cols-[1fr_auto] gap-3 mb-7 items-center">
        <input
          type="text"
          placeholder="Search by name or phone"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="flex-1 px-3.5 py-2.5 border border-line rounded bg-surface2 text-[14.5px] focus:outline-none focus:ring-2 focus:ring-brass"
        />
        <Link
          href="/clients/new"
          className="bg-indigo hover:bg-indigodeep text-surface2 px-4 py-2 rounded text-[14.5px] font-medium whitespace-nowrap"
        >
          + New client
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
        <div className="bg-surface border border-line rounded p-4"><div className="text-2xl font-serif font-semibold">{clients.length}</div><div className="text-xs text-inksoft mt-1">Total clients</div></div>
        <div className="bg-surface border border-line rounded p-4"><div className="text-2xl font-serif font-semibold">{clients.filter((c) => c.measurements[0]).length}</div><div className="text-xs text-inksoft mt-1">With measurements</div></div>
        <div className="hidden sm:block bg-indigo text-surface2 rounded p-4"><div className="text-2xl font-serif font-semibold">{clients.filter((c) => !c.measurements[0]).length}</div><div className="text-xs text-surface2/70 mt-1">Need a first fitting</div></div>
      </div>

      {shown.length === 0 ? (
        <div className="text-center text-inksoft text-[14.5px] border border-dashed border-line rounded p-12 mt-3">
          {clients.length === 0
            ? "No clients yet. Add someone's profile to start recording their measurements here."
            : 'No matches.'}
        </div>
      ) : (
        <div className="border-t border-line">
          {shown.map((c, i) => (
            <Link
              key={c.id}
              href={`/clients/${c.id}`}
              className="rise-in flex items-center justify-between py-4 border-b border-line hover:bg-surface transition-colors"
              style={{ animationDelay: `${i * 30}ms` }}
            >
              <div>
                <div className="font-serif text-[16px] font-semibold">{c.name}</div>
                <div className="text-inksoft text-[13px]">{c.phone}</div>
              </div>
              <div className="text-inksoft text-[12.5px]">
                {c.measurements[0] ? formatDate(c.measurements[0].date) : 'No measurements yet'}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
