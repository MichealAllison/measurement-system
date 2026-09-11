import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { genCode } from '@/lib/fields';

export async function POST(_req: NextRequest, { params }: { params: { id: string } }) {
  const client = await prisma.client.findUnique({ where: { id: params.id } });
  if (!client) return NextResponse.json({ error: 'Client not found' }, { status: 404 });

  let code = genCode();
  // avoid rare collisions
  for (let i = 0; i < 5; i++) {
    const existing = await prisma.linkCode.findUnique({ where: { code } });
    if (!existing) break;
    code = genCode();
  }

  await prisma.linkCode.create({ data: { code, clientId: params.id } });
  return NextResponse.json({ code });
}
