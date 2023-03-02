export interface Student {
  ID: string;
  defaultSection: Record<string, string>;
  actualSection: Record<string, Record<string, string>>;
}
