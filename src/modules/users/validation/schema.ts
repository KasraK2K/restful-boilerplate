//=============================================================================================
//
//  ##   ##   ####  #####  #####           ####   ####  ##   ##  #####  ###    ###    ###
//  ##   ##  ##     ##     ##  ##         ##     ##     ##   ##  ##     ## #  # ##   ## ##
//  ##   ##   ###   #####  #####           ###   ##     #######  #####  ##  ##  ##  ##   ##
//  ##   ##     ##  ##     ##  ##            ##  ##     ##   ##  ##     ##      ##  #######
//   #####   ####   #####  ##   ##        ####    ####  ##   ##  #####  ##      ##  ##   ##
//
//=============================================================================================

// ─── MODULES ─────────────────────────────────────────────────────────────────
import { Gender } from "../../../common/enums/general.enum"

export const schema = {
  // ─── List ───────────────────────────────────────────────────────────────────────
  list: {
    type: "object",
    additionalProperties: false,
    properties: {
      id: { type: "integer" },
      email: { type: "string", format: "email" },
      is_active: { type: "boolean" },
      is_archive: { type: "boolean", default: false },
    },
  },

  // ─── List With Join ─────────────────────────────────────────────────────────────
  listWithJoin: {
    type: "object",
    additionalProperties: false,
    properties: {
      id: { type: "integer" },
      email: { type: "string", format: "email" },
      type: { type: "string" },
      is_active: { type: "boolean" },
      is_archive: { type: "boolean", default: false },
    },
  },

  // ─── Get One ────────────────────────────────────────────────────────────────────
  profile: {
    type: "object",
    additionalProperties: false,
    oneOf: [
      {
        required: ["id"],
        properties: {
          id: { type: "integer" },
        },
      },
      {
        required: ["email"],
        properties: {
          email: { type: "string", format: "email" },
        },
      },
    ],
  },

  // ─── Create ─────────────────────────────────────────────────────────────────────
  create: {
    type: "object",
    additionalProperties: false,
    required: ["email", "password"],
    properties: {
      email: { type: "string", format: "email" },
      password: { type: "string", minLength: 6, maxLength: 60 },
      contact_number: { type: "string" },
      first_name: { type: "string", minLength: 3, maxLength: 60 },
      surname: { type: "string", minLength: 3, maxLength: 60 },
      gender: { type: "string", enum: Object.values(Gender), default: Gender.OTHER },
      business_name: { type: "string", minLength: 3, maxLength: 60 },
      business_category: { type: "string", minLength: 3, maxLength: 20 },
      permission: { type: "integer", default: 0 },
      reseller_id: { type: "integer", default: 0 },
    },
  },

  // ─── Upsert ─────────────────────────────────────────────────────────────────────
  update: {
    type: "object",
    additionalProperties: false,
    required: ["id"],
    properties: {
      id: { type: "integer" },
      email: { type: "string", format: "email" },
      password: { type: "string", minLength: 6, maxLength: 60 },
      contact_number: { type: "string" },
      first_name: { type: "string", minLength: 3, maxLength: 60 },
      surname: { type: "string", minLength: 3, maxLength: 60 },
      gender: { type: "string", enum: Object.values(Gender), default: Gender.OTHER },
      business_name: { type: "string", minLength: 3, maxLength: 60 },
      business_category: { type: "string", minLength: 3, maxLength: 20 },
      permission: { type: "integer", default: 0 },
      reseller_id: { type: "integer", default: 0 },
      is_active: { type: "boolean" },
      is_verified: { type: "boolean" },
    },
  },

  // ─── Profile Update ─────────────────────────────────────────────────────────────
  profileUpdate: {
    type: "object",
    additionalProperties: false,
    required: ["id"],
    properties: {
      id: { type: "integer" },
      name: { type: "string", minLength: 3, maxLength: 120 },
      email: { type: "string", format: "email" },
      contact_number: { type: "string" },
      business_name: { type: "string", maxLength: 60 },
    },
  },

  // ─── Signup ─────────────────────────────────────────────────────────────────────
  signup: {
    type: "object",
    additionalProperties: false,
    required: ["email", "password"],
    properties: {
      id: { type: "integer" },
      email: { type: "string", format: "email" },
      password: { type: "string", minLength: 6, maxLength: 60 },
      organisation_code: { type: "string" },
      surname: { type: "string" },
      first_name: { type: "string" },
    },
  },

  // ─── inviteNewUser ──────────────────────────────────────────────────────────────
  inviteNewUser: {
    type: "object",
    additionalProperties: false,
    required: ["reseller_id", "email", "first_name", "surname"],
    properties: {
      reseller_id: { type: "integer" },
      email: { type: "string", format: "email" },
      contact_number: { type: "string" },
      first_name: { type: "string", minLength: 3, maxLength: 60 },
      surname: { type: "string", minLength: 3, maxLength: 60 },
      gender: { type: "string", enum: Object.values(Gender), default: Gender.OTHER },
      business_name: { type: "string" },
      business_category: { type: "string" },
      organisation_code: { type: "string" },
    },
  },

  // ─── Id ─────────────────────────────────────────────────────────────────────────
  id: {
    type: "object",
    additionalProperties: false,
    required: ["id"],
    properties: {
      id: { type: "integer" },
    },
  },

  login: {
    type: "object",
    additionalProperties: false,
    required: ["email", "password"],
    properties: {
      email: { type: "string", format: "email" },
      password: { type: "string", minLength: 6, maxLength: 60 },
    },
  },

  socialLogin: {
    type: "object",
    additionalProperties: false,
    required: ["token_id", "kind"],
    properties: {
      kind: { type: "string" },
      token_id: { type: "string" },
      first_name: { type: "string" },
      surname: { type: "string" },
      email: { type: "string" },
    },
  },

  refreshToken: {
    type: "object",
    additionalProperties: false,
    required: ["refresh_token"],
    properties: {
      refresh_token: { type: "string" },
      secret: { type: "string" },
    },
  },

  forgotPassword: {
    type: "object",
    additionalProperties: false,
    required: ["email"],
    properties: {
      email: { type: "string", format: "email" },
    },
  },

  resetPassword: {
    type: "object",
    additionalProperties: false,
    required: ["secret", "password"],
    properties: {
      secret: { type: "string" },
      password: { type: "string", minLength: 6, maxLength: 60 },
    },
  },
}

export default schema
