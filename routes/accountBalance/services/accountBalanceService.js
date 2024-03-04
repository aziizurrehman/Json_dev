// const CommonHeaders = require("../../../common/model/header");
const APIError = require("../../../common/model/apiError");
const APIResponse = require("../../../common/model/apiResponse");
const ClientService = require("../middleware/clientService");
const APIRequest = require("../../../common/model/apiRequest");
const ReqParamModel = require("../model/req_AccountBalance");
const CommonDebugLoggerInstance = require("../../../common/utils/logger/logger");
const responseErrorCodes = require('../../../common/resources/error_codes.json')
const config = require("config");

class Service {

  constructor(commonHeaders, body) {
    this.logger = CommonDebugLoggerInstance.CommonDebugLogger(
      commonHeaders,
      "currencyRatesValidationService.js",
    );

    this.commonHeaders = commonHeaders;
    this.ReqParamModel = new ReqParamModel(body);
   
  }

  async perform() {
    try {
      //Todo
      //1- Common headers validations
      //2- Field level validations/body validation
      //3- Making Client A/C to requestType i.e: REST,SOAP

      const headerValidationResponse = this.commonHeaders.validateSchema(); 

      this.logger.debug({method:"Service Perform",message: "Request Headers Validation Result",
        headerValidationResult:{error:headerValidationResponse.error}}
       );

      if (headerValidationResponse.error) {

        this.logger.debug({method:"Service Perform", message: "Request Headers Validation Result",headerValidationResult:{error:headerValidationResponse.error}});

        return new APIResponse(
          "Fail",
          {},
          new APIError(
            this.commonHeaders.xReqId,
            "",
            headerValidationResponse.error.details[0].message,
            headerValidationResponse.error.name,
            headerValidationResponse.error.details
          )
        );
      }

      const bodyValidationResponse = this.ReqParamModel.validateSchema(); 

      if (bodyValidationResponse.error) {

        this.logger.debug({method:"Service Perform",  message: "Request Headers Validation Result",bodyValidationResult:{error:bodyValidationResponse.error}});

        return new APIResponse(
          "Fail",
          {},
          new APIError(
            this.commonHeaders.xReqId,
            "",
            // bodyValidationResponse.error.details[0].message,
            "Date Format Must Be YYYY-MM-DD",
            bodyValidationResponse.error.name,
            bodyValidationResponse.error.details
          )
        );
      }

      // Depends on your usecase 
      const apiRequest = new APIRequest(
        this.commonHeaders,
        this.ReqParamModel,
        {},
        {}
      );

      const clientService = new ClientService(
        config.get("api.v1.accountBalance.api_type"),
        this.commonHeaders
      );

      
      const response = await clientService.perform(apiRequest);
      

      if (response.error) {
        if (responseErrorCodes[response.error.code]) {
          return new APIResponse(
            "Fail",
            {},
            new APIError(
              this.commonHeaders.xReqId,
              response.error.code,
              response.error.message,
              responseErrorCodes[response.error.code].message,
              response.error.developerMessage
            )
          );}
      }

      this.logger.debug("Service Response", response);
      //Developer's Responsibility
      // depends on your usecase
      // PreDefined responseCodes
      if (response.data.ResultCode == '00') {

        return new APIResponse(response.message, response.data, {});

      } 
      else if (responseErrorCodes[response.responseCode]) {
        return new APIResponse(
          "Fail",
          {},
          new APIError(
            this.commonHeaders.xReqId,
            response.responseDescription
              ? response.responseDescription.substring(0, 7)
              : "",
            response.responseDescription
              ? response.responseDescription.substring(7).trim()
              : "",
            responseErrorCodes[response.responseCode].message,// "TargetSystemValidationError",
            response.backendResponse
          )
        );
      }
       else {

        return new APIResponse(
          "Fail",
          {},
          new APIError(
            this.commonHeaders.xReqId,
            "",
            "No Response Recieved From Backed System",
            "TargetSystemError",
            response
          ));
      }

    } catch (error) {

      //Logging Error Before Sending
      this.logger.error({method:"ApiNameService.catch()", message:"Error while executing currency rate validation perform method",errorStack: error.stack 
      });
      // 
      return new APIResponse(
        "Fail",
        {},
        new APIError(
          this.commonHeaders.xReqId,
          "",
          "Something went wrong to fullfull the results, Kindly contact with administrator.",
          "APIInternalError",
          error.message
        ));
    }
   
  }
}

module.exports = Service;
