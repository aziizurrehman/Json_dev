const config = require("config");
const Client = require("../../../connector/client");
const ClientRequest = require("./transformation/request");
const ClientResponse = require("./transformation/response");
const CommonDebugLoggerInstance = require("../../../common/utils/logger/logger");


class ClientService {

  constructor(client_name, commonHeaders) {
    this.commonHeaders = commonHeaders;
    this.logger = CommonDebugLoggerInstance.CommonDebugLogger(
      commonHeaders,
      "clientService.js",
    );

    this.logger.debug({method:"ClientService Constructor",message:"ClientService Object Requested with ", client_name});

    this.client = new Client(client_name, {}, this.commonHeaders);
  }

  async perform(apiRequest) {

    this.logger.debug(
     { 
      method:"ClientService().perform()",
      message:"ClientService perform method invoked with parameters : ",
      apiRequest:apiRequest
    }
    );

    const clientRequest = new ClientRequest(this.commonHeaders);
    const payload = clientRequest.getPayloadRequest(apiRequest)
    

    this.logger.debug(
      { 
      method:"ClientService().perform" ,
      message:"ClientRequest Generated Payload Request FT RTGS V1",
      payload: payload}
    );
      console.log(payload.url)
    //Developer's Responsibility
    // const result = await this.client.performRestRequest(
    //   apiRequest.headers,
    //   payload,
    //   config.get("api.currencyValidate.v1.method"),
    //   config.get("api.currencyValidate.v1.url"),
    // );
    const result = await this.client.performRestRequest(
      payload.headers,
      payload.data,
      payload.method,
      payload.url
    );

    this.logger.debug({ method:"ClientService.perform()",message:"Client Recieved Response from MISYS  FT V1", result: result});
    
    if (result.error) {
      return result;
    }

    const clientResponse = new ClientResponse(this.commonHeaders);

    this.logger.debug({method:"ClientService.perform()",message:"ClientResponse Object Constructed :", clientResponse});

    return clientResponse.getPayloadResponse(apiRequest.headers, result);
  }
}

module.exports = ClientService;
