const CommonDebugLoggerInstance = require("../../../../common/utils/logger/logger");
const ResaccountBalance = require('../../model/res_AccountBalance');

class ClientResponse {

    constructor(commonHeaders) {

        this.logger = CommonDebugLoggerInstance.CommonDebugLogger(
          commonHeaders,
          "Transformation=>response.js",
        );
      
      }

    //Developer's Responsibility
    getPayloadResponse(headers, result) {
        this.logger.debug('ClientResponse Payload Params : ', headers.xChannelId, result);
        const res = new ResaccountBalance(result)
        //                                                 result.OUTPUTPARM.TOSALERATE,result.OUTPUTPARM.ERRCODE,result.OUTPUTPARM.ERRMSG,result);
        // this.logger.debug('Client Request Converted to Currency Validation Model', res);
        return res;
    }

}



module.exports = ClientResponse;