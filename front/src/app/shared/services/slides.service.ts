import { Injectable } from '@angular/core';
import {CarouselSlideType} from "../../../types/carousel-slide.type";
import {ServiceType} from "../../../types/service.type";

@Injectable({
  providedIn: 'root'
})
export class SlidesService {

  carouselSlides: CarouselSlideType[] = [
    {
      backgroundUrl: '/assets/images/main/banner1.png',
      name: 'Предложение месяца',
      title: 'Продвижение в Instagram для вашего бизнеса <span class="span">-15%</span>!',
      service: ServiceType.promotion
    },
    {
      backgroundUrl: '/assets/images/main/banner2.png',
      name: 'Акция',
      title: 'Нужен грамотный <span class="span">копирайтер</span>?',
      text: 'Весь декабрь у нас действует акция на работу копирайтера.',
      service: ServiceType.copyWriting
    },
    {
      backgroundUrl: '/assets/images/main/banner3.png',
      name: 'Новость дня',
      title: '<span class="span">6 место</span> в ТОП-10 <br> SMM-агенств Москвы!',
      text: 'Мы благодарим каждого, кто голосовал за нас!',
      service: ServiceType.marketing
    },
  ]

  constructor() { }

  getSlides() {
    return this.carouselSlides
  }
}
