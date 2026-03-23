const { BaseService } = require("./BaseService");
const { Prisma } = require("@prisma/client");

class modelChangeDateData extends BaseService {
  constructor(db) {
    super(db);
  }

  /**
   * @description Function to fetch model change dates by scenarioId
   * @param {String} scenarioId - scenario id
   * @returns {Array} model change dates rows
   */
  async getModelChangeDatesByScenarioId(scenarioId) {
    try {
      return await this.prisma.$queryRaw`
        select
          sub_series_description       as "subSeries",
          model_year       as "modelYear",
          start_prod_date  as "startProdDate",
          end_prod_date    as "endProdDate"
        from supply_planning.model_change_date
        where scenario_id = ${scenarioId}::uuid
        order by sub_series_description, model_year;
      `;
    } catch (err) {
      console.log("Error in getModelChangeDatesByScenarioId:", err);
      throw err;
    }
  }

  /**
   * @description Function to upsert model change dates for a scenario
   * @param {String} scenarioId - scenario id
   * @param {String} userEmail - user email
   * @param {Array} input - [{ modelYear, subSeries, startProdDate, endProdDate }]
   */
  async upsertModelChangeDates(scenarioId, userEmail, input, tx = this.prisma) {
    try {
      return await tx.$executeRaw`
        INSERT INTO supply_planning.model_change_date (
          scenario_id,
          model_year,
          sub_series_description,
          start_prod_date,
          end_prod_date,
          created_by,
          updated_by,
          last_updated_timestamp
        )
        SELECT
          ${scenarioId}::uuid AS scenario_id,
          v.model_year,
          v.sub_series_description,
          v.start_prod_date,
          v.end_prod_date,
          ${userEmail}::text AS created_by,
          ${userEmail}::text AS updated_by,
          NOW() AS last_updated_timestamp
        FROM (
          VALUES
          ${Prisma.join(
            input.map(
              (item) => Prisma.sql`(
                ${item.modelYear}::text,
                ${item.subSeries}::text,
                ${item.startProdDate}::date,
                ${item.endProdDate}::date
              )`
            )
          )}
        ) AS v(model_year, sub_series_description, start_prod_date, end_prod_date)
        ON CONFLICT (scenario_id, model_year, sub_series_description)
        DO UPDATE SET
          start_prod_date = EXCLUDED.start_prod_date,
          end_prod_date = EXCLUDED.end_prod_date,
          updated_by = ${userEmail}::text,
          last_updated_timestamp = NOW()
      `;
    } catch (err) {
      console.log("Error in upsertModelChangeDates:", err);
      throw err;
    }
  }
}

module.exports.modelChangeDateData = modelChangeDateData;
