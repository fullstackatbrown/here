export interface Student {
  id: string;
  defaultSection: Record<string, string>;
  actualSection: Record<string, Record<string, string>>;
}
