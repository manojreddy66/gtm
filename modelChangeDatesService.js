/**
 * @description this file contains model change dates service methods
 */

const { validateInput } = require("./validateRequest");
const { prepareResponse } = require("./utils");
const { getModelChangeDatesNScenarioStepData } = require("./modelChangeDates");
const { BadRequest } = require("utils/api_response_utils");

/**
 * @description Function to validate input request, fetch data from DB and prepare final response
 * @param {Object} event - Lambda event object
 * @returns {Object} formatted response object
 */
async function getModelChangeDates(event) {
  try {
    const queryParams = event?.queryStringParameters || {};
    console.log("queryParams:", queryParams);
    /**
     * @description Validate request query params
     * @param {Object} queryParams - request query params
     * @returns {Object} response object containing validation errors if any
     */
    const errorMessages = await validateInput(queryParams);
    if (errorMessages.length > 0) {
      throw new BadRequest(errorMessages);
    }

    /**
     * @description Fetch scenario validation, model change dates data and scenario steps data
     * @param {String} queryParams.scenarioId - scenario id
     * @param {String} queryParams.userEmail - user email
     */
    const { modelChangeDatesData, scenarioStepStatusData } =
      await getModelChangeDatesNScenarioStepData(
        queryParams.scenarioId,
        queryParams.userEmail
      );

    /**
     * @description Prepare and return response
     * @returns {Object} formatted response containing scenarioId, model change dates data grouped by subSeries and scenario steps
     */
    return prepareResponse(
      queryParams.scenarioId,
      modelChangeDatesData,
      scenarioStepStatusData
    );
  } catch (err) {
    console.log("Error in getModelChangeDates:", err);
    throw err;
  }
}

module.exports = {
  getModelChangeDates,
};
