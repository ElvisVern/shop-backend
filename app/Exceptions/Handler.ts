/*
|--------------------------------------------------------------------------
| Http Exception Handler
|--------------------------------------------------------------------------
|
| AdonisJs will forward all exceptions occurred during an HTTP request to
| the following class. You can learn more about exception handling by
| reading docs.
|
| The exception handler extends a base `HttpExceptionHandler` which is not
| mandatory, however it can do lot of heavy lifting to handle the errors
| properly.
|
*/

import Logger from '@ioc:Adonis/Core/Logger'
import HttpExceptionHandler from '@ioc:Adonis/Core/HttpExceptionHandler'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { ApiException } from './ApiExceptions';

export default class ExceptionHandler extends HttpExceptionHandler {
  constructor() {
    super(Logger)
  }

  public async handle(error: any, ctx: HttpContextContract,) {
    Logger.error({ err: new Error(error) }, "exception");
    if (error?.message?.includes('E_UNAUTHORIZED_ACCESS')) {
      return ctx.response.status(200).json(new ApiException(400, 'unauthorized!'));
    } else if (error?.message?.includes('E_ROUTE_NOT_FOUND:')) {
      return ctx.response.status(200).json(new ApiException(404, 'api not found'));
    } else if (error?.message?.includes('E_VALIDATION_FAILURE:')) {
      return ctx.response.status(200).json(new ApiException(422, 'params invalid'));
    } else if (error?.message?.includes('E_INVALID_AUTH_UID:')) {
      return ctx.response.status(200).json(new ApiException(404, 'user not found'));
    } else if (error?.message?.includes('E_INVALID_AUTH_PASSWORD:')) {
      return ctx.response.status(200).json(new ApiException(404, 'pwssword mismatch!'));
    }
    return ctx.response.status(200).json(new ApiException(500, 'server exception handled!'))
  }
}
