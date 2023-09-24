import {ServiceType} from "./service.type";

export type RequestType = {
  name: string,
  phone: string,
  service?: ServiceType,
  type: string
}
