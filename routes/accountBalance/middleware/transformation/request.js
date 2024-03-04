
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

      try{
      //Developer's Responsibility
      this.logger.debug("ClientRequest getPayloadRequest method invoked with parameters :",data);
      // Following variables are fixed and Part of architecture
      let queryString = null;
      let method =  config.get("api.v1.accountBalance.method");
      let url = config.get("api.v1.accountBalance.url");
      let channelId = null;

      const isChannelAllowed = ChannelCodes.allowedChannelCodes.find(
        (channel) => channel.hasOwnProperty(data.headers.xChannelId)
      );
      

      if (isChannelAllowed) {
        channelId = isChannelAllowed[data.headers.xChannelId];
      } else {
        throw new Error("isChannelAllowed is undefined");
      }
  
  
      let paramObj = {
        ReqType: config.get('api.v1.accountBalance.reqType'),
        accountNum: data.body.accountNumber,
        ReqUID:  data.headers.xReqId,
        Channel: channelId
      }
  
      if(method == 'GET'){
        queryString = Object.entries(paramObj).map(([key, value]) =>
            `${encodeURIComponent(key)}=${encodeURIComponent(value)}`).join("&");
      }
  
      
      return {
        headers: data.headers,
        method: method,
        url: method == "GET" ? `${url}?${queryString}` : url,
        data: method == "GET" ? {} : paramObj,
      };
    }catch(error){
      throw error
    }
    }

}



module.exports = ClientRequest;