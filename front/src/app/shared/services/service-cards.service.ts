import { Injectable } from '@angular/core';
import {ServiceCardType} from "../../../types/service-card.type";
import {ServiceType} from "../../../types/service.type";

@Injectable({
  providedIn: 'root'
})
export class ServiceCardsService {
  servicesCards: ServiceCardType[] = [
    {
      image: '/assets/images/main/service-1.png',
      name: 'Создание сайтов',
      text:'В краткие сроки мы создадим качественный и самое главное продающий сайт для продвижения Вашего бизнеса!',
      currency: '7 500',
      serviceType: ServiceType.createSite
    },
    {
      image: '/assets/images/main/service-2.png',
      name: 'Продвижение',
      text:'Вам нужен качественный SMM-специалист или грамотный таргетолог? Мы готовы оказать Вам услугу “Продвижения” на наивысшем уровне!',
      currency: '3 500',
      serviceType: ServiceType.promotion
    },
    {
      image: '/assets/images/main/service-3.png',
      name: 'Реклама',
      text:'Без рекламы не может обойтись ни один бизнес или специалист. Обращаясь к нам, мы гарантируем быстрый прирост клиентов за счёт правильно настроенной рекламы.',
      currency: '1 000',
      serviceType: ServiceType.marketing
    },
    {
      image: '/assets/images/main/service-4.png',
      name: 'Копирайтинг',
      text:'Наши копирайтеры готовы написать Вам любые продающие текста, которые не только обеспечат рост охватов, но и помогут выйти на новый уровень в продажах.',
      currency: '750',
      serviceType: ServiceType.copyWriting
    },
  ]

  getCards() {
    return this.servicesCards
  }
}
