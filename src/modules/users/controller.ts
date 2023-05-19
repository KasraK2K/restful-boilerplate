// ─── PACKAGES ────────────────────────────────────────────────────────────────
import { Request, Response } from "express"

// ─── MODULES ─────────────────────────────────────────────────────────────────
import Controller from "../../base/Controller"
import service from "./service"

class UserController extends Controller {
  /**
   * Get all users
   */
  public async list(req: Request, res: Response): Promise<void> {
    await super.handle(service.list, req.body, req, res)
  }

  /**
   * Get all users with full data
   */
  public async fullList(req: Request, res: Response): Promise<void> {
    const tokenData = res.locals.tokenData
    const payload = { body: req.body, tokenData }
    await super.handle(service.fullList, payload, req, res)
  }

  /**
   * Get current user by token.id in res.locals.tokenData.id
   */
  public async profile(req: Request, res: Response): Promise<void> {
    const { id } = res.locals.tokenData
    await super.handle(service.profile, id, req, res)
  }

  /**
   * Create new user if req.body.id not found or Update existing user if found req.body.id
   */
  public async upsert(req: Request, res: Response): Promise<void> {
    await super.handle(service.upsert, req.body, req, res)
  }

  /**
   * Update existing user and recognise user by using `Token`
   */
  public async profileUpdate(req: Request, res: Response): Promise<void> {
    const { id } = res.locals.tokenData
    const payload = { ...req.body, id }
    await super.handle(service.profileUpdate, payload, req, res)
  }

  /**
   * Create new user with a random password and send that to his email.
   */
  public async inviteNewUser(req: Request, res: Response): Promise<void> {
    const tokenData = res.locals.tokenData
    const payload = { ...req.body, reseller_id: tokenData.reseller_id }
    await super.handle(service.inviteNewUser, payload, req, res)
  }

  /**
   * Archive user and set is_archive = true and archived_at = NOW()
   */
  public async archive(req: Request, res: Response): Promise<void> {
    const { id } = req.body
    await super.handle(service.archive, id, req, res)
  }

  /**
   * Restore user and set is_archive = false and archived_at = null
   */
  public async restore(req: Request, res: Response): Promise<void> {
    const { id } = req.body
    await super.handle(service.restore, id, req, res)
  }

  /**
   * toggleIsBlocked user is_blocked
   */
  public async toggleIsBlocked(req: Request, res: Response): Promise<void> {
    const { id } = req.body
    await super.handle(service.toggleIsBlocked, id, req, res)
  }

  /**
   * Permanently delete user
   */
  public async delete(req: Request, res: Response): Promise<void> {
    const args = req.body.id
    await super.handle(service.delete, args, req, res)
  }

  public async login(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body
    await super.handle(service.login, { email, password }, req, res)
  }

  public async socialLogin(req: Request, res: Response): Promise<void> {
    await super.handle(service.socialLogin, req.body, req, res)
  }

  /**
   * Refresh token if secret is valid
   * You should send valid token by type refresh and secret that created using
   * crypto-js encoded string `${user.id}--${user.email}`
   */
  public async refreshToken(req: Request, res: Response): Promise<void> {
    const { refresh_token, secret } = req.body
    await super.handle(service.login, { refresh_token, secret }, req, res)
  }

  /**
   * Forgot password send email to user that contain change password link
   */
  public async forgotPassword(req: Request, res: Response): Promise<void> {
    const { email } = req.body
    await super.handle(service.forgotPassword, email, req, res)
  }

  /**
   * Reset password get secret and new password
   * Secret should created by forgot password and frontend get and send it to me
   * Secret is crypto-js encoded string `${user.id}--${user.email}`
   */
  public async resetPassword(req: Request, res: Response): Promise<void> {
    const { secret, password } = req.body
    await super.handle(service.resetPassword, { secret, password }, req, res)
  }

  public async signup(req: Request, res: Response): Promise<void> {
    await super.handle(service.signup, req.body, req, res)
  }
}

export default new UserController()
