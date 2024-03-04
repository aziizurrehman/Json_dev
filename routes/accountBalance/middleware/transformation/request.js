
const CommonDebugLoggerInstance = require("../../../../common/utils/logger/logger");
const config = require("config");

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
      // for example, following method should return object like this
      // object:{headers:data.headers,url:config.get("api.currencyValidate.v1.url") method:config.get("api.currencyValidate.v1.method"), queryParameters: data.queryParameters}
      //if the url contains path parameters it should be included in the url parameter from here

    //   getPayloadRequest(data) {
    //     let accNum = data.body.accountNumber
    //     let reqId = data.headers.xReqId
     
    //     return {
    //         headers: data.headers,
    //         method: config.get('api.v1.accountBalance.method'),
    //         url: `${config.get('api.v1.accountBalance.url')}ReqType=${config.get('api.v1.accountBalance.reqType')}&accountNum=${accNum}&ReqUID=${reqId}&Channel=${config.get('api.v1.accountBalance.channel')}`,
    //         data: {}
    //     }
    // }

    getPayloadRequest(data) {
      //Developer's Responsibility
      this.logger.debug("ClientRequest getPayloadRequest method invoked with parameters :",data);
      // Following variables are fixed and Part of architecture
      let queryString = null;
      let method =  config.get("api.v1.accountBalance.method");
      let url = config.get("api.v1.accountBalance.url");

  
  
      let paramObj = {
        ReqType: config.get('api.v1.accountBalance.reqType'),
        accountNum: data.body.accountNumber,
        ReqUID:  data.headers.xReqId,
        Channel: config.get('api.v1.accountBalance.channel')
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
    }

}



module.exports = ClientRequest;