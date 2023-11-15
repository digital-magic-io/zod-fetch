import * as z from 'zod'
import { MaybeLazy, NonOptional } from '@digital-magic/ts-common-utils'

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS'

export type HttpHeaders = Record<string, string>

export type RequestParams = Record<string, string>

export type RequestCallConfig = Readonly<{
  method: HttpMethod
  url: MaybeLazy<NonOptional<string>>
  headers?: HttpHeaders
}>

export type RequestReceiveConfig = RequestCallConfig &
  Readonly<{
    method: 'GET' | 'HEAD' | 'OPTIONS' | 'DELETE'
  }>

export type RequestSendConfig<T> = RequestCallConfig &
  Readonly<{
    method: 'POST' | 'PUT' | 'PATCH'
    data?: T
  }>

export type RequestUploadConfig = RequestCallConfig &
  Readonly<{
    method: 'POST' | 'PUT'
    data: FormData
  }>

export type RequestUploadFileConfig = RequestCallConfig &
  Readonly<{
    method: 'POST' | 'PUT'
    data: File
  }>

export type ResponseSchemaConfig<ResponseType> = Readonly<{
  responseSchema: z.ZodType<ResponseType>
}>

export type RequestSchemaConfig<RequestType> = Readonly<{
  requestSchema: z.ZodType<RequestType>
}>
