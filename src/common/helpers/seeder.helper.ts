// ─── PACKAGES ────────────────────────────────────────────────────────────────
import PgRepository from "../../base/repository/PgRepository"

// ─── MODULES ─────────────────────────────────────────────────────────────────
import { SAMPLE_SEED } from "../constants/seed/sample"
import logger from "../helpers/logger.helper"

class Seeder extends PgRepository {
  public async resellerCount() {
    this.totalCount("sample", ["ID = 0"])
      .then(async (count) => count === 0 && (await this.insert("sample", SAMPLE_SEED).exec()))
      .catch((err) => logger.error(`Error on create reseller 0 ${err}`, { dest: "seeder.helper.ts" }))
  }
}

export default new Seeder()
