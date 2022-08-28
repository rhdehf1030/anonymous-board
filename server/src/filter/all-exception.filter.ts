import {
  ArgumentsHost,
  Catch,
  HttpException,
  HttpStatus,
  Logger
} from '@nestjs/common'
import {
  convertTypeormErrorToCommonError,
  getErrorResponse,
  isCommonError,
  isTypeormError
} from '@/type/error'
import { BaseExceptionFilter } from '@nestjs/core'

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  private logger = new Logger('ExceptionsFilter')
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse()
    const request = ctx.getRequest()

    this.logger.error(`REQUEST: ${request.url}`)
    this.logger.error(exception)

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR

    // If Common Error Type
    if (isCommonError(exception)) {
      return response.status(exception.status).json(getErrorResponse(exception))
    }

    // If TypeORM Error
    else if (isTypeormError(exception)) {
      const convertedError = convertTypeormErrorToCommonError(exception)
      return response
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json(getErrorResponse(convertedError))
    }

    // If Nestjs Error
    else if (exception instanceof HttpException) {
      const instanceName = exception.constructor.name
      const res = exception.getResponse()

      return response.status(status).json({
        code: instanceName,
        message:
          typeof res === 'object' && 'message' in res
            ? (res as any).message
            : res
      })
    }

    // Other Unhandled Exception
    else {
      const instanceName = (exception as any).constructor.name
      return response.status(status).json({
        code: instanceName,
        message: exception
      })
    }
  }
}
