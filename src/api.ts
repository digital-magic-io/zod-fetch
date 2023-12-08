import * as z from 'zod'
import { evaluate } from '@digital-magic/ts-common-utils'
import { httpError, invalidRequestError, invalidResponseError } from './errors/utils'
import {
  RequestCallConfig,
  RequestReceiveConfig,
  RequestSchemaConfig,
  RequestSendConfig,
  RequestUploadConfig,
  RequestUploadFileConfig,
  ResponseSchemaConfig
} from './types'
import {
  buildRequestCallContext,
  buildRequestReceiveContext,
  buildRequestSendContext,
  buildResponseContext,
  requestUploadFileConfigToRequestUploadConfig
} from './utils'
import { RequestContext, ResponseContext } from './errors/types'
import {
  formUrlEncodedSendAndReceiveHeaders,
  formUrlEncodedSendOnlyHeaders,
  jsonReceiveOnlyHeaders,
  jsonSendAndReceiveHeaders,
  jsonSendOnlyHeaders
} from './headers'

const verifyRequestBody = <T>(config: RequestSendConfig<unknown> & RequestSchemaConfig<T>): Promise<T> => {
  const validated = config.requestSchema.safeParse(config.data)
  if (!validated.success) {
    return Promise.reject(invalidRequestError(buildRequestSendContext(config), validated.error))
  } else {
    return Promise.resolve(validated.data)
  }
}

const verifyResponseBody = <T>(
  schema: Readonly<z.ZodType<T>>,
  request: RequestContext,
  response: ResponseContext
): Promise<T> => {
  const validated = schema.safeParse(response.data)
  if (!validated.success) {
    return Promise.reject(invalidResponseError(request, response, validated.error))
  } else {
    return Promise.resolve(validated.data)
  }
}

const verifyResponse = (request: RequestContext, response: Response): Promise<Response> =>
  response.ok
    ? Promise.resolve(response)
    : response.json().then(data => Promise.reject(httpError(request, buildResponseContext(response, data))))

export const httpCall = async (config: RequestCallConfig): Promise<void> =>
  fetch(evaluate(config.url), {
    method: config.method,
    headers: config.headers
  })
    .then((response) => verifyResponse(buildRequestCallContext(config), response))
    .then(() => Promise.resolve())

export const httpReceive = async (config: RequestCallConfig): Promise<Response> =>
  fetch(evaluate(config.url), {
    method: config.method,
    headers: config.headers
  }).then((response) => verifyResponse(buildRequestCallContext(config), response))

export const httpSendOnlyJson = async <RequestType>(
  config: RequestSendConfig<unknown> & RequestSchemaConfig<RequestType>
): Promise<void> =>
  verifyRequestBody(config).then(() =>
    fetch(evaluate(config.url), {
      method: config.method,
      headers: config.headers ?? jsonSendOnlyHeaders,
      body: JSON.stringify(config.data)
    })
      .then((response) => verifyResponse(buildRequestSendContext(config), response))
      .then(() => Promise.resolve())
  )

export const httpReceiveOnlyJson = async <ResponseType>(
  config: RequestReceiveConfig & ResponseSchemaConfig<ResponseType>
): Promise<ResponseType> =>
  fetch(evaluate(config.url), {
    method: config.method,
    headers: config.headers ?? jsonReceiveOnlyHeaders
  })
    .then((response) => verifyResponse(buildRequestReceiveContext(config), response))
    .then((response) =>
      response
        .json()
        .then((data) =>
          verifyResponseBody(
            config.responseSchema,
            buildRequestReceiveContext(config),
            buildResponseContext(response, data)
          )
        )
    )

export const httpSendAndReceiveJson = async <RequestType, ResponseType>(
  config: RequestSendConfig<unknown> & RequestSchemaConfig<RequestType> & ResponseSchemaConfig<ResponseType>
): Promise<ResponseType> =>
  verifyRequestBody(config)
    .then(() =>
      fetch(evaluate(config.url), {
        method: config.method,
        headers: config.headers ?? jsonSendAndReceiveHeaders,
        body: JSON.stringify(config.data)
      })
    )
    .then((response) => verifyResponse(buildRequestSendContext(config), response))
    .then((response) =>
      response
        .json()
        .then((data) =>
          verifyResponseBody(
            config.responseSchema,
            buildRequestSendContext(config),
            buildResponseContext(response, data)
          )
        )
    )

export const httpUploadOnly = async (config: RequestUploadConfig): Promise<void> =>
  fetch(evaluate(config.url), {
    method: config.method,
    headers: config.headers ?? formUrlEncodedSendOnlyHeaders,
    body: config.data
  })
    .then((response) => verifyResponse(buildRequestSendContext(config), response))
    .then(() => Promise.resolve())

export const httpUploadAndReceiveJson = async <ResponseType>(
  config: RequestUploadConfig & ResponseSchemaConfig<ResponseType>
): Promise<ResponseType> =>
  fetch(evaluate(config.url), {
    method: config.method,
    headers: config.headers ?? formUrlEncodedSendAndReceiveHeaders,
    body: config.data
  })
    .then((response) => verifyResponse(buildRequestSendContext(config), response))
    .then((response) =>
      response
        .json()
        .then((data) =>
          verifyResponseBody(
            config.responseSchema,
            buildRequestSendContext(config),
            buildResponseContext(response, data)
          )
        )
    )

export const httpUploadAndReceiveText = async (
  config: RequestUploadConfig
): Promise<string> =>
  fetch(evaluate(config.url), {
    method: config.method,
    headers: config.headers ?? formUrlEncodedSendAndReceiveHeaders,
    body: config.data
  })
    .then((response) => verifyResponse(buildRequestSendContext(config), response))
    .then((response) => response.text())

export const httpUploadFileOnly = (config: RequestUploadFileConfig): Promise<void> =>
  httpUploadOnly(requestUploadFileConfigToRequestUploadConfig(config))

export const httpUploadFileAndReceiveJson = async <ResponseType>(
  config: RequestUploadFileConfig & ResponseSchemaConfig<ResponseType>
): Promise<ResponseType> => httpUploadAndReceiveJson(requestUploadFileConfigToRequestUploadConfig(config))

export const httpUploadFileAndReceiveText = async (config: RequestUploadFileConfig): Promise<string> =>
  httpUploadAndReceiveText(requestUploadFileConfigToRequestUploadConfig(config))
