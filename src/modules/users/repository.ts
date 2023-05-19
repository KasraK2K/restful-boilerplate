// ─── MODULES ─────────────────────────────────────────────────────────────────
import Repository from "../../base/repository/Repository"
import logger from "../../common/helpers/logger.helper"
import { IDefaultArgs } from "../../common/interfaces/general.interface"
import { ModuleName } from "../../common/enums/general.enum"
import { UserType } from "./constant/enum"
import { IUserListArgs } from "./constant/interface"

class UserRepository extends Repository {
  static destination = __filename.slice(__filename.indexOf("/src") + 1)

  public list(args: IUserListArgs = {}): Promise<Record<string, any>[]> {
    return new Promise(async (resolve, reject) => {
      return await this.select()
        .from("users")
        .where(args)
        .orderBy("id", "ASC")
        .exec({ omits: ["password"] })
        .then((result) => resolve(result))
        .catch(async (err) => {
          logger.error(err, { service: ModuleName.USER, dest: UserRepository.destination + ":list" })
          return reject(err)
        })
    })
  }

  public fullList(args: IDefaultArgs = {}): Promise<Record<string, any>[]> {
    return new Promise(async (resolve, reject) => {
      const { body, tokenData } = args

      const where: string[] = []
      if ("id" in body) where.push(` U.id = ${body.id} `)
      if ("email" in body) where.push(` U.email = '${body.email}' `)
      if ("is_active" in body) where.push(` U.is_active = ${body.is_active} `)
      if ("is_archive" in body) where.push(` U.is_archive = ${body.is_archive} `)

      if ("type" in body) {
        const type = body.type ?? UserType.ALL
        if (tokenData.reseller_id === 0) {
          if (type === UserType.DIRECT) where.push(` U.reseller_id = 0 `)
          else if (type === UserType.RESELLER) where.push(` U.reseller_id > 0 `)
        } else where.push(` U.reseller_id = ${tokenData.reseller_id} `)
      }

      const whereStr = where.length > 0 ? /* SQL */ ` WHERE ${where.join(" AND ")}` : ""

      const query = /* SQL */ `
          SELECT U.*, COUNT(E.*)::int AS service_requested_count
          FROM users U
                   LEFT JOIN enquiries E ON E.user_id = U.id
              ${whereStr}
          GROUP BY U.id
          ORDER BY U.created_at DESC
			`

      return await this.executeQuery({ query: query, omits: ["password"] })
        .then((result) => {
          return result.rows.length ? resolve(result.rows) : resolve([])
        })
        .catch(async (err) => {
          logger.error(err, { service: ModuleName.USER, dest: UserRepository.destination + ":list" })
          return reject(err)
        })
    })
  }

  public profile(id: number): Promise<Record<string, any>> {
    return new Promise(async (resolve, reject) => {
      return await this.select()
        .from("users")
        .where([`id = '${id}'`])
        .exec()
        .then((result) => {
          return result.length ? resolve(result[0]) : resolve({})
        })
        .catch(async (err) => {
          logger.error(err, { service: ModuleName.USER, dest: UserRepository.destination + ":profile" })
          return reject(err)
        })
    })
  }

  public upsert(args: IDefaultArgs = {}): Promise<Record<string, any> | null> {
    return new Promise(async (resolve, reject) => {
      if ("email" in args) args.email = args.email.toLocaleLowerCase()

      return await this.upsert_query("users", args)
        .exec({ omits: ["password"] })
        .then((result) => {
          return result.length ? resolve(result[0]) : resolve(null)
        })
        .catch(async (err) => {
          logger.error(err, { service: ModuleName.USER, dest: UserRepository.destination + ":upsert" })
          return reject(err)
        })
    })
  }

  public archive(id: number): Promise<Record<string, any> | null> {
    return new Promise(async (resolve, reject) => {
      return await this.executeQuery({
        query: /* SQL */ `
            UPDATE users
            SET is_archive  = $1,
                archived_at = $2
            WHERE id = $3
              AND is_archive = $4
            RETURNING *
				`,
        parameters: [true, "NOW()", id, false],
        omits: ["password"],
      })
        .then((result) => {
          return result.rows.length ? resolve(result.rows[0]) : resolve(null)
        })
        .catch(async (err) => {
          logger.error(err, { service: ModuleName.USER, dest: UserRepository.destination + ":archive" })
          return reject(err)
        })
    })
  }

  public restore(id: number): Promise<Record<string, any> | null> {
    return new Promise(async (resolve, reject) => {
      return await this.executeQuery({
        query: /* SQL */ `
            UPDATE users
            SET is_archive  = $1,
                archived_at = $2
            WHERE id = $3
              AND is_archive = $4
            RETURNING *
				`,
        parameters: [false, null, id, true],
        omits: ["password"],
      })
        .then((result) => {
          return result.rows.length ? resolve(result.rows[0]) : resolve(null)
        })
        .catch(async (err) => {
          logger.error(err, { service: ModuleName.USER, dest: UserRepository.destination + ":restore" })
          return reject(err)
        })
    })
  }

  public toggleIsBlocked(id: number): Promise<Record<string, any> | null> {
    return new Promise(async (resolve, reject) => {
      return await this.executeQuery({
        query: /* SQL */ `
            UPDATE users
            SET is_blocked = NOT is_blocked
            WHERE id = $1
            RETURNING *
				`,
        parameters: [id],
        omits: ["password"],
      })
        .then((result) => {
          return result.rows.length ? resolve(result.rows[0]) : resolve(null)
        })
        .catch(async (err) => {
          logger.error(err, {
            service: ModuleName.USER,
            dest: UserRepository.destination + ":toggleIsBlocked",
          })
          return reject(err)
        })
    })
  }

  public delete(id: number): Promise<Record<string, any> | null> {
    return new Promise(async (resolve, reject) => {
      return await this.executeQuery({
        query: /* SQL */ `DELETE FROM users WHERE id = $1 RETURNING *`,
        parameters: [id],
        omits: ["password"],
      })
        .then((result) => {
          return result.rows.length ? resolve(result.rows[0]) : resolve(null)
        })
        .catch(async (err) => {
          logger.error(err, { service: ModuleName.USER, dest: UserRepository.destination + ":delete" })
          return reject(err)
        })
    })
  }

  public getExistUser(args: { email: string; password: string }): Promise<Record<string, any> | null> {
    return new Promise(async (resolve, reject) => {
      const { email } = args

      const query = /* SQL */ `SELECT * FROM users WHERE email = $1 AND is_archive = false AND is_blocked = false Limit 1`
      const parameters: (string | number)[] = [email]

      return await this.executeQuery({ query, parameters })
        .then((result) => {
          return result.rows.length ? resolve(result.rows[0]) : resolve(null)
        })
        .catch(async (err) => {
          logger.error(err, { service: ModuleName.USER, dest: UserRepository.destination + ":getExistUser" })
          return reject(err)
        })
    })
  }
}

export default new UserRepository()
