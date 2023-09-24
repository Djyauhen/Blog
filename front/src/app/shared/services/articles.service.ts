import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable, throwError} from "rxjs";
import {ArticleCardType} from "../../../types/article-card.type";
import {environment} from "../../../environments/environment.development";
import {DefaultResponseType} from "../../../types/default-response.type";
import {ArticlesType} from "../../../types/articles.type";
import {AuthService} from "../../core/auth/auth.service";
import {CommentActionType} from "../../../types/comment-action.type";
import {ActiveParamsType} from "../../../types/active-params.type";

@Injectable({
  providedIn: 'root'
})
export class ArticlesService {

  constructor(private http: HttpClient,
              private authService: AuthService) {
  }

  getPopular(): Observable<ArticleCardType[] | DefaultResponseType> {
    return this.http.get<ArticleCardType[] | DefaultResponseType>(environment.api + 'articles/top')
  }

  getCards(params: ActiveParamsType): Observable<ArticlesType> {
    return this.http.get<ArticlesType>(environment.api + 'articles', {
      params: params
    })
  }

  getRelated(url: string): Observable<ArticleCardType[] | DefaultResponseType> {
    return this.http.get<ArticleCardType[] | DefaultResponseType>(environment.api + 'articles/related/' + url)
  }

  getArticle(url: string) {
    return this.http.get<ArticleCardType | DefaultResponseType>(environment.api + 'articles/' + url)
  }

  sendComment(text: string, article: string) {
    const tokens = this.authService.getTokens();

    if (tokens && tokens.accessToken) {
      return this.http.post<DefaultResponseType>(environment.api + 'comments', {
        text: text,
        article: article
      }, {
        headers: {
          ['x-auth']: tokens.accessToken
        }
      })
    } else {
      throw throwError(() => 'Can not find token')
    }
  }

  sendCommentAction(action: string, commentId: string) {
    const tokens = this.authService.getTokens();

    if (tokens && tokens.accessToken) {
      return this.http.post<DefaultResponseType>(environment.api + 'comments/' + commentId + '/apply-action', {
        action: action
      }, {
        headers: {
          ['x-auth']: tokens.accessToken
        }
      })
    } else {
      throw throwError(() => 'Can not find token')
    }
  }

  getCommentsActions(articleId: string) {
    const tokens = this.authService.getTokens();

    if (tokens && tokens.accessToken) {
      return this.http.get<DefaultResponseType | CommentActionType[]>(environment.api + 'comments/article-comment-actions?articleId=' + articleId, {
        headers: {
          ['x-auth']: tokens.accessToken
        }
      })
    } else {
      throw throwError(() => 'Can not find token')
    }
  }

  getCommentAction(commentId: string) {
    const tokens = this.authService.getTokens();

    if (tokens && tokens.accessToken) {
      return this.http.get<DefaultResponseType | CommentActionType[]>(environment.api + 'comments/' + commentId + '/actions', {
        headers: {
          ['x-auth']: tokens.accessToken
        }
      })
    } else {
      throw throwError(() => 'Can not find token')
    }
  }
}
