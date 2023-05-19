// ─── PACKAGES ────────────────────────────────────────────────────────────────
import { Request, Response } from "express"

// ─── MODULES ─────────────────────────────────────────────────────────────────
import Controller from "../../base/Controller"
import service from "./service"

class PortalUserController extends Controller {
  /**
   * Get all portal_users
   */
  public async list(req: Request, res: Response): Promise<void> {
    await super.handle(service.list, req.body, req, res)
  }

  /**
   * Get current portal_user by token.id in res.locals.tokenData.id
   */
  public async profile(req: Request, res: Response): Promise<void> {
    const { id } = res.locals.tokenData
    await super.handle(service.profile, id, req, res)
  }

  /**
   * Create new portal_user if req.body.id not found or Update existing portal_user if found req.body.id
   */
  public async upsert(req: Request, res: Response): Promise<void> {
    await super.handle(service.upsert, req.body, req, res)
  }

  /**
   * Create new portal user with a random password and send that to his email.
   */
  public async inviteNewPortalUser(req: Request, res: Response): Promise<void> {
    const tokenData = res.locals.tokenData
    const payload = { ...req.body, token_reseller_id: tokenData.reseller_id }
    await super.handle(service.inviteNewPortalUser, payload, req, res)
  }

  /**
   * Archive portal_user and set is_archive = true and archived_at = NOW()
   */
  public async archive(req: Request, res: Response): Promise<void> {
    const { id } = req.body
    await super.handle(service.archive, id, req, res)
  }

  /**
   * Restore portal_user and set is_archive = false and archived_at = null
   */
  public async restore(req: Request, res: Response): Promise<void> {
    const { id } = req.body
    await super.handle(service.restore, id, req, res)
  }

  /**
   * toggleIsAdmin portal_user is_admin
   */
  public async toggleIsAdmin(req: Request, res: Response): Promise<void> {
    const { id } = req.body
    await super.handle(service.toggleIsAdmin, id, req, res)
  }

  /**
   * Permanently delete portal_user
   */
  public async delete(req: Request, res: Response): Promise<void> {
    const args = req.body.id
    await super.handle(service.delete, args, req, res)
  }

  public async login(req: Request, res: Response): Promise<void> {
    const { email, password, reseller_id } = req.body
    await super.handle(service.login, { email, password, reseller_id }, req, res)
  }

  /**
   * Refresh token if secret is valid
   * You should send valid token by type refresh and secret that created using
   * crypto-js encoded string `${portal_user.id}--${portal_user.email}`
   */
  public async refreshToken(req: Request, res: Response): Promise<void> {
    const { refresh_token, secret } = req.body
    await super.handle(service.login, { refresh_token, secret }, req, res)
  }

  /**
   * Forgot password send email to portal_user that contain change password link
   */
  public async forgotPassword(req: Request, res: Response): Promise<void> {
    const { email } = req.body
    await super.handle(service.forgotPassword, email, req, res)
  }

  /**
   * Reset password get secret and new password
   * Secret should created by forgot password and frontend get and send it to me
   * Secret is crypto-js encoded string `${portal_user.id}--${portal_user.email}`
   */
  public async resetPassword(req: Request, res: Response): Promise<void> {
    const { secret, password } = req.body
    await super.handle(service.resetPassword, { secret, password }, req, res)
  }
}

export default new PortalUserController()
