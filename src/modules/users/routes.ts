// ─── PACKAGES ────────────────────────────────────────────────────────────────
import express from "express"

const router = express.Router()

// ─── MODULES ─────────────────────────────────────────────────────────────────
import controller from "./controller"

router.post("/list", controller.list)
router.post("/full-list", controller.fullList)
router.post("/profile", controller.profile)
router.post("/upsert", controller.upsert)
router.post("/profile-update", controller.profileUpdate)
router.post("/invite-new-user", controller.inviteNewUser)
router.post("/archive", controller.archive)
router.post("/restore", controller.restore)
router.post("/toggle-block", controller.toggleIsBlocked)
router.post("/delete", controller.delete)

router.post("/auth/login", controller.login)
router.post("/auth/signup", controller.signup)
router.post("/auth/social/login", controller.socialLogin)
router.post("/auth/refresh-token", controller.refreshToken)
router.post("/auth/forgot-password", controller.forgotPassword)
router.post("/auth/reset-password", controller.resetPassword)

export default router
