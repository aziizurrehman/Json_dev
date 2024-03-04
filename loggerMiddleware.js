const loggerInstance = require('./common/utils/logger/logger')
const CommonHeaders = require('./common/model/header')

// This file should be packaged.

const loggerMiddleware = async (req, res, next) => {
    req = await extractEndpoint(req);
    const commonHeaders = new CommonHeaders(
        req.headers["x-channel-id"],
        req.headers["x-sub-channel-id"],
        req.headers["x-req-id"],
        req.headers["x-country-code"],
        req.headers['x-endpoint']
    
      )
  
    const logger = loggerInstance.pinoChildInstance(commonHeaders["xChannelId"], {
        reqId: commonHeaders["xReqId"],
        endpointName: commonHeaders['xEndpoint'],
        fileName: "loggerMiddleware.js",
        TopicName: "Test-Topic",
        Partition: "Test-Partition",

    });

    let ReqUrl = req.protocol + ':' + req.headers.host + req.originalUrl;

    const logMessage = {
        message: 'Incoming Request',
        requestData: {
            url: ReqUrl,
            reqMethod: req.method,
            body: req.body
        }
    };

    logger.info(logMessage);

    const originalJson = res.json;

    res.json = function (data) {
        const responseLog = {
            message: 'Outgoing Response',
            ResponseData: {
                statusCode: res.statusCode,
                data: data,
            }
        };
        logger.info(responseLog);

        return originalJson.call(this, data);
    };

    next();
};

function extractEndpoint(req){
    let parts = req.originalUrl.split('/');
    //Path param desicion implementation 
    req.headers['x-endpoint'] = parts[parts.length-1]

    return req

}

module.exports = loggerMiddleware