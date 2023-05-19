// ─── MODULES ─────────────────────────────────────────────────────────────────
import logger from "../../../common/helpers/logger.helper"
import mailgunJs from "../../../integrations/mailgun"
import { ModuleName } from "../../../common/enums/general.enum"
import { IDefaultArgs } from "../../../common/interfaces/general.interface"
// import util from "util"

const listOfAdminToResiveEmail = ["development", "localhost"].includes(String(process.env.NODE_ENV))
  ? ["rezasamiei@gmail.com", "kasra.karami.kk@gmail.com"]
  : []

class EmailLogic {
  static destination = __filename.slice(__filename.indexOf("/src") + 1)

  /**
   * @param {IDefaultArgs} args
   * @return {*}  {Promise<void>}
   * @memberof EmailLogic
   * NOTE: Send email to invited user after we created new user with temprory password
   */
  public async inviteNewUser(args: IDefaultArgs): Promise<void> {
    const {
      id,
      reseller_id,
      email,
      // contact_number,
      first_name,
      // surname,
      // gender,
      // business_name,
      // business_category,
      // business_size,
      password,
    } = args

    const reseller_name: string | null = ""
    // if (reseller_id)
    //   await resellerService
    //     .list({ id: reseller_id })
    //     .then((result) => (reseller_name = result.data[0].name))
    //     .catch((error) => {
    //       logger.warn(`Error on sending email:inviteNewUser ${error}`, {
    //         service: ModuleName.EMAIL,
    //         dest: EmailLogic.destination,
    //       })
    //       return
    //     })

    const html = /* HTML */ `
      <p>Dear ${first_name}</p>
      <p>${reseller_name && `<p>You have been invited to join GrillaTEQ by ${reseller_name}.`}</p>
      <p>
        Using GrillaTEQ you can check product details and upload services enquiries directly to your services
        team. Download from the app store here:
      </p>
      <p>We look forward to you joining the channel services community.</p>
      <br />
      <p>
        Temporary Password: ${password}
        <br />
        Email: ${email}
      </p>
      <br />
      <p>Kind regards,</p>
      <br />
      <p>
        ${reseller_name || "GrillaTech"}<br />
        ${reseller_name && `Working with GrillaTech`}
      </p>
    `

    await mailgunJs.message
      .createMessage({
        to: [email, ...listOfAdminToResiveEmail],
        subject: "GrillaTech",
        html,
      })
      .then((response) =>
        logger.info(`Password is sent to new user (${id}) with email (${email})`, {
          service: ModuleName.EMAIL,
          dest: EmailLogic.destination + ":inviteNewUser",
          response,
        })
      )
      .catch((err) =>
        logger.error(err, {
          service: ModuleName.EMAIL,
          dest: EmailLogic.destination + ":inviteNewUser",
        })
      )
  }

  public async inviteNewPortalUser(args: IDefaultArgs): Promise<void> {
    const { id, email, password } = args

    mailgunJs.message
      .createMessage({
        to: [email, ...listOfAdminToResiveEmail],
        subject: "Invite new portal user to GrillaTech",
        html: /* HTML */ `
          <h1>GrillaTech</h1>

          <br />
          <p>Your account created</p>

          <br />
          <p>password: ${password}</p>
          <p>email: ${email}</p>
        `,
      })
      .then((response) =>
        logger.info(`Password is sent to new portal user (${id}) with email (${email})`, {
          service: ModuleName.EMAIL,
          dest: EmailLogic.destination + ":inviteNewPortalUser",
          response,
        })
      )
      .catch((err) =>
        logger.error(err, {
          service: ModuleName.EMAIL,
          dest: EmailLogic.destination + ":inviteNewUser",
        })
      )
  }

  public async inviteNewReseller(args: IDefaultArgs): Promise<void> {
    const { id, email, password } = args

    mailgunJs.message
      .createMessage({
        to: [email, ...listOfAdminToResiveEmail],
        subject: "Invite new reseller to GrillaTech",
        html: /* HTML */ `
          <h1>GrillaTech</h1>

          <br />
          <p>Your account created</p>

          <br />
          <p>password: ${password}</p>
          <p>email: ${email}</p>
        `,
      })
      .then((response) =>
        logger.info(`Password is sent to new user (${id}) with email (${email})`, {
          service: ModuleName.EMAIL,
          dest: EmailLogic.destination + ":inviteNewReseller",
          response,
        })
      )
      .catch((err) =>
        logger.error(err, {
          service: ModuleName.EMAIL,
          dest: EmailLogic.destination + ":inviteNewReseller",
        })
      )
  }

  public async replyFeedback(args: IDefaultArgs): Promise<void> {
    const { email, body } = args

    mailgunJs.message
      .createMessage({
        to: [email, ...listOfAdminToResiveEmail],
        subject: "Grilla Reply Feedback",
        html: /* HTML */ `
          <h1>GrillaTech</h1>

          <br />
          <p>${body}</p>
        `,
      })
      .then((response) =>
        logger.info(`Reply is sent to (${email})`, {
          service: ModuleName.EMAIL,
          dest: EmailLogic.destination + ":replyFeedback",
          response,
        })
      )
      .catch((err) =>
        logger.error(err, {
          service: ModuleName.EMAIL,
          dest: EmailLogic.destination + ":replyFeedback",
        })
      )
  }
}

export default new EmailLogic()
