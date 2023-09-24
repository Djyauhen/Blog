import {Component, OnDestroy, OnInit} from '@angular/core';
import {CategoriesService} from "../../../shared/services/categories.service";
import {CategoryType} from "../../../../types/category.type";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {ArticleCardType} from "../../../../types/article-card.type";
import {HttpErrorResponse} from "@angular/common/http";
import {ArticlesService} from "../../../shared/services/articles.service";
import {ArticlesType} from "../../../../types/articles.type";
import {AppliedFilterType} from "../../../../types/applied-filter.type";
import {ActivatedRoute, Router} from "@angular/router";
import {Subscription} from "rxjs";
import {ActiveParamsType} from "../../../../types/active-params.type";
import {ActiveParamsUtil} from "../../../shared/utils/active-params.util";

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent implements OnInit, OnDestroy {
  sortingOpen = false;
  sortingOptions: CategoryType[] = [];
  articlesCards: ArticleCardType[] = [];
  pages: number[] = [];
  appliedFilters: AppliedFilterType[] = [];
  activeParams: ActiveParamsType = {categories: []};

  subscriptions: Subscription[] = [];

  constructor(private categoriesService: CategoriesService,
              private articlesService: ArticlesService,
              private activatedRoute: ActivatedRoute,
              private router: Router) {
  }

  ngOnInit() {
    this.subscription = this.categoriesService.getCategories()
      .subscribe({
        next: (data: CategoryType[] | DefaultResponseType) => {
          if ((data as DefaultResponseType).error !== undefined) {
            throw new Error((data as DefaultResponseType).message);
          }

          this.sortingOptions = data as CategoryType[];

          this.subscription = this.activatedRoute.queryParams
            .subscribe(params => {
              this.activeParams = ActiveParamsUtil.processParams(params);
              this.appliedFilter(this.activeParams.categories);
              this.articlesService.getCards(this.activeParams)
                .subscribe({
                  next: (data: ArticlesType) => {
                    this.pages = [];
                    for (let i = 1; i <= data.pages; i++) {
                      this.pages.push(i)
                    }
                    this.articlesCards = data.items;
                  },
                  error: (errorResponse: HttpErrorResponse) => {
                    throw new Error(errorResponse.message)
                  }
                })
            })
        },
        error: (errorResponse: HttpErrorResponse) => {
          throw new Error(errorResponse.message)
        }
      })
  }

  toggleSorting() {
    this.sortingOpen = !this.sortingOpen;
  }

  sort(value: string) {
    if (!this.activeParams.categories) {
      this.activeParams.categories = [value]
    } else {
      const foundCategory = this.activeParams.categories.find(category => category === value);
      if (foundCategory) {
        this.activeParams.categories = this.activeParams.categories.filter(category => category !== value)
      } else {
        this.activeParams.categories = [...this.activeParams.categories, value]
      }
    }

    this.router.navigate(['/blog'], {
      queryParams: this.activeParams
    });
  }

  appliedFilter(categories: string[]) {
    this.appliedFilters = [];
    categories.forEach(url => {
        const foundType = this.sortingOptions.filter(type => type.url === url);
        if (foundType) {
          foundType.forEach(type => {
            this.appliedFilters.push({
              name: type.name,
              urlParam: type.url
            })
          })
        }
      }
    )
  }

  removeAppliedFilter(appliedFilter: AppliedFilterType) {
    this.activeParams.categories = this.activeParams.categories.filter(item => item !== appliedFilter.urlParam);

    this.activeParams.page = 1;

    this.router.navigate(['/blog'], {
      queryParams: this.activeParams
    });
  }

  openPage(page: number) {
    if (this.activeParams.page !== page) {
      this.activeParams.page = page;

      this.router.navigate(['/blog'], {
        queryParams: this.activeParams
      });
    }
  }

  openPrevPage() {
    if (this.activeParams.page && this.activeParams.page > 1) {
      this.activeParams.page--;
      this.router.navigate(['/blog'], {
        queryParams: this.activeParams
      });
    }
  }

  openNextPage() {
    if (this.activeParams.page && this.activeParams.page < this.pages.length) {
      this.activeParams.page++;
      this.router.navigate(['/blog'], {
        queryParams: this.activeParams
      });
    }
  }

  set subscription(subscription: Subscription) {
    this.subscriptions.push(subscription);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}

