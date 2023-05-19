// ─── PACKAGES ────────────────────────────────────────────────────────────────
import express from "express"

const router = express.Router()

// ─── MODULES ─────────────────────────────────────────────────────────────────
import controller from "./controller"

router.use(controller.inviteNewUser)
router.use(controller.inviteNewPortalUser)
router.use(controller.inviteNewReseller)
router.use(controller.replyFeedback)

export default router
