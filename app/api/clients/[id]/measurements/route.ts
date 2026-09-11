import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { FIELDS } from '@/lib/fields';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json();
  const data: Record<string, number> = {};
  for (const f of FIELDS) {
    if (body[f.key] !== undefined && body[f.key] !== '' && body[f.key] !== null) {
      data[f.key] = parseFloat(body[f.key]);
    }
  }
  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: 'Enter at least one measurement' }, { status: 400 });
  }

  const client = await prisma.client.findUnique({ where: { id: params.id } });
  if (!client) return NextResponse.json({ error: 'Client not found' }, { status: 404 });

  const measurement = await prisma.measurement.create({
    data: {
      clientId: params.id,
      unit: body.unit === 'in' ? 'in' : 'cm',
      source: 'designer',
      notes: body.notes || null,
      ...data,
    },
  });
  return NextResponse.json(measurement);
}
