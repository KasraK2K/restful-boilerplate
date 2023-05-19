import { Response } from "express"

export interface IResponseData {
  api_version: string
  portal_version: string
  front_version: string
  endpoint: string
  env: string
  mode: string
  count?: number
  result?: IResult
  success: boolean
  error_code?: number
  error_messages?: string[]
}

type IResult = Record<string, any> | { list: Record<string, any>[] }

export type IControllerResponse = Promise<Response<IResponseData>>
