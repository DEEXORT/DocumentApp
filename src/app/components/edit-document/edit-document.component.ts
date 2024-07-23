import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {IDocument} from "../../interfaces/IDocument";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {mask, SERVER_URL} from "../../consts/consts";
import {HttpService} from "../../services/http.service";
import {ITypes} from "../../interfaces/ITypes";

interface OrganizationData {
  name: string;
}

@Component({
  selector: 'app-edit-document',
  templateUrl: './edit-document.component.html',
  styleUrls: ['./edit-document.component.css']
})
export class EditDocumentComponent {
  organizations: OrganizationData[] = []; // Список организаций из БД
  typeDocs: ITypes[] = [];
  documentForm!: FormGroup

  constructor(
    public dialogRef: MatDialogRef<EditDocumentComponent>,
    @Inject(MAT_DIALOG_DATA) private data: IDocument,
    private fb: FormBuilder,
    private httpService: HttpService
  ) {
  }

  ngOnInit() {
    // Заполнение формы редактируемого документа
    this.documentForm = this.fb.group({
      id: this.data?.id || '',
      type: this.data?.type || ['', [Validators.required]],
      serial: this.data?.serial || '',
      number: this.data?.number || ['', [Validators.required]],
      date: this.data?.date,
      organization: this.data?.organization || '',
      code: this.data?.code || '',
      main: this.data?.main || false,
      archive: this.data?.archive || false
    })

    this.onGetData();
  }

  // Закрытие модульного окна
  closeDocument() {
    this.dialogRef.close();
  }

  // Получение списка организаций из БД
  async onGetData() {
    this.httpService.getData('organizations').subscribe((response: any) => {
      this.organizations = response;
    })
    this.httpService.getData('types').subscribe((response: any)=> {
      this.typeDocs = response;
    })
  }

  // Сохранение документа в БД
  saveDocument() {
    const body = {
      type: this.documentForm.value.type,
      serial: this.documentForm.value.serial,
      number: this.documentForm.value.number,
      date: this.documentForm.value?.date ? Number(this.documentForm.value.date) : '',
      organization: this.documentForm.value.organization,
      code: this.documentForm.value.code,
      main: this.documentForm.value.main,
      archive: this.documentForm.value.archive
    }

    // Отправка документа в БД
    if (this.documentForm.value.id) {
      this.httpService.putData(body, this.documentForm.value.id)
        .subscribe((result:any) => {
          this.data = result.body;
          this.dialogRef.close(this.data)
        })
    } else {
      this.httpService.postData(body)
        .subscribe((result: any) => {
            this.data = result.body;
            this.dialogRef.close(this.data);
            console.log(this.data)
          })
    }
  }

  protected readonly mask = mask;
}
