import { prisma } from '@/lib/db';
import Dashboard from '@/components/Dashboard';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const clients = await prisma.client.findMany({
    include: { measurements: { orderBy: { date: 'desc' }, take: 1 } },
    orderBy: { createdAt: 'desc' },
  });

  const serializable = clients.map((c) => ({
    ...c,
    measurements: c.measurements.map((m) => ({ date: m.date.toISOString() })),
  }));

  return <Dashboard clients={serializable} />;
}
