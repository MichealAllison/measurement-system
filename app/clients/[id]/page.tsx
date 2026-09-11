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
    measurements: client.measurements.map((m) => {
      const { custom, ...measurement } = m;
      const normalizedCustom: Record<string, number> | null =
        custom && typeof custom === 'object' && !Array.isArray(custom)
          ? Object.entries(custom).reduce<Record<string, number>>((result, [label, value]) => {
              if (typeof value === 'number') result[label] = value;
              return result;
            }, {})
          : null;

      return {
        ...measurement,
        date: m.date.toISOString(),
        custom: normalizedCustom,
      };
    }),
  };

  return <ClientDetail client={serializable} />;
}
