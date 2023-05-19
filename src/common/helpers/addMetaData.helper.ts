import { IApplicationConfig } from "../../../config/config.interface"
import { Request, Response } from "express"
import config from "config"
import error from "./error.helper"
import { IResponseData } from "../interfaces/response.interface"

const applicationConfig: IApplicationConfig = config.get("application")
const mode: string = config.get("mode")

const addErrCode = (
  res: Response,
  errCode: number | undefined,
  data: Record<string, any>,
  setMessage: boolean
): void => {
  if (errCode || errCode === 0) {
    const errObj = error(errCode)
    res.status(errObj.status)
    data.success = false
    data.error_code = errObj.code
    !setMessage && (data.error_messages = [errObj.message])
  }
}

const addStatus = (
  res: Response,
  statusCode: number | undefined,
  data: Record<string, any>,
  setMessage: boolean
): void => {
  if (typeof statusCode === "string" || (statusCode && (statusCode > 599 || statusCode < 100))) {
    const errObj = error(1001)
    res.status(errObj.status)
    data.success = false
    data.error_code = errObj.code
    setMessage && (data.error_messages = [errObj.message])
  } else if (statusCode) {
    statusCode > 399 && (data.success = false)
    res.status(statusCode)
  }
}

const addCustomErrors = (res: Response, errors: string[] | undefined, data: Record<string, any>): void => {
  if (errors && errors.length) {
    const errObj = error(1002)
    data.success = false
    data.error_code = errObj.code
    data.error_messages = errors
    if (res.statusCode === 200) {
      errObj.status && res.status(errObj.status)
    }
  }
}

export const addMetaDataLogic = (
  req: Request,
  res: Response,
  args: {
    data?: Record<string, any> | Record<string, any>[]
    statusCode?: number
    errCode?: number
    errors?: string[]
    [key: string]: any
  } = {}
): IResponseData => {
  const { data, statusCode, errors } = args
  let { errCode } = args
  const isDataArray = Array.isArray(data)

  const resData: IResponseData = {
    api_version: applicationConfig.api_version,
    front_version: applicationConfig.front_version,
    portal_version: applicationConfig.portal_version,
    endpoint: req.originalUrl,
    env: String(process.env.NODE_ENV),
    mode,
    count: isDataArray ? data.length : undefined,
    success: true,
    result: Array.isArray(data) ? { list: data } : data,
  }

  const setMessage = !!(errors && errors.length)

  if (args.code && !errCode && !setMessage) errCode = args.code

  addErrCode(res, setMessage ? 1002 : errCode, resData, setMessage)
  addStatus(res, statusCode, resData, setMessage)
  addCustomErrors(res, errors, resData)

  return resData
}

export const addMetaData = (
  req: Request,
  res: Response,
  args: {
    data?: Record<string, any> | Record<string, any>[]
    statusCode?: number
    errCode?: number
    errors?: string[]
    [key: string]: any
  } = {}
): Response<IResponseData> => {
  return res.json(addMetaDataLogic(req, res, args))
}
