import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  const clients = await prisma.client.findMany({
    include: { measurements: { orderBy: { date: 'desc' }, take: 1 } },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(clients);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const name = (body.name || '').trim();
  const phone = (body.phone || '').trim();
  if (!name) return NextResponse.json({ error: 'Name is required' }, { status: 400 });

  const client = await prisma.client.create({ data: { name, phone: phone || null } });
  return NextResponse.json(client);
}
