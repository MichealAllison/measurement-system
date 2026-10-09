import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/db';
import { FIELDS } from '@/lib/fields';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string; measurementId: string } }
) {
  const body = await req.json();
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return NextResponse.json({ error: 'Invalid measurement data' }, { status: 400 });
  }
  if (body.unit !== 'cm' && body.unit !== 'in') {
    return NextResponse.json({ error: 'Choose cm or inches' }, { status: 400 });
  }
  if (body.notes !== undefined && body.notes !== null && typeof body.notes !== 'string') {
    return NextResponse.json({ error: 'Notes must be text' }, { status: 400 });
  }

  const values: Record<string, number | null> = {};
  for (const field of FIELDS) {
    const value = body[field.key];
    if (value === undefined || value === null || value === '') {
      values[field.key] = null;
      continue;
    }
    const number = Number(value);
    if (!Number.isFinite(number) || number < 0) {
      return NextResponse.json({ error: `${field.label} must be a non-negative number` }, { status: 400 });
    }
    values[field.key] = number;
  }

  const custom: Record<string, number> = {};
  if (body.customMeasurements !== undefined) {
    if (!body.customMeasurements || typeof body.customMeasurements !== 'object' || Array.isArray(body.customMeasurements)) {
      return NextResponse.json({ error: 'Additional measurements must be an object' }, { status: 400 });
    }
    for (const [label, value] of Object.entries(body.customMeasurements)) {
      const trimmedLabel = label.trim();
      if (!trimmedLabel || value === null || value === '') continue;
      const number = Number(value);
      if (!Number.isFinite(number) || number < 0) {
        return NextResponse.json({ error: `${trimmedLabel} must be a non-negative number` }, { status: 400 });
      }
      custom[trimmedLabel] = number;
    }
  }

  if (Object.values(values).every((value) => value === null) && Object.keys(custom).length === 0) {
    return NextResponse.json({ error: 'Enter at least one measurement' }, { status: 400 });
  }

  const existing = await prisma.measurement.findFirst({
    where: { id: params.measurementId, clientId: params.id },
    select: { id: true },
  });
  if (!existing) return NextResponse.json({ error: 'Measurement not found' }, { status: 404 });

  const measurement = await prisma.measurement.update({
    where: { id: existing.id },
    data: {
      ...values,
      unit: body.unit,
      notes: body.notes?.trim() || null,
      custom: Object.keys(custom).length ? custom : Prisma.JsonNull,
    },
  });
  return NextResponse.json(measurement);
}
