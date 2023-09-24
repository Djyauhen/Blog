import {Component, ElementRef, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {OwlOptions} from "ngx-owl-carousel-o";
import {ArticleCardType} from "../../../types/article-card.type";
import {Router} from "@angular/router";
import {ArticlesService} from "../../shared/services/articles.service";
import {DefaultResponseType} from "../../../types/default-response.type";
import {HttpErrorResponse} from "@angular/common/http";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {FormBuilder, Validators} from "@angular/forms";
import {ServiceType} from "../../../types/service.type";
import {RequestService} from "../../shared/services/request.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {CarouselSlideType} from "../../../types/carousel-slide.type";
import {CarouselService} from "ngx-owl-carousel-o/lib/services/carousel.service";
import {SlidesService} from "../../shared/services/slides.service";
import {ServiceCardType} from "../../../types/service-card.type";
import {ServiceCardsService} from "../../shared/services/service-cards.service";
import {ReviewsType} from "../../../types/reviews.type";
import {ReviewsService} from "../../shared/services/reviews.service";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    margin: 0,
    dots: false,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 1
      },
      740: {
        items: 1
      },
      940: {
        items: 1
      }
    },
    nav: false
  }

  customOptionsReviews: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    margin: 25,
    dots: false,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 1
      },
      740: {
        items: 2
      },
      940: {
        items: 3
      }
    },
    nav: false
  }

  articlesCards: ArticleCardType[] = [];
  slides: CarouselSlideType[] = [];
  servicesCards: ServiceCardType[] = [];
  reviewsCards: ReviewsType[] = [];

  @ViewChild('popup') popup!: TemplateRef<ElementRef>;
  dialogRef: MatDialogRef<any> | null = null;

  orderSending: boolean = false;
  serviceTypes = ServiceType;

  orderForm = this.fb.group({
    service: [ServiceType.createSite],
    name: ['', [Validators.required]],
    phone: ['', [Validators.required]],
  })

  constructor(private router: Router,
              private fb: FormBuilder,
              private articlesService: ArticlesService,
              private dialog: MatDialog,
              private _snackBar: MatSnackBar,
              private requestService: RequestService,
              private slidesService: SlidesService,
              private servicesCardsService: ServiceCardsService,
              private reviewsService: ReviewsService,) {

  }

  ngOnInit() {
    this.slides = this.slidesService.getSlides();
    this.servicesCards = this.servicesCardsService.getCards();
    this.reviewsCards = this.reviewsService.getReviews();

    this.articlesService.getPopular()
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
  }


  openPopup(setValuePopup: ServiceType) {
    this.clearForm();
    this.orderForm.patchValue({service: setValuePopup});
    this.dialogRef = this.dialog.open(this.popup);
    this.dialogRef.backdropClick();
  }

  closePopup() {
    this.dialogRef?.close();
    this.orderSending = false;
    this.clearForm();
  }

  sendOrder() {
    if (this.orderForm.valid && this.orderForm.value.name && this.orderForm.value.phone && this.orderForm.value.service) {
      this.requestService.sendRequest({
        name: this.orderForm.value.name,
        phone: this.orderForm.value.phone,
        service: this.orderForm.value.service,
        type: "order"
      })
        .subscribe({
          next: (data) => {
            if (data.error) {
              this._snackBar.open(data.message);
              throw new Error(data.message)
            } else {
              this._snackBar.open(data.message);
              this.orderSending = true;
              this.clearForm();
            }
          },
          error: (errorResponse: HttpErrorResponse) => {
            throw new Error(errorResponse.message)
          }
        })
    }
  }

  clearForm() {
    this.orderForm.patchValue({
      service: ServiceType.createSite,
      name: '',
      phone: ''
    });
  }
}
