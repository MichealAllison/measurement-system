import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { FIELDS } from '@/lib/fields';

export async function GET(_req: NextRequest, { params }: { params: { code: string } }) {
  const link = await prisma.linkCode.findUnique({
    where: { code: params.code.toUpperCase() },
    include: { client: true },
  });
  if (!link) return NextResponse.json({ error: 'Code not found' }, { status: 404 });
  return NextResponse.json({ client: link.client });
}

export async function POST(req: NextRequest, { params }: { params: { code: string } }) {
  const link = await prisma.linkCode.findUnique({ where: { code: params.code.toUpperCase() } });
  if (!link) return NextResponse.json({ error: 'Code not found' }, { status: 404 });

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

  const measurement = await prisma.measurement.create({
    data: {
      clientId: link.clientId,
      unit: body.unit === 'in' ? 'in' : 'cm',
      source: 'client',
      notes: body.notes || null,
      ...data,
    },
  });
  await prisma.linkCode.update({ where: { code: link.code }, data: { usedAt: new Date() } });

  return NextResponse.json(measurement);
}
