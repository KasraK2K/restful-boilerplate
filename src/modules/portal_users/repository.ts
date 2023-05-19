// ─── MODULES ─────────────────────────────────────────────────────────────────
import Repository from "../../base/repository/Repository"
import logger from "../../common/helpers/logger.helper"
import { IDefaultArgs } from "../../common/interfaces/general.interface"
import { ServiceName } from "../../common/enums/general.enum"
import { IPortalUserListArgs } from "./constant/interface"

class PortalUserRepository extends Repository {
  static destination = __filename.slice(__filename.indexOf("/src") + 1)

  public list(args: IPortalUserListArgs = {}): Promise<Record<string, any>[]> {
    return new Promise(async (resolve, reject) => {
      const whereQueries: string[] = []

      "id" in args && whereQueries.push(`u.id = ${args.id}`)
      "email" in args && whereQueries.push(`u.email = '${args.email}'`)
      "reseller_id" in args && whereQueries.push(`u.reseller_id = ${args.reseller_id}`)

      const query = /* SQL */ `
        SELECT 
          u.id, u.email, u.contact_number, u.first_name, u.surname,
          u.gender, u.is_active, u.is_admin, u.is_archive,
          u.business_name, u.business_category, u.business_size, 
          u.role_id , u.reseller_id , u.created_at , u.updated_at , u.archived_at,
          r.name as reseller_name
        FROM portal_users u
        LEFT JOIN resellers r ON u.reseller_id = r.id 
        ${whereQueries.length ? `WHERE ${whereQueries.join(" AND ")}` : ""}
        ORDER BY u.id DESC
      `

      return await this.executeQuery({ query })
        .then((result) => {
          return result.rows.length ? resolve(result.rows) : resolve([])
        })
        .catch(async (err) => {
          logger.error(err, {
            service: ServiceName.PORTAL_USER,
            dest: PortalUserRepository.destination + ":list",
          })
          return reject(err)
        })

      // return await this.select()
      //   .from("portal_users")
      //   .where(args)
      //   .orderBy("id", "ASC")
      //   .exec({ omits: ["password"] })
      //   .then((result) => {
      //     console.log({result});
      //     resolve(result)})
      //   .catch(async (err) => {
      //     logger.error(err, {
      //       service: ServiceName.PORTAL_USER,
      //       dest: PortalUserRepository.destination + ":list",
      //     })
      //     return reject(err)
      //   })
    })
  }

  public profile(id: number): Promise<Record<string, any>> {
    return new Promise(async (resolve, reject) => {
      return await this.select()
        .from("portal_users")
        .where([`id = '${id}'`])
        .exec({ omits: ["password"] })
        .then((result) => {
          return result.length ? resolve(result[0]) : resolve({})
        })
        .catch(async (err) => {
          logger.error(err, {
            service: ServiceName.PORTAL_USER,
            dest: PortalUserRepository.destination + ":profile",
          })
          return reject(err)
        })
    })
  }

  public upsert(args: IDefaultArgs = {}): Promise<Record<string, any> | null> {
    return new Promise(async (resolve, reject) => {
      if ("email" in args) args.email = args.email.toLocaleLowerCase()

      return await this.upsert_query("portal_users", args)
        .exec({ omits: ["password"] })
        .then((result) => {
          return result.length ? resolve(result[0]) : resolve(null)
        })
        .catch(async (err) => {
          logger.error(err, {
            service: ServiceName.PORTAL_USER,
            dest: PortalUserRepository.destination + ":upsert",
          })
          return reject(err)
        })
    })
  }

  public archive(id: number): Promise<Record<string, any> | null> {
    return new Promise(async (resolve, reject) => {
      return await this.executeQuery({
        query: /* SQL */ `
            UPDATE portal_users
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
          logger.error(err, {
            service: ServiceName.PORTAL_USER,
            dest: PortalUserRepository.destination + ":archive",
          })
          return reject(err)
        })
    })
  }

  public restore(id: number): Promise<Record<string, any> | null> {
    return new Promise(async (resolve, reject) => {
      return await this.executeQuery({
        query: /* SQL */ `
            UPDATE portal_users
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
          logger.error(err, {
            service: ServiceName.PORTAL_USER,
            dest: PortalUserRepository.destination + ":restore",
          })
          return reject(err)
        })
    })
  }

  public toggleIsAdmin(id: number): Promise<Record<string, any> | null> {
    return new Promise(async (resolve, reject) => {
      return await this.executeQuery({
        query: /* SQL */ `
            UPDATE portal_users
            SET is_admin = NOT is_admin
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
            service: ServiceName.PORTAL_USER,
            dest: PortalUserRepository.destination + ":toggleIsAdmin",
          })
          return reject(err)
        })
    })
  }

  public delete(id: number): Promise<Record<string, any> | null> {
    return new Promise(async (resolve, reject) => {
      return await this.executeQuery({
        query: /* SQL */ `DELETE FROM portal_users WHERE id = $1 RETURNING *`,
        parameters: [id],
        omits: ["password"],
      })
        .then((result) => {
          return result.rows.length ? resolve(result.rows[0]) : resolve(null)
        })
        .catch(async (err) => {
          logger.error(err, {
            service: ServiceName.PORTAL_USER,
            dest: PortalUserRepository.destination + ":delete",
          })
          return reject(err)
        })
    })
  }

  public getExistPortalUser(args: {
    email: string
    password: string
    reseller_id?: number
  }): Promise<Record<string, any> | null> {
    return new Promise(async (resolve, reject) => {
      const { email, reseller_id } = args

      let query = /* SQL */ `SELECT * FROM portal_users WHERE email = $1 AND is_archive = false AND is_active = true`
      const parameters: (string | number)[] = [email]
      if (reseller_id) {
        query += " AND reseller_id = $2"
        parameters.push(reseller_id)
      }
      query += " Limit 1"

      return await this.executeQuery({ query, parameters })
        .then((result) => {
          return result.rows.length ? resolve(result.rows[0]) : resolve(null)
        })
        .catch(async (err) => {
          logger.error(err, {
            service: ServiceName.PORTAL_USER,
            dest: PortalUserRepository.destination + ":getExistPortalUser",
          })
          return reject(err)
        })
    })
  }
}

export default new PortalUserRepository()
