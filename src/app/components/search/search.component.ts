import {Component, ViewChild} from '@angular/core';
import {IDocument} from "../../interfaces/IDocument";
import {MatTableDataSource} from "@angular/material/table";
import {MatDialog} from "@angular/material/dialog";
import {EditDocumentComponent} from "../edit-document/edit-document.component";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort, Sort} from "@angular/material/sort";
import {LiveAnnouncer} from "@angular/cdk/a11y";
import {DOCUMENT_DEFAULT} from "../../consts/consts";
import {displayedColumns} from "../../consts/consts";
import {HttpService} from "../../services/http.service";
import {ITypes} from "../../interfaces/ITypes";

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchComponent {
  searchDoc = {type: '', number: ''};
  dataSource = new MatTableDataSource<IDocument>([]);
  documentForEdit: IDocument = {...DOCUMENT_DEFAULT};
  checkedArchive = false;
  typeDocs: ITypes[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(public dialog: MatDialog,
              private liveAnnouncer: LiveAnnouncer,
              private httpService: HttpService) {
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnInit(): void {
    this.filterSettings();
    this.onGetDocs();
  }

  // Получение документов из БД
  onGetDocs() {
    this.httpService.getData('docs').subscribe((response: any) => {
      this.dataSource.data = response;
    });
    this.httpService.getData('types').subscribe((response: any)=> {
      this.typeDocs = response;
    });
  }

  // Создание нового документа
  createDocument() {
    const dialogRef = this.dialog.open(EditDocumentComponent, {
      height: '500px',
      width: '1100px'
    });
    dialogRef.afterClosed().subscribe(result => {
      // Добавление нового документа в таблицу
      if (result) {
        this.dataSource.data = this.dataSource.data.concat({
          id: result.id, main: result.main, type: result.type, serial: result.serial,
          number: result.number, date: result.date, archive: result.archive
        })
      }
    });
  }

  // Выбор документа в таблице
  selectDocument(document: IDocument) {
    this.documentForEdit = document;
  }

  // Редактирование документа
  editDocument() {
    // Преобразование даты из числового формата в полный
    if (this.documentForEdit.date) this.documentForEdit.date = new Date(this.documentForEdit.date)
    const dialogRef = this.dialog.open(EditDocumentComponent, {
      height: '500px',
      width: '1100px',
      data: this.documentForEdit // Передача документа на редактирование
    });
    dialogRef.afterClosed().subscribe(result => {
      // Обновление документа в основной таблице после редактирования
      if (result) {
        const indexToUpdate = this.dataSource.data.findIndex(item => item.id == this.documentForEdit.id)
        this.dataSource.data[indexToUpdate] = result;
        this.dataSource.data = [...this.dataSource.data];
        this.documentForEdit = result;
      }
    });
  }

  // Удаление документа
  async deleteDocument() {
    if (this.documentForEdit.id) {
      this.httpService.deleteData(this.documentForEdit.id)
        .subscribe( (response) => {
          if (response.ok) {
            this.dataSource.data = this.dataSource.data.filter(item => item.id !== this.documentForEdit.id);
          } else {
            alert("Ошибка HTTP: " + response.status);
          }
        })
    } else {
      alert("Документ не найден");
    }

  }

  // Сортировка таблицы
  sortChange(sortState: Sort) {
    if (sortState.direction) {
      this.liveAnnouncer.announce(`Отсортировано по ${sortState.direction}`);
    } else {
      this.liveAnnouncer.announce('Сортировка очищена');
    }
  }

  // Настройка фильтра
  filterSettings() {
    this.dataSource.filterPredicate = (data: IDocument, filter: string) => {
      let check = data.number.toString().indexOf(filter.split(',')[0]) === 0
        && data.type.indexOf(filter.split(',')[1]) === 0;

      if (this.checkedArchive && typeof data?.archive === 'boolean') {
        check &&= data.archive;
      }
      return check;
    };
  }

  // Фильтрация таблицы по виду документа и архивным документам
  filterTable() {
    this.dataSource.filter = `${this.searchDoc.number},${this.searchDoc.type}`;
  }

  // Фильтрация по номеру документа
  filterTableByInput(event: Event) {
    this.dataSource.filter = `${(event.target as HTMLInputElement).value},${this.searchDoc.type}`;
  }

  // Сброс фильтров
  clearFilter() {
    this.searchDoc = {type: '', number: ''};
    this.dataSource.filter = '';
    this.checkedArchive = false;
  }

  protected readonly displayedColumns = displayedColumns;
  protected readonly length = length;
}
