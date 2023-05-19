//================================================================================================================
//
//  #####   ###    ###   ####         #####   ####   #####    ####  ##    ##   ####  ######  #####  ###    ###
//  ##  ##  ## #  # ##  #    #        ##     ##     ##   ##  ##      ##  ##   ##       ##    ##     ## #  # ##
//  #####   ##  ##  ##     ##         #####  ##     ##   ##   ###     ####     ###     ##    #####  ##  ##  ##
//  ##      ##      ##   ##           ##     ##     ##   ##     ##     ##        ##    ##    ##     ##      ##
//  ##      ##      ##  ######        #####   ####   #####   ####      ##     ####     ##    #####  ##      ##
//
//================================================================================================================

// NOTE: To run typescript file install this `pm2 install typescript`
module.exports = {
  apps: [
    {
      name: process.env.NODE_ENV === "development" ? "api.apppair_dev" : "api.apppair_prod",
      log_date_format: "YYYY-MM-DD HH:mm Z",
      script: process.env.NODE_ENV === "development" ? "src/server.ts" : "build/src/server.js",
      autorestart: true,
      watch: process.env.NODE_ENV === "development",
      // ignore_watch: ["node_modules", "logs", "public", "tmp"],
      time: true,
      instance_var: "apppair_api",
      instances: process.env.NODE_ENV === "development" ? "1" : "max",
      // exec_mode: process.env.NODE_ENV === "development" ? "fork" : "cluster",
      exec_mode: "cluster",

      // default variables
      env: {
        IS_ON_SERVER: true,
      },

      // development environment
      env_development: {
        NODE_ENV: "development",
        JWT_SECRET: "QiOjObFkrNmV4FhObFk0SmxkQ0N3UDMTmlNalZ1V",
        ENCRYPTION_SECRET:
          "jVuTFhObFk0SmxkQzFyWlhrNmlNalZ1VEZoT2JGazBTbXhrUXpGeVdsaHJObVa3JObVY0c0luUlNqRmpNbF",
        API_KEY: "hRaU9qT2JGa3JObVY0c0RUwK6elovHOKema381GrHqU1oF261Q01TXg7XbtFs6Qw",
        PORT: "6100",
      },

      // production environment
      env_production: {
        NODE_ENV: "production",
        JWT_SECRET: "QiOjObFkrNmV4FhObFk0SmxkQ0N3UDMTmlNalZ1V",
        ENCRYPTION_SECRET:
          "jVuTFhObFk0SmxkQzFyWlhrNmlNalZ1VEZoT2JGazBTbXhrUXpGeVdsaHJObVa3JObVY0c0luUlNqRmpNbF",
        API_KEY: "hRaU9qT2JGa3JObVY0c0RUwK6elovHOKema381GrHqU1oF261Q01TXg7XbtFs6Qw",
        PORT: "6101",
      },
    },
  ],
}
