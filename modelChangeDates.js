/**
 * @description DB operations to fetch model change dates and scenario step status
 */

const { dbConnect } = require("prismaORM/index");
const { modelChangeDateData } = require("prismaORM/services/modelChangeDateService");
const { getScenarioStepStatusData } = require("utils/scenario_step_status_utils");

/**
 * @description Function to fetch model change dates and scenario steps status details
 * @param {*} scenarioId - scenarioId from input
 * @param {*} userEmail - userEmail from input
 * @returns {Object}  - modelChangeDatesData, scenarioStepStatusData
 */
async function getModelChangeDatesNScenarioStepData(scenarioId, userEmail) {
  const rdb = await dbConnect();
  const modelChangeDatesService = new modelChangeDateData(rdb);
  try {
    /**
     * @description Fetch model change dates data by scenarioId
     */
    const modelChangeDatesData =
      await modelChangeDatesService.getModelChangeDatesByScenarioId(scenarioId);
    /**
     * @description Fetch scenario steps data by scenarioId
     * @returns {Object} scenarioStepStatusData - scenario steps data returned by shared utility
     */
    const scenarioStepStatusData = await getScenarioStepStatusData(
      scenarioId,
      userEmail,
      rdb
    );
    return { modelChangeDatesData, scenarioStepStatusData };
  } catch (err) {
    console.log("Error in getModelChangeDatesNScenarioStepData:", err);
    throw err;
  }
}

module.exports = {
  getModelChangeDatesNScenarioStepData,
};
