// ─── MODULES ─────────────────────────────────────────────────────────────────
import Controller from "../../base/Controller"
import service from "./service"

/**
 * This Domain no need to connect module because we use it just as a BullMQ Worker
 */
class EmailController extends Controller {
  /**
   * Send email to new invited user
   */
  public async inviteNewUser(): Promise<void> {
    await service.inviteNewUser()
  }

  /**
   * Send email to new invited portal user
   */
  public async inviteNewPortalUser(): Promise<void> {
    await service.inviteNewPortalUser()
  }

  /**
   * Send email to new invited reseller
   */
  public async inviteNewReseller(): Promise<void> {
    await service.inviteNewReseller()
  }

  /**
   * Send email as reply feedback
   */
  public async replyFeedback(): Promise<void> {
    await service.replyFeedback()
  }
}

export default new EmailController()
