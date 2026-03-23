/**
 * @description this file contains model change dates common utils
 */
const { formatDate } = require("utils/common_utils");
/**
 * @description Function to prepare model change dates response
 * @param {String} scenarioId - scenarioId from input
 * @param {Array} modelChangeDatesData - model change dates details
 * @param {Object} scenarioStepStatusData - scenario step status details
 * @returns {Object} response - Formatted response
 */
function prepareResponse(
  scenarioId,
  modelChangeDatesData,
  scenarioStepStatusData
) {
  return {
    scenarioId,
    data: formatModelChangeDetails(modelChangeDatesData),
    scenarioSteps: scenarioStepStatusData,
  };
}

/**
 *@description: Function to format model change dates data
 */
function formatModelChangeDetails(modelChangeDatesData) {
  /**
   * @description Group model change dates by subSeries
   */
  const dataBySubseries = {};
  const dateFormat = "YYYY-MM-DD";
  /**
   * @description Convert flat records into dataBySubseries by subSeries
   * @param {Array} modelChangeDatesData - model change dates records fetched from DB
   * @returns {Object} dataBySubseries - Grouped data by subSeries
   */
  modelChangeDatesData.forEach((item) => {
    if (!dataBySubseries[item.subSeries]) {
      dataBySubseries[item.subSeries] = [];
    }
    dataBySubseries[item.subSeries].push({
      modelYear: item.modelYear,
      startProdDate: formatDate(item.startProdDate, dateFormat),
      endProdDate: formatDate(item.endProdDate, dateFormat),
    });
  });

  /**
   * @description Convert grouped object into response array format
   * @param {Object} dataBySubseries - model change dates data grouped by subSeries
   * @returns {Array} formatted model change dates data array grouped by subSeries
   */
  return Object.keys(dataBySubseries).map((subSeries) => ({
    subSeries,
    subRows: dataBySubseries[subSeries],
  }));
}

module.exports = {
  prepareResponse,
};
