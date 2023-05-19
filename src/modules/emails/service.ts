// ─── MODULES ─────────────────────────────────────────────────────────────────
import emailLogic from "./libs/emailLogic"
import Service from "../../base/Service"
import logger from "../../common/helpers/logger.helper"
import { Worker, Job } from "../../integrations/bullmq"
import { QueueName } from "../../common/enums/general.enum"
import IORedis from "ioredis"
import config from "config"
import { IRedisIoConfig } from "../../../config/config.interface"

const ioRedisConfig: IRedisIoConfig = config.get("database.ioRedis")
const connection = new IORedis(ioRedisConfig)

/**
 * Every Worker Should call in constructor and the queue name should add into QueueName enum
 */
class EmailService extends Service {
  static destination = __filename.slice(__filename.indexOf("/src") + 1)

  constructor() {
    super()
    this.inviteNewUser()
    this.inviteNewPortalUser()
  }

  public async inviteNewUser(): Promise<void> {
    const worker = new Worker(
      QueueName.NEW_USER_QUEUE,
      async (job: Job) => await emailLogic.inviteNewUser(job.data),
      { connection }
    )

    worker.on("completed", (job) => logger.info(`job (${job.name}) has completed!`))
    worker.on("failed", (job, err) => logger.error(`job (${job.name}) has failed with ${err.message}`))
  }

  public async inviteNewPortalUser(): Promise<void> {
    const worker = new Worker(
      QueueName.NEW_PORTAL_USER_QUEUE,
      async (job: Job) => await emailLogic.inviteNewPortalUser(job.data),
      { connection }
    )

    worker.on("completed", (job) => logger.info(`job (${job.name}) has completed!`))
    worker.on("failed", (job, err) => logger.error(`job (${job.name}) has failed with ${err.message}`))
  }
}

export default new EmailService()
