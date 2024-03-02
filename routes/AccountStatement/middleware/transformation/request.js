const CommonDebugLoggerInstance = require("../../../../common/utils/logger/logger");
const config = require("config");
const ChannelCodes = require("../../../../common/resources/channel_codes.json");

class ClientRequest {
  constructor(commonHeaders) {
    this.commonHeaders = commonHeaders;
    this.logger = CommonDebugLoggerInstance.CommonDebugLogger(
      commonHeaders,
      "request.js"
    );
    this.logger.debug({
      method: "ClientRequest Constructor",
      message: "ClientRequest Object Requested",
    });
  }

  // For get method developers should change this method accordingly.

  getPayloadRequest(data) {
    try {
      let channelId = null;
      let method = config.get("api.v1.accountStatement.method");
      let url = config.get("api.v1.accountStatement.url");
      let queryString = null;
      let finalFromdate = "";
      let finalToDate = "";

      const isChannelAllowed = ChannelCodes.allowedChannelCodes.find(
        (channel) => channel.hasOwnProperty(data.headers.xChannelId)
      );
      

      if (isChannelAllowed) {
        channelId = isChannelAllowed[data.headers.xChannelId];
      } else {
        throw new Error("isChannelAllowed is undefined");
      }

      if (data.body.fromDate && data.body.toDate) {
        var fromDate = data.body.fromDate.split(/\-/);
        finalFromdate = [fromDate[2], fromDate[1], fromDate[0]].join("");

        var toDate = data.body.toDate.split(/\-/);
        finalToDate = [toDate[2], toDate[1], toDate[0]].join("");
      }

      let paramObj = {
        reqType: config.get("api.v1.accountStatement.reqType"),
        accountNum: data.body.accountNumber,
        reqUid: data.headers.xReqId,
        channel: channelId,
        userId: config.get("api.v1.accountStatement.userId"),
        startDate: finalFromdate,
        endDate: finalToDate,
      };

      if (method == "GET") {
        queryString = Object.entries(paramObj)
          .map(
            ([key, value]) =>
              `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
          )
          .join("&");
      }

      return {
        headers: data.headers,
        method: method,
        url: method == "GET" ? `${url}?${queryString}` : url,
        data: method == "GET" ? {} : paramObj,
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = ClientRequest;
