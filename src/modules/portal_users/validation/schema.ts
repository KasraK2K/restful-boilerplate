//======================================================================================================================================================
//
//  #####    #####   #####    ######    ###    ##            ##   ##   ####  #####  #####           ####   ####  ##   ##  #####  ###    ###    ###
//  ##  ##  ##   ##  ##  ##     ##     ## ##   ##            ##   ##  ##     ##     ##  ##         ##     ##     ##   ##  ##     ## #  # ##   ## ##
//  #####   ##   ##  #####      ##    ##   ##  ##            ##   ##   ###   #####  #####           ###   ##     #######  #####  ##  ##  ##  ##   ##
//  ##      ##   ##  ##  ##     ##    #######  ##            ##   ##     ##  ##     ##  ##            ##  ##     ##   ##  ##     ##      ##  #######
//  ##       #####   ##   ##    ##    ##   ##  ######         #####   ####   #####  ##   ##        ####    ####  ##   ##  #####  ##      ##  ##   ##
//
//======================================================================================================================================================

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
      reseller_id: { type: "integer" },
      role_id: { type: "integer" },
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
    required: ["email", "password", "role_id"],
    properties: {
      email: { type: "string", format: "email" },
      password: { type: "string", minLength: 6, maxLength: 60 },
      contact_number: { type: "string" },
      first_name: { type: "string", minLength: 3, maxLength: 60 },
      surname: { type: "string", minLength: 3, maxLength: 60 },
      gender: { type: "string", enum: Object.values(Gender), default: Gender.OTHER },
      business_name: { type: "string", minLength: 3, maxLength: 60 },
      business_category: { type: "string", minLength: 3, maxLength: 20 },
      role_id: { type: "integer", default: 0 },
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
      gender: { type: "string", enum: Object.values(Gender) },
      business_name: { type: "string", minLength: 3, maxLength: 60 },
      business_category: { type: "string", minLength: 3, maxLength: 20 },
      role_id: { type: "integer" },
      reseller_id: { type: "integer" },
      is_active: { type: "boolean" },
    },
  },

  // ─── inviteNewPortalUser ────────────────────────────────────────────────────────
  inviteNewPortalUser: {
    type: "object",
    additionalProperties: false,
    required: ["email", "first_name", "surname", "reseller_id", "role_id"],
    properties: {
      email: { type: "string", format: "email" },
      contact_number: { type: "string" },
      first_name: { type: "string", minLength: 3, maxLength: 60 },
      surname: { type: "string", minLength: 3, maxLength: 60 },
      gender: { type: "string", enum: Object.values(Gender), default: Gender.OTHER },
      business_name: { type: "string" },
      business_category: { type: "string" },
      reseller_id: { type: "integer" },
      role_id: { type: "integer" },
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
      reseller_id: { type: "integer" },
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
