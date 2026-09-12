import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const client = await prisma.client.findUnique({
    where: { id: params.id },
    include: { measurements: { orderBy: { date: 'desc' } } },
  });
  if (!client) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(client);
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json();
  const name = (body.name || '').trim();
  const phone = (body.phone || '').trim();

  if (!name) return NextResponse.json({ error: 'Name is required' }, { status: 400 });

  try {
    const client = await prisma.client.update({
      where: { id: params.id },
      data: { name, phone: phone || null },
    });

    return NextResponse.json(client);
  } catch (error) {
    return NextResponse.json({ error: 'Client not found' }, { status: 404 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.client.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Client not found' }, { status: 404 });
  }
}
