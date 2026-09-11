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
      <header className="flex items-baseline justify-between pt-8 pb-4 mb-7 border-b border-line">
        <div className="flex items-baseline gap-2.5">
          <h1 className="font-serif text-[26px] font-semibold">Measurement Book</h1>
          <span className="text-inksoft text-[13px]">
            {clients.length} client{clients.length === 1 ? '' : 's'}
          </span>
        </div>
        <Link href="/redeem" className="text-indigo text-[13px] underline">
          I have a client link
        </Link>
      </header>

      <div className="flex gap-3 mb-6 items-center">
        <input
          type="text"
          placeholder="Search by name or phone"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="flex-1 px-3.5 py-2.5 border border-line rounded bg-surface2 text-[14.5px] focus:outline-none focus:ring-2 focus:ring-brass"
        />
        <Link
          href="/clients/new"
          className="bg-indigo hover:bg-indigodeep text-surface2 px-4.5 py-2.5 rounded text-[14.5px] font-medium whitespace-nowrap"
        >
          + New client
        </Link>
      </div>

      {shown.length === 0 ? (
        <div className="text-center text-inksoft text-[14.5px] border border-dashed border-line rounded p-12 mt-3">
          {clients.length === 0
            ? "No clients yet. Add someone's profile to start recording their measurements here."
            : 'No matches.'}
        </div>
      ) : (
        <div>
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
