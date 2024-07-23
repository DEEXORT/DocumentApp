import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MaterialModule} from './material-module'
import {SearchComponent} from './components/search/search.component';
import {EditDocumentComponent} from './components/edit-document/edit-document.component';
import {MAT_DATE_LOCALE} from "@angular/material/core";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {DatePipe} from "@angular/common";
import {MatPaginatorIntl} from "@angular/material/paginator";
import {getRussianPaginatorIntl} from "./customs/russianPaginator";
import {NgxMaskDirective, provideNgxMask} from "ngx-mask";
import {HttpClientModule} from "@angular/common/http";

@NgModule({
  declarations: [
    AppComponent,
    SearchComponent,
    EditDocumentComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    NgxMaskDirective,
    HttpClientModule
  ],
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: 'ru'},
    DatePipe,
    {provide: MatPaginatorIntl, useValue: getRussianPaginatorIntl()},
    provideNgxMask(),
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
