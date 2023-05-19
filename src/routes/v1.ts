import express, { Request, Response } from "express"
import { addMetaData } from "../common/helpers/addMetaData.helper"
import { routes as portalUserRoutes } from "../modules/portal_users/module"
import { routes as userRoutes } from "../modules/users/module"

const router = express.Router()

router.all("/__health", (req: Request, res: Response) => addMetaData(req, res, {}))

router.use("/portal-user", portalUserRoutes)
router.use("/user", userRoutes)

export default router
