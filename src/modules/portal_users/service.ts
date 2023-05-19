// ─── PACKAGES ────────────────────────────────────────────────────────────────
import config from "config"

// ─── MODULES ─────────────────────────────────────────────────────────────────
import Service from "../../base/Service"
import schema from "./validation/schema"
import validator from "../../common/helpers/validator.helper"
import logger from "../../common/helpers/logger.helper"
import tokenHelper from "../../common/helpers/token.helper"
import bcryptHelper from "../../common/helpers/bcrypt.helper"
import cypherUtil from "../../common/utils/cypher.util"
import mailgunJs from "../../integrations/mailgun"
import BullMQ from "../../integrations/bullmq"
import { IGeneralConfig } from "../../../config/config.interface"
import { IDefaultArgs } from "../../common/interfaces/general.interface"
import repository from "./repository"
import { ModuleName, TokenType, TokenMode, QueueName } from "../../common/enums/general.enum"
import { IPortalUserListArgs } from "./constant/interface"
import { uid } from "uid"

const bull = new BullMQ(QueueName.NEW_PORTAL_USER_QUEUE)

// ─── CONSTANTS ───────────────────────────────────────────────────────────────
const generalConfig: IGeneralConfig = config.get("general")

class PortalUserService extends Service {
  static destination = __filename.slice(__filename.indexOf("/src") + 1)

  static async getEntityObject(
    args: { id?: number; email?: string } = {}
  ): Promise<Record<string, any> | undefined> {
    return await repository
      .list(args)
      .then((result) => {
        if (result.length) return result[0]
        else return undefined
      })
      .catch((err) => {
        logger.error(`Error on getting portal_user in PortalUserService.getEntityObject: ${err.message}`, {
          service: ModuleName.PORTAL_USER,
          dest: PortalUserService.destination,
        })
        return undefined
      })
  }

  public async list(args: IPortalUserListArgs): Promise<Record<string, any>> {
    return new Promise((resolve, reject) => {
      const { valid, errors } = validator(args, schema.list)

      if (!valid) {
        logger.warn(`Validation has error on PortalUserService.list: ${errors}`, {
          service: ModuleName.PORTAL_USER,
          dest: PortalUserService.destination,
        })
        return reject({ errors })
      } else
        repository
          .list(args)
          .then((result) => resolve({ data: result }))
          .catch((err) => reject(err))
    })
  }

  public async profile(id: number): Promise<Record<string, any>> {
    return new Promise((resolve, reject) => {
      const { valid, errors } = validator({ id }, schema.profile)

      if (!valid) {
        logger.warn(`Validation has error on PortalUserService.profile: ${errors}`, {
          service: ModuleName.PORTAL_USER,
          dest: PortalUserService.destination,
        })
        return reject({ errors })
      } else
        repository
          .profile(id)
          .then((result) => resolve({ data: result }))
          .catch((err) => reject(err))
    })
  }

  public async upsert(args: IDefaultArgs = {}): Promise<Record<string, any>> {
    return new Promise((resolve, reject) => {
      const { id } = args
      let valid: boolean
      let errors: string[]

      if (id) {
        const upsertValidation = validator(args, schema.update)
        valid = upsertValidation.valid
        errors = upsertValidation.errors
      } else {
        const createValidation = validator(args, schema.create)
        valid = createValidation.valid
        errors = createValidation.errors
      }

      if (!valid) {
        logger.warn(`Validation has error on PortalUserService.upsert: ${errors}`, {
          service: ModuleName.PORTAL_USER,
          dest: PortalUserService.destination,
        })
        return reject({ errors })
      } else {
        args.password && (args.password = bcryptHelper.hashGen(args.password))
        repository
          .upsert(args)
          .then((result) => resolve({ data: result }))
          .catch((err) => reject(err))
      }
    })
  }

  public async inviteNewPortalUser(args: IDefaultArgs): Promise<Record<string, any>> {
    return new Promise(async (resolve, reject) => {
      if (args.token_reseller_id > 0) {
        // reseller
        args.reseller_id = args.token_reseller_id
      }

      const { valid, errors } = validator(args, schema.inviteNewPortalUser)

      if (!valid) {
        logger.warn(`Validation has error on PortalUserService.inviteNewPortalUser: ${errors}`, {
          service: ModuleName.PORTAL_USER,
          dest: PortalUserService.destination,
        })
        return reject({ errors })
      } else {
        const password = uid(6)
        args.password = bcryptHelper.hashGen(password)
        await repository
          .upsert(args)
          .then((result) => {
            // ─── Send Password To New User Email ─────────────────────────────────────────
            const jobName = `send-password-to-portal-user-${result?.id}`
            bull.job.create(jobName, { ...args, password, id: result?.id }, { removeOnComplete: true })
            // ─────────────────────────────────────────────────────────────────────────────
            return resolve({ data: result })
          })
          .catch((err) => reject(err))
      }
    })
  }

  public async archive(id: number): Promise<Record<string, any>> {
    return new Promise((resolve, reject) => {
      const { valid, errors } = validator({ id }, schema.id)

      if (!valid) {
        logger.warn(`Validation has error on PortalUserService.archive: ${errors}`, {
          service: ModuleName.PORTAL_USER,
          dest: PortalUserService.destination,
        })
        return reject({ errors })
      } else
        repository
          .archive(id)
          .then((result) => resolve({ data: result }))
          .catch((err) => reject(err))
    })
  }

  public async restore(id: number): Promise<Record<string, any>> {
    return new Promise((resolve, reject) => {
      const { valid, errors } = validator({ id }, schema.id)

      if (!valid) {
        logger.warn(`Validation has error on PortalUserService.restore: ${errors}`, {
          service: ModuleName.PORTAL_USER,
          dest: PortalUserService.destination,
        })
        return reject({ errors })
      } else
        repository
          .restore(id)
          .then((result) => resolve({ data: result }))
          .catch((err) => reject(err))
    })
  }

  public async toggleIsAdmin(id: number): Promise<Record<string, any>> {
    return new Promise((resolve, reject) => {
      const { valid, errors } = validator({ id }, schema.id)

      if (!valid) {
        logger.warn(`Validation has error on PortalUserService.toggleIsAdmin: ${errors}`, {
          service: ModuleName.PORTAL_USER,
          dest: PortalUserService.destination,
        })
        return reject({ errors })
      } else
        repository
          .toggleIsAdmin(id)
          .then((result) => resolve({ data: result }))
          .catch((err) => reject(err))
    })
  }

  public async delete(id: number): Promise<Record<string, any>> {
    return new Promise((resolve, reject) => {
      const { valid, errors } = validator({ id }, schema.id)

      if (!valid) {
        logger.warn(`Validation has error on PortalUserService.delete: ${errors}`, {
          service: ModuleName.PORTAL_USER,
          dest: PortalUserService.destination,
        })
        return reject({ errors })
      } else
        repository
          .delete(id)
          .then((result) => resolve({ data: result }))
          .catch((err) => reject(err))
    })
  }

  public async login(args: {
    email: string
    password: string
    reseller_id?: number
  }): Promise<Record<string, any>> {
    return new Promise(async (resolve, reject) => {
      const { valid, errors } = validator(args, schema.login)
      if (!valid) {
        logger.warn(`Validation has error on PortalUserService.login: ${errors}`, {
          service: ModuleName.PORTAL_USER,
          dest: PortalUserService.destination,
        })
        return reject({ errors })
      } else
        await repository
          .getExistPortalUser(args)
          .then((portal_user) => {
            if (portal_user && bcryptHelper.compareHash(args.password, portal_user.password))
              return resolve({ data: super.createToken(portal_user, TokenMode.PORTAL_USER) })
            else return reject({ errCode: 1015 })
          })
          .catch((err) => reject(err))
    })
  }

  public async refreshToken(args: { refresh_token: string; secret: string }): Promise<Record<string, any>> {
    return new Promise(async (resolve, reject) => {
      const { valid, errors } = validator(args, schema.refreshToken)

      if (!valid) {
        logger.warn(`Validation has error on PortalUserService.refreshToken: ${errors}`, {
          service: ModuleName.PORTAL_USER,
          dest: PortalUserService.destination,
        })
        return reject({ errors })
      } else {
        const { refresh_token, secret } = args
        const verifiedToken = tokenHelper.verify(refresh_token)

        if (!verifiedToken.valid || verifiedToken.data.type !== TokenType.REFRESH)
          return reject({ errCode: 1010 })
        else {
          const decodedToken = cypherUtil.cypherToText(secret)
          const [id, email] = decodedToken.split("--")
          const portal_user = await PortalUserService.getEntityObject({ id: +id, email })

          if (!portal_user) return reject({ errCode: 1010 })
          else
            return resolve({ data: super.createToken({ id: verifiedToken.data.id }, TokenMode.PORTAL_USER) })
        }
      }
    })
  }

  public async forgotPassword(email: string): Promise<Record<string, any>> {
    return new Promise(async (resolve, reject) => {
      const { valid, errors } = validator({ email }, schema.forgotPassword)

      if (!valid) {
        logger.warn(`Validation has error on PortalUserService.forgotPassword: ${errors}`, {
          service: ModuleName.PORTAL_USER,
          dest: PortalUserService.destination,
        })
        return reject({ errors })
      } else {
        const portal_user = await PortalUserService.getEntityObject({ email })

        if (portal_user) {
          const forgotToken = tokenHelper.sign(
            { id: portal_user.id, email: portal_user.email },
            { expiresIn: "30m" }
          )

          mailgunJs.message
            .createMessage({
              to: [portal_user.email],
              subject: "Portal user reset password link",
              html: /* HTML */ `
                <h1>Forgot Password</h1>
                <br />
                <p>
                  To reset your password click
                  <a
                    href="${generalConfig.frontendDomain}/auth/reset-password?i=${forgotToken}&k=1"
                    target="_blank"
                  >
                    here
                  </a>
                </p>
              `,
            })
            .then((response) => resolve({ data: response }))
            .catch((err) => {
              logger.error(err, {
                service: ModuleName.PORTAL_USER,
                dest: PortalUserService.destination + ":forgotPassword",
              })
              return reject({ errCode: 1017 })
            })
        } else return reject({ errCode: 1016 })
      }
    })
  }

  public async resetPassword(args: { secret: string; password: string }): Promise<Record<string, any>> {
    return new Promise(async (resolve, reject) => {
      const { valid, errors } = validator(args, schema.resetPassword)

      if (!valid) {
        logger.warn(`Validation has error on PortalUserService.resetPassword: ${errors}`, {
          service: ModuleName.PORTAL_USER,
          dest: PortalUserService.destination,
        })
        return reject({ errors })
      } else {
        const { secret, password } = args
        const verifiedSecret = tokenHelper.verify(secret)

        if (!verifiedSecret.valid) reject({ errCode: 1010 })
        else {
          const { id, email } = verifiedSecret.data
          const portal_user = await PortalUserService.getEntityObject({ id: +id, email })
          if (portal_user)
            await repository
              .upsert({ id: +id, email, password: bcryptHelper.hashGen(password) })
              .then((result) => resolve({ data: result }))
              .catch((err) => reject(err))
          else return reject({ errCode: 1016 })
        }
      }
    })
  }

  /**
   * I wrote this just to get portal user object, and it should not use in a controller.
   */
  public async getPortalUserObject(
    args: { id?: number; email?: string } = {}
  ): Promise<Record<string, any> | undefined> {
    return await this.list(args)
      .then((result) => {
        if (result.data.length) return result.data[0]
        else return undefined
      })
      .catch((err) => {
        logger.error(
          `Error on getting portal_user in PortalUserService.getPortalUserObject: ${err.message}`,
          {
            service: ModuleName.PORTAL_USER,
            dest: PortalUserService.destination,
          }
        )
        return undefined
      })
  }
}

export default new PortalUserService()
