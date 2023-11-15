import * as z from 'zod'
import { OptionalType } from '@digital-magic/ts-common-utils'
import { HttpHeaders, HttpMethod, RequestParams } from '../types'
import { HttpErrorType, InvalidRequestErrorType, InvalidResponseErrorType, UnknownErrorType } from './constants'

/* Utility types */

export type ErrorDetailValue = OptionalType<string | number>
export type ErrorDetailsRecord = Readonly<Record<string, ErrorDetailValue>>

export type RequestContext = Readonly<{
  method: HttpMethod
  url: string
  headers: OptionalType<HttpHeaders>
  params?: OptionalType<RequestParams>
  data?: unknown
}>

export type ResponseContext = Readonly<{
  httpStatus: number
  httpStatusText: string
  headers: OptionalType<HttpHeaders>
  data?: unknown
}>

export type ErrorWithRequestContext = Readonly<{
  request: RequestContext
}>

export type ErrorWithResponseContext = Readonly<{
  response: ResponseContext
}>

type WithZodError<T> = Readonly<{
  error: Readonly<z.ZodError<T>>
}>

/* Error types */

/* TODO: Move to ts-common-utils */
export type TypedError<T extends symbol> = Error & Readonly<{ _type: T }>

export type UnknownError = TypedError<typeof UnknownErrorType>

export type HttpError = TypedError<typeof HttpErrorType> & ErrorWithRequestContext & ErrorWithResponseContext

export type InvalidRequestError<T> = TypedError<typeof InvalidRequestErrorType> &
  ErrorWithRequestContext &
  WithZodError<T>

export type InvalidResponseError<T> = TypedError<typeof InvalidResponseErrorType> &
  ErrorWithRequestContext &
  ErrorWithResponseContext &
  WithZodError<T>
