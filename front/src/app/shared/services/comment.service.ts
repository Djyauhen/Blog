import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {DefaultResponseType} from "../../../types/default-response.type";
import {environment} from "../../../environments/environment.development";
import {Observable} from "rxjs";
import {GetCommentType} from "../../../types/getComment.type";

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor(private http: HttpClient) { }

  getArticleComments(article: string, offset: number): Observable<GetCommentType | DefaultResponseType> {
    return this.http.get<GetCommentType | DefaultResponseType>(`${environment.api}comments?article=${article}&offset=${offset}`)
  }
}
