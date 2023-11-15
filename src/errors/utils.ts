import * as z from 'zod'
import {
  ErrorDetailsRecord,
  ErrorDetailValue,
  HttpError,
  InvalidRequestError,
  InvalidResponseError,
  RequestContext,
  ResponseContext,
  TypedError,
  UnknownError
} from './types'
import { OptionalType } from '@digital-magic/ts-common-utils'
import {
  HttpErrorType,
  InvalidRequestErrorType,
  InvalidResponseErrorType,
  UnknownErrorType
} from './constants'

const optProp = (name: string, value: ErrorDetailValue): string => `${name}: ${String(value) ?? 'N/A'}`

export const errorDetailsToString = (details: ErrorDetailsRecord): string =>
  Object.entries(details)
    .map(([k, v]) => optProp(k, v))
    .join(', ')

export const buildBasicErrorMessage = (errorName: string, details: string): string =>
  `Failed with ${errorName}: ${details}`

export const buildErrorMessage = (errorName: string, errorDetailsRecord: ErrorDetailsRecord): string =>
  buildBasicErrorMessage(errorName, errorDetailsToString(errorDetailsRecord))

const buildRequestErrorDetails = (context: RequestContext): ErrorDetailsRecord => ({
  method: context.method,
  url: context.url,
  headers: JSON.stringify(context.headers),
  //params: JSON.stringify(context.params), // TODO: Check if these params will be required
  data: JSON.stringify(context.data)
})

const buildResponseErrorDetails = (context: ResponseContext): ErrorDetailsRecord => ({
  responseStatus: context.httpStatus,
  responseMessage: context.httpStatusText,
  responseHeaders: JSON.stringify(context.headers),
  responseData: JSON.stringify(context.data)
})

export const buildFailedRequestError = <T extends symbol>(
  errorType: T,
  request: RequestContext,
  details: Record<string, OptionalType<string | number>>
): string =>
  buildErrorMessage(errorType.toString(), {
    ...buildRequestErrorDetails(request),
    ...details
  })

export const buildFailedResponseError = <T extends symbol>(
  errorType: T,
  request: RequestContext,
  response: ResponseContext,
  details?: Record<string, OptionalType<string | number>>
): string =>
  buildErrorMessage(errorType.toString(), {
    ...buildRequestErrorDetails(request),
    ...buildResponseErrorDetails(response),
    ...details
  })

export const isTypedError =
  <T extends symbol>(errorType: T) =>
  (e: unknown): e is TypedError<T> =>
    Object.prototype.hasOwnProperty.call(e, '_type') &&
    Object.prototype.hasOwnProperty.call(e, 'name') &&
    Object.prototype.hasOwnProperty.call(e, 'message') &&
    (e as TypedError<T>)._type === errorType

// eslint-disable-next-line functional/prefer-tacit
export const isUnknownError = (e: unknown): e is UnknownError => isTypedError(UnknownErrorType)(e)

export const unknownError = (e: unknown, context?: unknown): UnknownError => ({
  _type: UnknownErrorType,
  name: UnknownErrorType.toString(),
  message: buildErrorMessage(UnknownErrorType.toString(), {
    error: JSON.stringify(e),
    context: JSON.stringify(context)
  }),
  cause: e
})

// eslint-disable-next-line functional/prefer-tacit
export const isHttpError = (e: unknown): e is HttpError => isTypedError(HttpErrorType)(e)

export const httpError = (request: RequestContext, response: ResponseContext): HttpError => ({
  _type: HttpErrorType,
  name: HttpErrorType.toString(),
  message: buildFailedResponseError(HttpErrorType, request, response),
  request,
  response
})

// eslint-disable-next-line functional/prefer-tacit
export const isInvalidRequestError = <T>(e: unknown): e is InvalidRequestError<T> =>
  isTypedError(InvalidRequestErrorType)(e)

export const invalidRequestError = <T>(
  request: RequestContext,
  error: Readonly<z.ZodError<T>>
): InvalidRequestError<T> => ({
  _type: InvalidRequestErrorType,
  name: InvalidRequestErrorType.toString(),
  message: buildFailedRequestError(InvalidRequestErrorType, request, { message: error.message }),
  request,
  error
})

// eslint-disable-next-line functional/prefer-tacit
export const isInvalidResponseError = <T>(e: unknown): e is InvalidResponseError<T> =>
  isTypedError(InvalidResponseErrorType)(e)

export const invalidResponseError = <T>(
  request: RequestContext,
  response: ResponseContext,
  error: Readonly<z.ZodError<T>>
): InvalidResponseError<T> => ({
  _type: InvalidResponseErrorType,
  name: InvalidResponseErrorType.toString(),
  message: buildFailedResponseError(InvalidResponseErrorType, request, response, { message: error.message }),
  request,
  response,
  error
})
