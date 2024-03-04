const config = require("config");
const ApiError = require("../common/model/apiError");
const SoapClient = require("../connector/soap/soapclient");
const RestClient = require("../connector/rest/restclient");
const RestClientAxios = require("../connector/rest/restclientaxios");
const CommonDebugLoggerInstance = require("../common/utils/logger/logger");

class Client {
  constructor(
    clientName,
    properties = {
      url: "",
      wsdl_path: "",
    },
    commonHeaders
  ) {
    this.commonHeaders = commonHeaders;
    this.logger = CommonDebugLoggerInstance.CommonDebugLogger(
      commonHeaders,
      "client.js"
    );

    this.logger.debug({
      method: "Client Constructor",
      message: "ClientService Object Requested with ",
      clientName,
    });

    if (clientName === "SOAP") {
      this.cSoap = new SoapClient(properties.url, properties.wsdl_path);

      this.logger.debug({
        method: "Client.Constructor()",
        message: "Soap Client Object Cunstructed :",
        client: this.cSoap,
      });
    } else if (clientName === "REST") {
      this.cRest = new RestClient(
        config.get("rest.requestTimeOut"),
        this.commonHeaders
      );
      this.cRestAxios = new RestClientAxios(
        config.get("rest.requestTimeOut"),
        this.commonHeaders
      );

      this.logger.debug({
        method: "Client.Constructor()",
        message: "REST Client Object Constrcuted :",
        client: this.cRest,
      });
    } else if (clientName === "DB") {
      this.logger.debug("DB Client Parameters : ");
    }
  }
  // following methods must be packaged
  async performSoapRequest(xReqId, soapOperation, requestXML) {
    this.logger.debug("SOAP Operation Name : ", soapOperation);
    this.logger.debug("SOAP Request XML : ", requestXML);
    try {
      const client = await this.cSoap.getClient();
      this.logger.debug(
        "SOAP Client constructed with Request xml :",
        requestXML
      );
      this.logger.debug("SOAP Client constructed : ", client);
      const [response, rawResponse, soapheader, rawRequest] = await client[
        soapOperation + "Async"
      ](requestXML);
      this.logger.debug("SOAP Client RAW Reqeust : ", rawRequest);
      this.logger.debug("SOAP Client Headers : ", soapheader);
      this.logger.debug("SOAP Client RAW Response : ", rawResponse);
      this.logger.debug("SOAP Client Response : ", response);
      return response;
    } catch (err) {
      this.logger.error("Error while performing SOAP Request : ", err.stack);
      const response = await this.generateErrorResponse(err, xReqId);
      this.logger.debug(
        "API Error generated after recieving SOAP Error : ",
        response
      );
      return response;
    }
  }

  async performRestRequest(headers, paramObj, methodType, requestUrl) {
    this.logger.debug(
      "PerformRestRequest Recived Method Parameters : ",
      " Headers : ",
      headers,
      "paramObj : ",
      paramObj,
      "methodType : ",
      methodType,
      "requestUrl : ",
      requestUrl
    );
    try {
      //  //Depends on scenairo, developer will code.
      //   let response = {}
      //    response['NACTA'] = await this.cRest.execute(requestUrl, headers, methodType, paramObj.nactaPayload)
      //    response['BIOMETRIC'] = await this.cRest.execute(requestUrl, headers, methodType, paramObj)

      const response = await this.cRest.execute(
        requestUrl,
        headers,
        methodType,
        paramObj
      );

      this.logger.debug({
        method: "client.performRestRequest()",
        message: "RestClient Recieved Response : ",
        response: response,
      });

      return response;
    } catch (err) {
      // this.logger.error('Error while performing Rest Request : ', err)

      const response = await this.generateErrorResponse(err, headers.xReqId);

      this.logger.debug({
        method: "performRestRequest().catch()",
        message: "API Error generated after recieving Rest Error : ",
        response: response,
      });
      return response;
    }
  }

  async performRestRequestSSL(
    headers,
    paramObj,
    methodType,
    requestUrl,
    sslpath
  ) {
    this.logger.debug(
      "PerformRestRequest Recieved Method Parameters : ",
      " Headers : ",
      headers,
      "paramObj : ",
      paramObj,
      "methodType : ",
      methodType,
      "requestUrl : ",
      requestUrl
    );
    try {
      const response = await this.cRest.executeSSL(
        requestUrl,
        headers,
        methodType,
        paramObj,
        sslpath
      );

      this.logger.debug("RestClient Recieved Response : ", response);
      return response;
    } catch (err) {
      this.logger.error("Error while performing Rest Request : ", err);
      const response = await this.generateErrorResponse(err, headers.xReqId);
      this.logger.debug(
        "API Error generated after recieving Rest Error : ",
        response
      );
      return response;
    }
  }

  async performRestRequestFormData(headers, paramObj, methodType, requestUrl) {
    this.logger.debug(
      "PerformRestRequest Recived Method Parameters : ",
      " Headers : ",
      headers,
      "paramObj : ",
      paramObj,
      "methodType : ",
      methodType,
      "requestUrl : ",
      requestUrl
    );
    try {
      const response = await this.cRest.executeFormData(
        requestUrl,
        headers,
        methodType,
        paramObj
      );
      this.logger.debug("RestClient Recieved Response : ", response);
      return response;
    } catch (err) {
      this.logger.error("Error while performing Rest Request : ", err);
      const response = await this.generateErrorResponse(err, headers.xReqId);
      this.logger.debug(
        "API Error generated after recieving Rest Error : ",
        response
      );
      return response;
    }
  }

  async performRestRequestAxios(headers, paramObj, methodType, requestUrl) {
    this.logger.debug(
      "PerformRestRequest Recieved Method Parameters : ",
      " Headers : ",
      headers,
      "paramObj : ",
      paramObj,
      "methodType : ",
      methodType,
      "requestUrl : ",
      requestUrl
    );
    try {
      const response = await this.cRestAxios.executeAxios(
        requestUrl,
        headers,
        methodType,
        paramObj
      );
      
      this.logger.debug("RestClient Recieved Response : ", response);
      return response.data;
    } catch (err) {
      this.logger.error("Error while performing Rest Request : ", err);
      const response = await this.generateErrorResponseAxios(
        err,
        headers.xReqId
      );
      this.logger.debug(
        "API Error generated after recieving Rest Error : ",
        response
      );
      return response;
    }
  }

  async performRestRequestFormDataAxios(
    headers,
    paramObj,
    methodType,
    requestUrl
  ) {
    this.logger.debug(
      "PerformRestRequest Recived Method Parameters : ",
      " Headers : ",
      headers,
      "paramObj : ",
      paramObj,
      "methodType : ",
      methodType,
      "requestUrl : ",
      requestUrl
    );
    try {
      const response = await this.cRestAxios.executeFormDataAxios(
        requestUrl,
        headers,
        methodType,
        paramObj
      );
      this.logger.debug("RestClient Recieved Response : ", response);
      return response.data;
    } catch (err) {
      this.logger.error("Error while performing Rest Request : ", err);
      const response = await this.generateErrorResponseAxios(
        err,
        headers.xReqId
      );
      this.logger.debug(
        "API Error generated after recieving Rest Error : ",
        response
      );
      return response;
    }
  }

  async generateErrorResponse(err, xReqId) {
    const soapConnectionErrors = [
      "ENETUNREACH",
      "ECONNREFUSED",
      "EHOSTUNREACH",
      "ETIMEDOUT",
      "ESOCKETTIMEDOUT",
      "READ_TIMEOUT",
      "CONNECT_TIMEOUT",
      "EHOSTDOWN",
    ];
    if (err) {
      if (soapConnectionErrors.includes(err.error.code)) {
        if (err.error.syscall === "connect") {
          return {
            error: new ApiError(
              xReqId,
              err.error.code,
              "Connection timeout",
              "TargetSystemError",
              err.stack
            ),
          };
        } else {
          return {
            error: new ApiError(
              xReqId,
              err.error.code,
              "Target System Error",
              "TargetSystemError",
              err.stack
            ),
          };
        }
      }
      if (err.statusCode && err.statusCode !== 400) {
        return {
          error: new ApiError(
            xReqId,
            err.statusCode,
            err.message,
            "TargetSystemValidationError",
            err.stack
          ),
        };
      }
      if (err.statusCode && err.statusCode !== 200) {
        return {
          error: new ApiError(
            xReqId,
            err.statusCode,
            err.message,
            "TargetSystemError",
            err.stack
          ),
        };
      }

      return {
        error: new ApiError(
          xReqId,
          "",
          "The service is not responding currently, Kindly try again or contact with Administrator.",
          "TargetSystemError",
          err.stack
        ),
      };
    }
  }

  async generateErrorResponseAxios(err, xReqId) {
    const axiosConnectionErrors = [
      "ECONNABORTED",
      "ENETUNREACH",
      "ECONNREFUSED",
      "EHOSTUNREACH",
      "ETIMEDOUT",
      "ESOCKETTIMEDOUT",
      "READ_TIMEOUT",
      "CONNECT_TIMEOUT",
      "EHOSTDOWN",
    ];
    if (err) {
      if (axiosConnectionErrors.includes(err.code)) {
        return {
          error: new ApiError(
            xReqId,
            err.code,
            "Connection timeout",
            "TargetSystemError",
            err.stack
          ),
        };
      }
      if (err.response.status && err.response.status !== 400) {
        return {
          error: new ApiError(
            xReqId,
            err.response.status,
            err.response.statusText,
            "TargetSystemValidationError",
            err.response.data
          ),
        };
      }
      if (err.response.status && err.response.status !== 200) {
        return {
          error: new ApiError(
            xReqId,
            err.response.status,
            err.message,
            "TargetSystemError",
            err.response.data
          ),
        };
      }

      return {
        error: new ApiError(
          xReqId,
          "",
          "The service is not responding currently, Kindly try again or contact with Administrator.",
          "TargetSystemError",
          err.stack
        ),
      };
    }
  }
}

module.exports = Client;
