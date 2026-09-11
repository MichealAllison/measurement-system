export const FIELDS = [
  { key: 'neck', label: 'Neck' },
  { key: 'shoulder', label: 'Shoulder' },
  { key: 'chest', label: 'Chest / Bust' },
  { key: 'waist', label: 'Waist' },
  { key: 'hip', label: 'Hip' },
  { key: 'sleeve', label: 'Sleeve length' },
  { key: 'arm', label: 'Arm (bicep)' },
  { key: 'topLength', label: 'Top length' },
  { key: 'trouserLength', label: 'Trouser length' },
  { key: 'thigh', label: 'Thigh' },
] as const;

export type FieldKey = typeof FIELDS[number]['key'];

export function formatDate(iso: string | Date) {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
}

export function genCode(len = 6) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let s = '';
  for (let i = 0; i < len; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return s;
}
