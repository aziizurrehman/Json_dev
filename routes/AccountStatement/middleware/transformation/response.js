const CommonDebugLoggerInstance = require("../../../../common/utils/logger/logger");
const ResAccountStatement = require("../../model/resAccountStatement");

class ClientResponse {
  constructor(commonHeaders) {
    this.logger = CommonDebugLoggerInstance.CommonDebugLogger(
      commonHeaders,
      "Transformation=>response.js"
    );
  }

  //Developer's Responsibility
  getPayloadResponse(headers, result) {
    try {
      this.logger.debug(
        "ClientResponse Payload Params : ",
        headers.xChannelId,
        result
      );
      const res = new ResAccountStatement(result);

      return res;
    } catch (error) {
      throw error
    }
  }
}

module.exports = ClientResponse;
