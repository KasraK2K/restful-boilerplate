// ─── PACKAGES ────────────────────────────────────────────────────────────────
import config from "config"
import _ from "lodash"
import { uid } from "uid"
import { OAuth2Client } from "google-auth-library"

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
import { QueueName, ModuleName, TokenMode, TokenType } from "../../common/enums/general.enum"
import { IUserListArgs } from "./constant/interface"

const bull = new BullMQ(QueueName.NEW_USER_QUEUE)

// ─── CONSTANTS ───────────────────────────────────────────────────────────────
const generalConfig: IGeneralConfig = config.get("general")

class UserService extends Service {
  static destination = __filename.slice(__filename.indexOf("/src") + 1)

  static async getEntityObject(args: IUserListArgs = {}): Promise<Record<string, any> | undefined> {
    return await repository
      .list(args)
      .then((result) => {
        if (result.length) return result[0]
        else return undefined
      })
      .catch((err) => {
        logger.error(`Error on getting user in UserService.getEntityObject: ${err.message}`, {
          service: ModuleName.USER,
          dest: UserService.destination,
        })
        return undefined
      })
  }

  public async list(args: IUserListArgs): Promise<Record<string, any>> {
    return new Promise((resolve, reject) => {
      const { valid, errors } = validator(args, schema.list)

      if (!valid) {
        logger.warn(`Validation has error on Service.list: ${errors}`, {
          service: ModuleName.USER,
          dest: UserService.destination,
        })
        return reject({ errors })
      } else {
        repository
          .list(args)
          .then((result) => resolve({ data: result }))
          .catch((err) => reject(err))
      }
    })
  }

  public async fullList(args: IDefaultArgs): Promise<Record<string, any>> {
    return new Promise((resolve, reject) => {
      const { valid, errors } = validator(args.body, schema.listWithJoin)

      if (!valid) {
        logger.warn(`Validation has error on Service.list: ${errors}`, {
          service: ModuleName.USER,
          dest: UserService.destination,
        })
        return reject({ errors })
      } else {
        repository
          .fullList(args)
          .then((result) => resolve({ data: result }))
          .catch((err) => reject(err))
      }
    })
  }

  public async profile(id: number): Promise<Record<string, any>> {
    return new Promise((resolve, reject) => {
      const { valid, errors } = validator({ id }, schema.profile)

      if (!valid) {
        logger.warn(`Validation has error on UserService.profile: ${errors}`, {
          service: ModuleName.USER,
          dest: UserService.destination,
        })
        return reject({ errors })
      } else
        repository
          .profile(id)
          .then((result) => resolve({ data: result }))
          .catch((err) => reject(err))
    })
  }

  public async upsert(args: IDefaultArgs): Promise<Record<string, any>> {
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
        logger.warn(`Validation has error on UserService.upsert: ${errors}`, {
          service: ModuleName.USER,
          dest: UserService.destination,
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

  public async profileUpdate(args: IDefaultArgs): Promise<Record<string, any>> {
    return new Promise((resolve, reject) => {
      const { valid, errors } = validator(args, schema.profileUpdate)

      if (!valid) {
        logger.warn(`Validation has error on UserService.profileUpdate: ${errors}`, {
          service: ModuleName.USER,
          dest: UserService.destination,
        })
        return reject({ errors })
      } else {
        let payload = {}
        if ("name" in args) {
          const [first_name = "", surname = ""] = args.name.split(" ")
          delete args.name
          payload = { ...args, first_name, surname }
        } else payload = { ...args }

        repository
          .upsert(payload)
          .then((result) => resolve({ data: result }))
          .catch((err) => reject(err))
      }
    })
  }

  public async inviteNewUser(args: IDefaultArgs): Promise<Record<string, any>> {
    return new Promise(async (resolve, reject) => {
      const { valid, errors } = validator(args, schema.inviteNewUser)

      if (!valid) {
        logger.warn(`Validation has error on UserService.inviteNewUser: ${errors}`, {
          service: ModuleName.USER,
          dest: UserService.destination,
        })
        return reject({ errors })
      } else {
        // ————— find the reseller with the organisation code
        const { organisation_code, reseller_id } = args
        if (reseller_id === 0 && organisation_code && organisation_code.length > 0) {
          const resellerObj: Record<string, any> = {}
          // await resellerService
          //   .list({ organisation_code: organisation_code })
          //   .then((result) => {
          //     if (result.data.length > 0) resellerObj = result.data[0]
          //   })
          //   .catch((err) => reject(err))

          if (_.keys(resellerObj).length === 0) return reject({ errCode: 1016 })
          else args.reseller_id = resellerObj.id
        }
        delete args.organisation_code

        const password = uid(6)
        args.password = bcryptHelper.hashGen(password)
        args.is_verified = true
        await repository
          .upsert(args)
          .then((result) => {
            // ─── Send Password To New User Email ─────────────────────────────────────────
            const jobName = `send-password-to-user-${result?.id}`
            bull.job.create(
              jobName,
              { ...args, password, id: result?.id, reseller_id: args.reseller_id },
              { removeOnComplete: true }
            )
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
        logger.warn(`Validation has error on UserService.archive: ${errors}`, {
          service: ModuleName.USER,
          dest: UserService.destination,
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
        logger.warn(`Validation has error on UserService.restore: ${errors}`, {
          service: ModuleName.USER,
          dest: UserService.destination,
        })
        return reject({ errors })
      } else
        repository
          .restore(id)
          .then((result) => resolve({ data: result }))
          .catch((err) => reject(err))
    })
  }

  public async toggleIsBlocked(id: number): Promise<Record<string, any>> {
    return new Promise((resolve, reject) => {
      const { valid, errors } = validator({ id }, schema.id)

      if (!valid) {
        logger.warn(`Validation has error on UserService.toggleIsBlocked: ${errors}`, {
          service: ModuleName.USER,
          dest: UserService.destination,
        })
        return reject({ errors })
      } else
        repository
          .toggleIsBlocked(id)
          .then((result) => resolve({ data: result }))
          .catch((err) => reject(err))
    })
  }

  public async delete(id: number): Promise<Record<string, any>> {
    return new Promise((resolve, reject) => {
      const { valid, errors } = validator({ id }, schema.id)

      if (!valid) {
        logger.warn(`Validation has error on UserService.delete: ${errors}`, {
          service: ModuleName.USER,
          dest: UserService.destination,
        })
        return reject({ errors })
      } else
        repository
          .delete(id)
          .then((result) => resolve({ data: result }))
          .catch((err) => reject(err))
    })
  }

  public async login(args: { email: string; password: string }): Promise<Record<string, any>> {
    return new Promise(async (resolve, reject) => {
      const { valid, errors } = validator(args, schema.login)
      if (!valid) {
        logger.warn(`Validation has error on UserService.login: ${errors}`, {
          service: ModuleName.USER,
          dest: UserService.destination,
        })
        return reject({ errors })
      } else
        await repository
          .getExistUser(args)
          .then((user) => {
            if (user && bcryptHelper.compareHash(args.password, user.password))
              return resolve({ data: super.createToken(user, TokenMode.APP_USER) })
            else return reject({ errCode: 1015 })
          })
          .catch((err) => reject(err))
    })
  }

  public async socialLogin(args: Record<string, any>): Promise<Record<string, any>> {
    return new Promise(async (resolve, reject) => {
      const { token_id = "", kind = 0, first_name = "", surname = "", email = "" } = args

      const { valid, errors } = validator(args, schema.socialLogin)
      if (!valid) {
        logger.warn(`Validation has error on UserService.socialLogin: ${errors}`, {
          service: ModuleName.USER,
          dest: UserService.destination,
        })
        return reject({ errors })
      } else {
        const CLIENT_ID = "448802826264-437r9mf1feidfcrh4oi5gg5ecg4iiio8.apps.googleusercontent.com"
        const client = new OAuth2Client(CLIENT_ID)

        const upsertObj = {
          id: 0,
          email: "",
          password: "",
          contact_number: "",
          first_name: "",
          surname: "",
          //reseller_id: 0,
          login_id: "",
          login_type: 0,
        }

        if (kind == "google") {
          upsertObj.login_type = 1

          // ————— VERIFY GOOGLE TOKEN
          await client
            .verifyIdToken({ idToken: token_id, audience: CLIENT_ID })
            .then(async (response) => {
              const payload = response.getPayload()
              upsertObj.email = payload?.email ?? ""
              upsertObj.first_name = payload?.given_name ?? ""
              upsertObj.surname = payload?.family_name ?? ""
              upsertObj.login_id = payload?.sub ?? ""
            })
            .catch((err) => reject(err))
        } else if (kind == "apple") {
          upsertObj.login_type = 2
          upsertObj.login_id = token_id
          upsertObj.email = email
          upsertObj.first_name = first_name
          upsertObj.surname = surname
        }

        // ————— CHECK USER EXISTS
        await repository
          .list({ login_type: upsertObj.login_type, login_id: upsertObj.login_id })
          .then((users) => {
            if (users.length > 0) upsertObj.id = users[0].id
          })
          .catch(() => {
            return
          })

        // ————— ADD USER TO DATABASE
        await repository
          .upsert(upsertObj)
          .then((userResult) => {
            if (userResult) resolve({ data: super.createToken(userResult, TokenMode.APP_USER) })
            else reject({ errCode: 0 })
          })
          .catch((err) => reject(err))
      }
    })
  }

  public async refreshToken(args: { refresh_token: string; secret: string }): Promise<Record<string, any>> {
    return new Promise(async (resolve, reject) => {
      const { valid, errors } = validator(args, schema.refreshToken)

      if (!valid) {
        logger.warn(`Validation has error on UserService.refreshToken: ${errors}`, {
          service: ModuleName.USER,
          dest: UserService.destination,
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
          const user = await UserService.getEntityObject({ id: +id, email })

          if (!user) return reject({ errCode: 1010 })
          else return resolve({ data: super.createToken({ id: verifiedToken.data.id }, TokenMode.APP_USER) })
        }
      }
    })
  }

  public async forgotPassword(email: string): Promise<Record<string, any>> {
    return new Promise(async (resolve, reject) => {
      const { valid, errors } = validator({ email }, schema.forgotPassword)

      if (!valid) {
        logger.warn(`Validation has error on UserService.forgotPassword: ${errors}`, {
          service: ModuleName.USER,
          dest: UserService.destination,
        })
        return reject({ errors })
      } else {
        const user = await UserService.getEntityObject({ email })

        if (user) {
          const forgotToken = tokenHelper.sign({ id: user.id, email: user.email }, { expiresIn: "30m" })

          mailgunJs.message
            .createMessage({
              to: [user.email],
              subject: "user reset password link",
              html: /* HTML */ `
                <h1>Forgot Password</h1>
                <br />
                <p>
                  To reset your password click
                  <a
                    href="${generalConfig.frontendDomain}/auth/reset-password?i=${forgotToken}&k=0"
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
                service: ModuleName.USER,
                dest: UserService.destination + ":forgotPassword",
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
        logger.warn(`Validation has error on UserService.resetPassword: ${errors}`, {
          service: ModuleName.USER,
          dest: UserService.destination,
        })
        return reject({ errors })
      } else {
        const { secret, password } = args
        const verifiedSecret = tokenHelper.verify(secret)

        if (!verifiedSecret.valid) reject({ errCode: 1010 })
        else {
          const { id, email } = verifiedSecret.data
          const user = await UserService.getEntityObject({ id: +id, email })
          if (user)
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
   * I wrote this just to get user object, and it should not use in a controller.
   */
  public async getUserObject(
    args: { id?: number; email?: string } = {}
  ): Promise<Record<string, any> | undefined> {
    return await this.list(args)
      .then((result) => {
        if (result.data.length) return result.data[0]
        else return undefined
      })
      .catch((err) => {
        logger.error(`Error on getting user in UserService.getUserObject: ${err.message}`, {
          service: ModuleName.USER,
          dest: UserService.destination + ":getUserObject",
        })
        return undefined
      })
  }

  public async signup(args: Record<string, any>): Promise<Record<string, any>> {
    return new Promise(async (resolve, reject) => {
      const { email, password, organisation_code } = args

      const createValidation = validator(args, schema.signup)
      const valid: boolean = createValidation.valid
      const errors: string[] = createValidation.errors

      if (!valid) {
        logger.warn(`Validation has error on UserService.signup: ${errors}`, {
          service: ModuleName.USER,
          dest: UserService.destination,
        })
        return reject({ errors })
      } else {
        // ————— find the reseller with the organisation code
        if (organisation_code && organisation_code.length > 0) {
          const resellerObj: Record<string, any> = {}
          // await resellerService
          //   .list({ organisation_code: organisation_code })
          //   .then((result) => {
          //     if (result.data.length > 0) resellerObj = result.data[0]
          //   })
          //   .catch((err) => reject(err))

          if (_.keys(resellerObj).length === 0) {
            return reject({ errCode: 1016 })
          } else args.reseller_id = resellerObj.id
        }
        delete args.organisation_code

        // ————— CREATE ACCOUNT
        let signupSuccess = false
        args.password && (args.password = bcryptHelper.hashGen(args.password))
        await repository
          .upsert(args)
          .then(() => {
            signupSuccess = true
          })
          .catch((err) => reject(err))

        // ————— SIGNIN THE USER
        if (signupSuccess) {
          console.log({ email, password })

          await repository
            .getExistUser({ email, password })
            .then((user) => {
              console.log({ user })

              if (user && bcryptHelper.compareHash(password, user.password))
                return resolve({ data: super.createToken(user, TokenMode.APP_USER) })
              else return reject({ errCode: 1015 })
            })
            .catch((err) => reject(err))

          // await this.login({email, password})
          //   .then((result) => {
          //     console.log({logingResult: result});
          //     resolve({ data: result })
          //   })
          //   .catch((err) => reject(err))
        }
      }
    })
  }
}

export default new UserService()
