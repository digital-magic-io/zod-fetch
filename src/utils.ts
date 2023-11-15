import { evaluate } from '@digital-magic/ts-common-utils'
import {
  RequestCallConfig,
  RequestReceiveConfig,
  RequestSendConfig,
  RequestUploadConfig,
  RequestUploadFileConfig
} from './types'
import { RequestContext, ResponseContext } from './errors/types'

export const buildRequestCallContext = (config: RequestCallConfig): RequestContext => {
  return {
    url: evaluate(config.url),
    method: config.method,
    headers: config.headers
  }
}

export const buildRequestSendContext = (config: RequestSendConfig<unknown>): RequestContext => ({
  url: evaluate(config.url),
  method: config.method,
  headers: config.headers,
  data: config.data
})

export const buildRequestReceiveContext = (config: RequestReceiveConfig): RequestContext => ({
  url: evaluate(config.url),
  method: config.method,
  headers: config.headers
  //params: config.params
})

export const buildResponseContext = (response: Response, data: unknown): ResponseContext => ({
  httpStatus: response.status,
  httpStatusText: response.statusText,
  headers: Object.fromEntries(response.headers.entries()),
  data
})

export const requestUploadFileConfigToRequestUploadConfig = <
  T extends RequestUploadFileConfig,
  R extends RequestUploadConfig
>(
  config: T
): R => {
  const data = new FormData()
  data.append('file', config.data)
  return {
    ...config,
    data
  } as R
}
