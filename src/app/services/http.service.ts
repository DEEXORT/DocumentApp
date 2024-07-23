import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {SERVER_URL} from "../consts/consts";
import {catchError, of} from "rxjs";
import {IDocument} from "../interfaces/IDocument";

@Injectable({
  providedIn: "root"
})
export class HttpService{

  constructor(private http: HttpClient){ }

  // GET запрос
  getData(router: string){
    return this.http.get(`${SERVER_URL}/${router}`)
      .pipe(
        catchError((response: HttpErrorResponse) => {
          alert("Ошибка HTTP: " + response.status);
          return of([])
        })
      )
  }

  // POST запрос
  postData(body: Object){
    return this.http.post(`${SERVER_URL}/docs`,
      body, {
        observe: 'response'
      })
  }

  // PUT запрос
  putData(body: Object, id: string) {
    return this.http.put(`${SERVER_URL}/docs/${id}`,
      body, {
        observe: 'response'
      })
  }

  // DELETE запрос
  deleteData(id: string){
    return this.http.delete(`${SERVER_URL}/docs/${id}`,
      {observe: "response"})
  }

}
