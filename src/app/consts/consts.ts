import {IDocument} from "../interfaces/IDocument";

export const SERVER_URL: string = 'http://localhost:3000';
export const mask = '000-000'
export const displayedColumns = ['main', 'type', 'serial', 'number', 'date'];
export const DOCUMENT_DEFAULT: IDocument = {
  archive: false,
  main: false,
  type: '',
  number: 0
}
