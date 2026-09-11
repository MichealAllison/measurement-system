import { prisma } from '@/lib/db';
import { notFound } from 'next/navigation';
import ClientDetail from '@/components/ClientDetail';

export const dynamic = 'force-dynamic';

export default async function ClientDetailPage({ params }: { params: { id: string } }) {
  const client = await prisma.client.findUnique({
    where: { id: params.id },
    include: { measurements: { orderBy: { date: 'desc' } } },
  });
  if (!client) notFound();

  const serializable = {
    ...client,
    createdAt: client.createdAt.toISOString(),
    measurements: client.measurements.map((m) => ({ ...m, date: m.date.toISOString() })),
  };

  return <ClientDetail client={serializable} />;
}
