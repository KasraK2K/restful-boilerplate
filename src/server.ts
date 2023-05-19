// ─── PACKAGES ────────────────────────────────────────────────────────────────
import http from "http"
import config from "config"

// ─── MODULES ─────────────────────────────────────────────────────────────────
import app from "./app"
import logger from "./common/helpers/logger.helper"
import { IApplicationConfig } from "../config/config.interface"
import { getUserInformation } from "./common/helpers/information.helper"
import seeder from "./common/helpers/seeder.helper"

const appConfig: IApplicationConfig = config.get("application")
const port: number = Number(process.env.PORT) || appConfig.port

// ─── UNHANDLED REJECTION ────────────────────────────────────────────────────────
process.on("unhandledRejection", (reason, p) => {
  logger.error(`Unhandled Rejection at: Promise ${p} Reason: ${reason}`, { dest: "server.ts" })
})

// ─── UNCAUGHT EXCEPTION ─────────────────────────────────────────────────────────
process.on("uncaughtException", (err) => {
  logger.error(`Uncaught Exception error: ${err.message}`, { dest: "server.ts" })
  process.exit(1)
})

/* -------------------------------------------------------------------------- */
/*                                   Starter                                  */
/* -------------------------------------------------------------------------- */
const httpServer = http.createServer(app)

async function starter() {
  await new Promise((resolve) => resolve(httpServer.listen({ port })))
} // ─────────────────────────────────────── Create Async Starter Function ─────

// ─────────────────────────────────────────────────── Start Server Engine ─────
starter()
  .then(() => {
    logger.info(`🧿 Restful: ${appConfig.host}:${port}/${appConfig.routerVersion}`, { dest: "server.ts" })
    getUserInformation(port)
  })
  .then(async () => seeder.sampleCount())
  .catch((error) => logger.error(error, { dest: "server.ts" }))
