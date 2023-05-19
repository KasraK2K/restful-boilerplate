import logger from "./logger.helper"

const SERVER_ERROR = "Internal Server Error"

interface IError {
  code: number | string
  message: string
  status: number
}

export const error = (code: string | number): IError => {
  /* -------------------------------------------------------------------------- */
  /*                                   numbers                                  */
  /* -------------------------------------------------------------------------- */
  switch (code) {
    case 0:
      return { code, message: "Something went wrong", status: 500 }

    case 1000:
      return { code, message: "Error Code is not a valid", status: 500 }

    case 1001:
      return { code, message: "Status Code is not a valid", status: 500 }

    case 1002:
      return { code, message: "Custome Error happening", status: 406 }

    case 1003:
      return { code, message: "Too Many Requests", status: 429 }

    case 1004:
      return { code, message: "Error on extending multipart header", status: 400 }

    case 1005:
      return { code, message: "Error on uploading file", status: 400 }

    case 1006:
      return { code, message: "MimeType is not valid", status: 400 }

    case 1007:
      return { code, message: "Upload destination not found", status: 400 }

    case 1008:
      return { code, message: "Upload ID not found", status: 400 }

    case 1009:
      return { code, message: "Uploaded more than max files", status: 400 }

    case 1010:
      return { code, message: "Token invalid", status: 401 }

    case 1011:
      return { code, message: "Token missing", status: 400 }

    case 1012:
      return { code, message: "Api Key missing", status: 400 }

    case 1013:
      return { code, message: "Api Key invalid", status: 401 }

    case 1014:
      return { code, message: "Method not allowed", status: 405 }

    case 1015:
      return { code, message: "Authentication Failed", status: 401 }

    case 1016:
      return { code, message: "Not Found", status: 404 }

    case 1017:
      return { code, message: "Third Party Error", status: 500 }

    case 1018:
      return { code, message: "Organisation code is not available", status: 400 }

    case 1019:
      return { code, message: "Not Acceptable", status: 406 }

    /* -------------------------------------------------------------------------- */
    /*                                   Prisma                                   */
    /* -------------------------------------------------------------------------- */
    case "P2002":
      return { code, message: "Unique constraint failed", status: 400 }

    /* -------------------------------------------------------------------------- */
    /*                                   Strings                                  */
    /* -------------------------------------------------------------------------- */
    case "P2025":
      return { code, message: "Record to update not found", status: 500 }

    case "23505":
      return { code, message: "Unique key is already exist", status: 500 }

    case "42P01":
      return {
        code,
        message: process.env.NODE_ENV !== "production" ? "Database Column Not Found" : SERVER_ERROR,
        status: 500,
      }

    case "42703":
      return {
        code,
        message: process.env.NODE_ENV !== "production" ? "Database Column Not Found" : SERVER_ERROR,
        status: 500,
      }

    case "42804":
      return {
        code,
        message:
          process.env.NODE_ENV !== "production"
            ? "Argument of WHERE must be type boolean, not type character varying"
            : SERVER_ERROR,
        status: 500,
      }

    case "42601":
      return {
        code,
        message: process.env.NODE_ENV !== "production" ? "Query syntax error" : SERVER_ERROR,
        status: 500,
      }

    case "22P02":
      return {
        code,
        message: process.env.NODE_ENV !== "production" ? "Invalid input value for enum" : SERVER_ERROR,
        status: 500,
      }

    case "28P01":
      return {
        code,
        message:
          process.env.NODE_ENV !== "production" ? "Database password authentication failed" : SERVER_ERROR,
        status: 500,
      }

    case "ECONNREFUSED":
      return {
        code,
        message: process.env.NODE_ENV !== "production" ? "Database Connection Refused" : SERVER_ERROR,
        status: 500,
      }

    default:
      logger.warn(`Error code ${code} is not valid`, { dest: "error.helper.ts" })
      return { code, message: "Error Code is not a valid", status: 500 }
  }
}

export default error
