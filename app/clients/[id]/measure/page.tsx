'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import MeasurementForm from '@/components/MeasurementForm';

export default function RecordMeasurementPage({ params }: { params: { id: string } }) {
  const router = useRouter();

  async function handleSubmit(data: Record<string, unknown>) {
    const res = await fetch(`/api/clients/${params.id}/measurements`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('failed');
    router.push(`/clients/${params.id}`);
  }

  return (
    <div>
      <Link href={`/clients/${params.id}`} className="text-indigo text-[13.5px] underline">
        &larr; Back to profile
      </Link>
      <div className="mt-4">
        <MeasurementForm
          heading="Record measurement"
          sub="Recorded in-person today."
          submitLabel="Save measurements"
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
