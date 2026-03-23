/**
 * @description this file contains request validation methods
 */

const { dbConnect } = require("prismaORM/index");
const { scenariosData } = require("prismaORM/services/scenariosService");
const {
  getValidationSchema,
} = require("schemaValidator/supplyPlanning/modelChangeDates/getModelChangeDatesSchema");

/**
 * @description Function to validate input request query params
 * @param {Object} queryParams: API input query params
 * @returns {Array} errorMessages - Validation errors if any
 */
async function validateInput(queryParams) {
  const errorMessages = [];
  /**
   * @description Validate request query params using Joi schema
   * @param {Object} queryParams - request query params
   * @param {Array} errorMessages - array of validation errors
   */
  await validateParams(queryParams, errorMessages);
  /* If Joi input validation was successful, check if scenario exists or not*/
  if (errorMessages.length === 0) {
    /**
     * @description Function to check if a scenario exists
     * @param {Object} params: Input request payload
     */
    await checkForInvalidScenario(queryParams, errorMessages);
  }
  return errorMessages;
}

/**
 * @description Function to validate request params using Joi schema
 * @param {Object} queryParams - request query params
 * @param {Array} errorMessages - array to collect validation errors
 */
async function validateParams(queryParams, errorMessages) {
  // Validation options to collect all error messages
  const options = { abortEarly: false };
  const schema = await getValidationSchema();
  const { error } = await schema.validate(queryParams, options);
  if (error) {
    error.details.forEach((detail) => {
      errorMessages.push(detail.message);
    });
  }
}

/**
 * @description Function to check if a scenario exists
 * @param {Object} params: Input request payload
 */
async function checkForInvalidScenario(queryParams, errorMessages) {
  /* Connecting to DB instance */
  const rdb = await dbConnect();
  const scenariosDataService = new scenariosData(rdb);
  try {
    /**
     * @description Get scenario data by scenarioId
     */
    const scenarioData = await scenariosDataService.getScenarioDataById(
      queryParams.scenarioId
    );
    /* Check if scenario doesn't exist */
    if (!scenarioData || scenarioData.length === 0) {
      errorMessages.push(`ValidationError: Scenario doesn't exist.`);
    }
  } catch (err) {
    console.log("Error in checkForInvalidScenario:", err);
    throw err;
  }
}

module.exports = {
  validateInput,
};
