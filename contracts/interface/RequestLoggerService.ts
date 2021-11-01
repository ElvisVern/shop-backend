import { RequestContract } from "@ioc:Adonis/Core/Request";
import { ResponseContract } from '@ioc:Adonis/Core/Response';

export default interface RequestLoggerService {
  handle(request: RequestContract, response: ResponseContract): void
}

