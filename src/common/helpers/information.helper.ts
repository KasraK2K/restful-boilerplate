//=======================================================================================================================================================
//
//   ####  #####  #####    ##   ##  #####  #####          ##  ##     ##  #####   #####   #####    ###    ###    ###    ######  ##   #####   ##     ##
//  ##     ##     ##  ##   ##   ##  ##     ##  ##         ##  ####   ##  ##     ##   ##  ##  ##   ## #  # ##   ## ##     ##    ##  ##   ##  ####   ##
//   ###   #####  #####    ##   ##  #####  #####          ##  ##  ## ##  #####  ##   ##  #####    ##  ##  ##  ##   ##    ##    ##  ##   ##  ##  ## ##
//     ##  ##     ##  ##    ## ##   ##     ##  ##         ##  ##    ###  ##     ##   ##  ##  ##   ##      ##  #######    ##    ##  ##   ##  ##    ###
//  ####   #####  ##   ##    ###    #####  ##   ##        ##  ##     ##  ##      #####   ##   ##  ##      ##  ##   ##    ##    ##   #####   ##     ##
//
//=======================================================================================================================================================

import os from "os"
import config from "config"
import { IApplicationConfig } from "../../../config/config.interface"
import tokenHelper from "./token.helper"

const appConfig: IApplicationConfig = config.get("application")

export const getUserInformation = (port: number) => {
  if (appConfig.information) {
    console.group("Server Information:")
    console.table([
      {
        Port: port,
        NODE_ENV: process.env.NODE_ENV,
        Platform: os.platform(),
        "CPU Model": os.cpus()[0].model,
        Arch: os.arch(),
      },
    ])
    console.groupEnd()
    // CPU/Ram Information
    console.group("\nCPU/Ram Information:")
    console.table([
      {
        "CPU Count": os.cpus().length,
        "CPU Speed": os.cpus()[0].speed,
        "Total Memory": os.totalmem(),
        "Free Memory": os.freemem(),
        "Used Memory": os.totalmem() - os.freemem(),
      },
    ])
    console.groupEnd()
    // Node Information
    console.group("\nNode Information:")
    console.table([
      {
        "Node PID": process.pid,
        "Node CPU Usage": process.cpuUsage(),
        "Node Version": process.version,
        "Node Exec Path": process.execPath,
      },
    ])
    console.groupEnd()

    const payload = { id: 1 }
    const cypherToken = tokenHelper.sign(payload)

    console.log("\n- Cypher Token ----------------------------------------------------------")
    console.info(cypherToken)

    console.log("\n- Api Key ---------------------------------------------------------------")
    console.info(process.env.API_KEY, "\n")
  }
}
