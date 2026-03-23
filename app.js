/**
 * @name model-change-dates
 * @description Returns scenario model change dates by scenarioId
 * @createdOn Mar 5th, 2026
 * @author Priyadarshini Gangone
 * @modifiedBy
 * @modifiedOn
 * @modificationSummary
 */

const {
  sendResponse,
  BadRequest,
  HTTP_RESPONSE_CODES,
} = require("utils/api_response_utils");
const { getModelChangeDates } = require("./modelChangeDatesService");
const { API_ERROR_MESSAGE } = require("constants/customConstants");

/**
 * @description Lambda handler for model change dates API.
 * @param {Object} event: API event with query params:
    {
    "scenarioId": "uniqueScenarioId"
    "userEmail": "userEmail"
    }
 * @returns {Object}: response sample is detailed below.
 *
 * Success response with status code 200:
 * {
   "scenarioId": "uniqueScenarioId",
   "data": [
      {
        "subSeries": "RAV4",
        "subRows": [
          {
            "modelYear": "MY 25",
            "startProdDate": "2025-01-01",
            "endProdDate": "2025-12-30"
          }
        ]
      }
    ],
    "scenarioSteps": { 
    "Line Level Input": {
      "Model Change Dates": "COMPLETED",
      "NAMC Allocation Plan": "COMPLETED",
      "NAMC Production Calendar": "COMPLETED"
    },
    "Vanning Center Inputs": {
      "Shipping Pattern": "COMPLETED",
      "Vanning Lead Time": "COMPLETED",
      "TMC Working Day Calendar": "COMPLETED"
    },
    "Grouping Settings": {
      "Grouping": "COMPLETED",
      "Min Max Stock": "IN PROGRESS",
      "Fluctuation Allowance": "NOT STARTED"
    },
    "other": [
      "Simulation",
      "Review",
      "Reports"
    ]
   } 
  }
 * In-valid input error with status 400:
  {
    "errorMessage": [<"ValidationError: validation error message">]
  }
 * Internal server error with status code 500:
  {
    "errorMessage": "Internal Server Error"
  }
 */
exports.handler = async (event) => {
  try {
    /**
     * @description Function to validate input and fetch model change dates response.
     * @param {Object} event: Input parameters
     * @returns {Object} modelChangeDatesData - model change dates details
     */
    const modelChangeDatesData = await getModelChangeDates(event);
    console.log("response:", modelChangeDatesData);
    return sendResponse(HTTP_RESPONSE_CODES.SUCCESS, modelChangeDatesData);
  } catch (err) {
    console.log("Handler Error:", err);
    let errorMessage = API_ERROR_MESSAGE.INTERNAL_SERVER_ERROR;
    let statusCode = HTTP_RESPONSE_CODES.INTERNAL_SERVER_ERROR;
    /**
     * @description If error is BadRequest, return 400 with validation messages
     */
    if (err instanceof BadRequest) {
      statusCode = HTTP_RESPONSE_CODES.BAD_REQUEST;
      errorMessage = err.message
        .split(/,(?=ValidationError:)/)
        .map((e) => e.trim());
      console.log("Validation error messages: ", errorMessage);
    }
    return sendResponse(statusCode, { errorMessage: errorMessage });
  }
};
