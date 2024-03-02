const CommonHeaders = require("../../../common/model/header");
const Service = require("../services/accountStatementService");
const CommonDebugLoggerInstance = require('../../../common/utils/logger/logger')
const responseErrorCodes = require('../../../common/resources/error_codes.json')
const Authenticator = require("../../../common/authentication/channelsAuth");


// 
/**
 * Use PascalConvention for Class Naming ie. ClassName\
 * 
 * Logger Intialization for class
 * const logger = CommonDebugLoggerInstance.CommonDebugLogger(commonHeaders,"stopChequeController.js")
 * @param {Object} commonHeaders
 * @param {string} filename
 * 
 * How to use logger
 * logger.debug({methodName:"InController",message:"Service Object Created Successfully!!!",param:param})
 * @param {string} methodName
 * @param {string} message
 * @param {any} param
 * 
 * 
 */

const Controller = function (req, res) {

//Header Validation
 const authRes = Authenticator.authenticate(req);
  if (authRes && authRes.error && authRes.error.type === "Unauthorized") {
    res.status(401);
    return res.send(authRes);
  }
 
  const commonHeaders = new CommonHeaders(
    req.headers["x-channel-id"],
    req.headers["x-sub-channel-id"],
    req.headers["x-req-id"],
    req.headers["x-country-code"],
    req.headers['x-endpoint']

  )

  //Developer will be responisible for only following line for logging
  const logger = CommonDebugLoggerInstance.CommonDebugLogger(commonHeaders,"accountStatementController.js")

   
  let service = new Service(commonHeaders, req.body);

  logger.debug({methodName:"InController",message:"Service Object Created Successfully!!!",param:"1bc1234"})

  service
    .perform()
    .then(async (result) => {

      logger.debug({methodName:"perform",message:"Result From service",result:result})
      
      let statusObj = result.error ? responseErrorCodes[result.error.type] : undefined
      let statusCode = statusObj ? statusObj : responseErrorCodes['Success']

      res.status(statusCode.code).json(result);
    
    })
    .catch((error) => {
      logger.error(
        { errorStack: error.stack },
        "Error in Stop Cheque V1 Controller while serving client request"
      );
      //logger.error('Error in Account Validate Controller while serving client request : ', error.stack);
      res.status(500).json(error.stack);
      logger.debug(
        { statusCode: 500, responseController: error.stack },
        "In Conroller Response Stop Cheque Service V1"
      );
      return res;
    });


};

module.exports = {
  Controller: Controller,
};
