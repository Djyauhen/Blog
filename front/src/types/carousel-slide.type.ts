import {ServiceType} from "./service.type";

export type CarouselSlideType = {
  backgroundUrl: string,
  name: string,
  title: string,
  text?: string,
  service: ServiceType
}
