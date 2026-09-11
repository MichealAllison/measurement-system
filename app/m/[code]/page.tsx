'use client';

import { useEffect, useState } from 'react';
import MeasurementForm from '@/components/MeasurementForm';

export default function ClientEntryPage({ params }: { params: { code: string } }) {
  const [client, setClient] = useState<{ id: string; name: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    fetch(`/api/links/${params.code}`)
      .then((r) => r.json().then((d) => ({ ok: r.ok, d })))
      .then(({ ok, d }) => {
        if (!ok) setError(d.error || 'Code not found');
        else setClient(d.client);
        setLoading(false);
      });
  }, [params.code]);

  async function handleSubmit(data: Record<string, string> & { unit: string; notes: string }) {
    const res = await fetch(`/api/links/${params.code}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('failed');
    setDone(true);
  }

  if (loading) return null;

  if (error) {
    return (
      <div className="bg-surface border border-line rounded p-6 mt-8">
        <h2 className="font-serif text-xl font-semibold">Code not found</h2>
        <p className="text-inksoft text-sm mt-1">Double check the link or code you were given.</p>
      </div>
    );
  }

  if (done) {
    return (
      <div className="bg-surface border border-line rounded p-6 mt-8 text-center">
        <h2 className="font-serif text-xl font-semibold">Sent</h2>
        <p className="text-inksoft text-sm mt-1">
          Thanks — your measurements are saved and ready for your next fitting.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <div className="bg-surface2 border border-brass rounded p-3.5 text-[13.5px] mb-5">
        Submitting measurements for <strong>{client?.name}</strong>
      </div>
      <MeasurementForm
        heading="Your measurements"
        sub="Fill this in from home, using a tape measure — it'll be ready before your fitting."
        submitLabel="Send to studio"
        onSubmit={handleSubmit}
      />
    </div>
  );
}
