import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {CategoryType} from "../../../types/category.type";
import {DefaultResponseType} from "../../../types/default-response.type";
import {environment} from "../../../environments/environment.development";
import {RequestType} from "../../../types/request.type";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class RequestService {

  constructor(private http: HttpClient) { }

  sendRequest(request: RequestType): Observable<DefaultResponseType> {
    return this.http.post<DefaultResponseType>(environment.api + 'requests', request)
  }
}
