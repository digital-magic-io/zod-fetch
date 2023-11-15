import { HttpHeaders } from './types'

const HeaderNames = {
  ContentType: 'Content-Type',
  Accept: 'Accept',
  Authorization: 'Authorization'
}

export const ContentType = {
  JSON: 'application/json',
  Multipart: 'multipart/form-data'
}

export const jsonSendOnlyHeaders: HttpHeaders = {
  [HeaderNames.ContentType]: ContentType.JSON
}
export const jsonReceiveOnlyHeaders: HttpHeaders = {
  [HeaderNames.Accept]: ContentType.JSON
}

export const jsonSendAndReceiveHeaders: HttpHeaders = {
  ...jsonSendOnlyHeaders,
  ...jsonReceiveOnlyHeaders
}

export const formUrlEncodedSendOnlyHeaders: HttpHeaders = {
  //[HeaderNames.ContentType]: ContentType.Multipart
}

export const formUrlEncodedSendAndReceiveHeaders: HttpHeaders = {
  ...formUrlEncodedSendOnlyHeaders,
  ...jsonReceiveOnlyHeaders
}
