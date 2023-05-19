// ─── PACKAGES ────────────────────────────────────────────────────────────────
import config from "config"
import { Request, Response, NextFunction } from "express"

// ─── MODULES ─────────────────────────────────────────────────────────────────
import Middleware from "./Middleware"
import userService from "../modules/users/service"
import portalUserService from "../modules/portal_users/service"
import { IApplicationConfig } from "../../config/config.interface"
import { addMetaData } from "../common/helpers/addMetaData.helper"
import { TokenType, TokenMode } from "../common/enums/general.enum"

const applicationConfig: IApplicationConfig = config.get("application")

class AuthMiddleware extends Middleware {
  public auth(req: Request, res: Response, next: NextFunction) {
    const endpoint = req.originalUrl
    const ignoreToken: string[] = applicationConfig.request.ignoreToken
    const ignoreApikeys: string[] = applicationConfig.request.ignoreApiKey

    const checkToken = ignoreToken.includes("*")
      ? false
      : !ignoreToken.some((ignoreToken) => endpoint.includes(`/${ignoreToken}`))

    const checkApiKey = ignoreApikeys.includes("*")
      ? false
      : !ignoreApikeys.some((ignoreApiKey) => endpoint.includes(`/${ignoreApiKey}`))

    /* ------------------------------- Check Token ------------------------------ */
    if (checkToken && !res.locals.tokenData) return addMetaData(req, res, { errCode: 1011 })
    /* -------------------------------------------------------------------------- */

    /* ------------------------------ Check API_KEY ----------------------------- */
    if (checkApiKey) {
      const api_key = req.headers[applicationConfig.apiKeyHeader] as string
      if (!api_key) return addMetaData(req, res, { errCode: 1012 })
      else if (api_key !== process.env.API_KEY) return addMetaData(req, res, { errCode: 1013 })
    }
    /* -------------------------------------------------------------------------- */

    next()
  }

  public async isValidUser(req: Request, res: Response, next: NextFunction) {
    const { id, type, mode } = res.locals.tokenData
    const user = await userService.getUserObject({ id })
    if (user && type === TokenType.TOKEN && mode === TokenMode.APP_USER) next()
    else return addMetaData(req, res, { errCode: 1015 })
  }

  public async isValidPortalUser(req: Request, res: Response, next: NextFunction) {
    const { id, type, mode } = res.locals.tokenData
    const portal_user = await portalUserService.getPortalUserObject({ id })
    if (portal_user && type === TokenType.TOKEN && mode === TokenMode.PORTAL_USER) next()
    else return addMetaData(req, res, { errCode: 1015 })
  }
}

export default new AuthMiddleware()
