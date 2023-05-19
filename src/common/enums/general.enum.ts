export enum Gender {
  MALE = "MALE",
  FEMALE = "FEMALE",
  OTHER = "OTHER",
}

export enum ServiceName {
  DEFAULT = "default",
  GENERAL = "general",
  PORTAL_USER = "portal_user",
  USER = "user",
  EMAIL = "email",
  ROLE = "role",
}

export enum TokenType {
  TOKEN,
  REFRESH,
}

export enum TokenMode {
  APP_USER,
  PORTAL_USER,
}

export enum QueueName {
  NEW_USER_QUEUE = "new-user-queue",
  NEW_PORTAL_USER_QUEUE = "new-portal-user-queue",
}
