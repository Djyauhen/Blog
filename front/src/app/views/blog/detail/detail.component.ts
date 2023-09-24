import {Component, OnInit} from '@angular/core';
import {ArticlesService} from "../../../shared/services/articles.service";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {HttpErrorResponse} from "@angular/common/http";
import {ArticleCardType} from "../../../../types/article-card.type";
import {ActivatedRoute} from "@angular/router";
import {environment} from "../../../../environments/environment.development";
import {CommentType} from "../../../../types/comment.type";
import {CommentService} from "../../../shared/services/comment.service";
import {GetCommentType} from "../../../../types/getComment.type";
import {AuthService} from "../../../core/auth/auth.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {CommentActionType} from "../../../../types/comment-action.type";

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {

  articlesCards: ArticleCardType[] = [];
  article: ArticleCardType | null = null;
  serverStaticPath: string = environment.serverStaticPath;
  isLogged: boolean = false;
  articleComments: CommentType[] = [];
  articleOffsetCommentsCount: number = 0;
  articleCommentsCount: number = 0;
  loadComments: CommentType[] = [];
  commentsActions: CommentActionType[] = [];

  constructor(private articlesService: ArticlesService,
              private activatedRoute: ActivatedRoute,
              private commentService: CommentService,
              private authService: AuthService,
              private _snackBar: MatSnackBar) {
    this.isLogged = this.authService.getIsLoggedIn()
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.articlesService.getArticle(params['url'])
        .subscribe({
          next: (data: ArticleCardType | DefaultResponseType) => {
            if ((data as DefaultResponseType).error !== undefined) {
              throw new Error((data as DefaultResponseType).message);
            }

            if ((data as ArticleCardType)) {
              this.article = data as ArticleCardType;
              this.articleComments.splice(0, this.articleComments.length);

              if ((data as ArticleCardType).commentsCount) {
                this.articleCommentsCount = (data as ArticleCardType).commentsCount;
                if (this.articleCommentsCount > 3) {
                  this.articleOffsetCommentsCount = this.articleCommentsCount - 3;
                }
                if (this.articleCommentsCount <= 3) {
                  this.articleOffsetCommentsCount = 0;
                }
                this.getComments(this.articleOffsetCommentsCount);
              }
              this.getCommentsActions();
            }
          },
          error: (errorResponse: HttpErrorResponse) => {
            throw new Error(errorResponse.message)
          }
        })


      this.articlesService.getRelated(params['url'])
        .subscribe({
          next: (data: ArticleCardType[] | DefaultResponseType) => {
            if ((data as DefaultResponseType).error !== undefined) {
              throw new Error((data as DefaultResponseType).message);
            }
            this.articlesCards = data as ArticleCardType[];
          },
          error: (errorResponse: HttpErrorResponse) => {
            throw new Error(errorResponse.message)
          }
        })
    })
  }

  getComments(offsetCommentsCount: number) {
    this.commentService.getArticleComments(this.article!.id, offsetCommentsCount)
      .subscribe({
          next: (data: GetCommentType | DefaultResponseType) => {
            if ((data as DefaultResponseType).error !== undefined) {
              throw new Error((data as DefaultResponseType).message);
            }
            if ((data as GetCommentType)) {
              this.loadComments = (data as GetCommentType).comments;
              if (this.articleComments.length === 0) {
                this.articleComments = this.loadComments;
              } else {
                this.loadComments.forEach(loadComment => {
                  const newComment = this.articleComments.find(articleComment => articleComment.id === loadComment.id);
                  if (!newComment) {
                    this.articleComments.push(loadComment);
                  }
                });
              }
            }
          },
          error: (errorResponse: HttpErrorResponse) => {
            throw new Error(errorResponse.message)
          }
        }
      )
  }

  loadNewComments() {
    if (this.articleOffsetCommentsCount <= 10) {
      this.articleOffsetCommentsCount = 0;
    }
    if (this.articleOffsetCommentsCount > 10) {
      this.articleOffsetCommentsCount = this.articleOffsetCommentsCount - 10;
    }
    this.getComments(this.articleOffsetCommentsCount);
  }

  sendComment() {
    const sendTextArea = document.getElementById('comment-text') as HTMLTextAreaElement;
    if (sendTextArea && sendTextArea.value && this.article && this.article.id) {
      this.articlesService.sendComment(sendTextArea.value, this.article.id)
        .subscribe({
          next: (data: DefaultResponseType) => {
            if (data.error) {
              throw new Error((data as DefaultResponseType).message);
            } else {
              this._snackBar.open(data.message);
              sendTextArea.value = '';
              this.getComments(this.articleOffsetCommentsCount);
            }
          },
          error: (errorResponse: HttpErrorResponse) => {
            throw new Error(errorResponse.message)
          }
        })
    }
  }

  commentAction(action: string, commentId: string) {
    if (this.isLogged) {
      let resIndex = this.articleComments.findIndex(articleComment => articleComment.id === commentId);
      if (resIndex !== -1) {
        if (this.articleComments[resIndex].loginUserAction && this.articleComments[resIndex].loginUserAction !== '') {
          if (this.articleComments[resIndex].loginUserAction === action) {
            if (action === 'like') {
              this.articleComments[resIndex].likesCount--;
            }
            if (action === 'dislike') {
              this.articleComments[resIndex].dislikesCount--;
            }
          }
          if (this.articleComments[resIndex].loginUserAction !== action) {
            if (action === 'like') {
              this.articleComments[resIndex].likesCount++;
              this.articleComments[resIndex].dislikesCount--;
            }
            if (action === 'dislike') {
              this.articleComments[resIndex].likesCount--;
              this.articleComments[resIndex].dislikesCount++;
            }
          }
        }
        if (!this.articleComments[resIndex].loginUserAction || this.articleComments[resIndex].loginUserAction === '') {
          if (action === 'like') {
            this.articleComments[resIndex].likesCount++;
          }
          if (action === 'dislike') {
            this.articleComments[resIndex].dislikesCount++;
          }
        }
        this.articlesService.sendCommentAction(action, commentId)
          .subscribe({
            next: (data: DefaultResponseType) => {
              if (data.error) {
                throw new Error(data.message);
              } else {
                this.getCommentAction(commentId, resIndex);
                this._snackBar.open(data.message);
              }
            },
            error: (errorResponse: HttpErrorResponse) => {
              throw new Error(errorResponse.message)
            }
          })
      }
    }
  }

  getCommentsActions() {
    this.articlesService.getCommentsActions(this.article!.id)
      .subscribe({
        next: (data: DefaultResponseType | CommentActionType[]) => {
          if ((data as DefaultResponseType).error) {
            throw new Error((data as DefaultResponseType).message);
          }
          if ((data as CommentActionType[])) {
            this.commentsActions = (data as CommentActionType[]);
            this.commentsActions.forEach(commentAction => {
              this.articleComments.forEach(articleComment => {
                if (articleComment.id === commentAction.comment) {
                  articleComment.loginUserAction = commentAction.action;
                }
              });
            })
          }
        },
        error: (errorResponse: HttpErrorResponse) => {
          throw new Error(errorResponse.message)
        }
      })
  }

  getCommentAction(commentId: string, resIndex: number) {
    this.articlesService.getCommentAction(commentId)
      .subscribe({
        next: (data: DefaultResponseType | CommentActionType[]) => {
          if ((data as DefaultResponseType).error) {
            throw new Error((data as DefaultResponseType).message);
          }
          if ((data as CommentActionType[])) {
            if ((data as CommentActionType[]).length === 1 && resIndex !== -1) {
              this.articleComments[resIndex].loginUserAction = (data as CommentActionType[])[0].action;
            }
            if ((data as CommentActionType[]).length === 0 && resIndex !== -1) {
              this.articleComments[resIndex].loginUserAction = '';
            }
          }
        },
        error: (errorResponse: HttpErrorResponse) => {
          throw new Error(errorResponse.message)
        }
      })
  }
}
