export interface IDocument {
  id?: string;
  type: string;
  serial?: any;
  number: number;
  date?: any;
  organization?: string;
  code?: string;
  main: boolean;
  archive: boolean;
}
