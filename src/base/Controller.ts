import { Request, Response } from "express"
import logger from "../common/helpers/logger.helper"
import { addMetaData, addMetaDataLogic } from "../common/helpers/addMetaData.helper"

type FunctionNn = (args: any) => Promise<Record<string, any>>

class Controller {
  protected async handle(callback: FunctionNn, args: any, req: Request, res: Response) {
    const url = req.originalUrl
    logger.debug(`endpoint: ${url}`, { dest: "Controller.ts" })
    logger.debug(`request: \n${JSON.stringify(req.body, undefined, 4)}`, { dest: "Controller.ts" })

    return await callback((args !== undefined || args !== null) && args)
      .then((result) => {
        const responseData = addMetaDataLogic(req, res, { ...result })
        logger.debug(
          `response: \n${JSON.stringify({ ...responseData, result: "result is omited" }, undefined, 4)}`,
          {
            dest: "Controller.ts",
          }
        )
        return addMetaData(req, res, { ...result })
      })
      .catch((err) => addMetaData(req, res, { ...err, errCode: err.errCode ?? 0 }))
  }
}

export default Controller
