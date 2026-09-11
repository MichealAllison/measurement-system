export type MeasurementField = { key: string; label: string };

export const FIELDS: MeasurementField[] = [
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

export const FIELD_STYLES = [
  { key: 'full', label: 'Full set', fields: FIELDS.map((field) => field.key) },
  { key: 'top', label: 'Top / dress', fields: ['neck', 'shoulder', 'chest', 'waist', 'hip', 'sleeve', 'arm', 'topLength'] },
  { key: 'bottom', label: 'Trousers / skirt', fields: ['waist', 'hip', 'trouserLength', 'thigh'] },
] as const;

export type FieldKey = typeof FIELDS[number]['key'];

export function getFieldsForStyle(styleKey: string): MeasurementField[] {
  const style = FIELD_STYLES.find((item) => item.key === styleKey);
  const keys = style?.fields || FIELDS.map((field) => field.key);
  return FIELDS.filter((field) => keys.includes(field.key));
}

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
