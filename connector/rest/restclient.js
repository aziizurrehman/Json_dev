const cRest = require('request-promise')
const CommonDebugLoggerInstance = require("../../common/utils/logger/logger");


class RestClient {
    constructor(timeout, commonHeaders) {
        this.commonHeaders = commonHeaders;
        this.logger = CommonDebugLoggerInstance.CommonDebugLogger(
          commonHeaders,
          "restclient.js",
        );
        this.cRest = cRest
        this.timeout = timeout
    }

    async execute(url, headers, method, params) {
        const options = {
            url: url,
            headers: headers,
            method: method,
            json: true,
            body: params,
            timeout: this.timeout
        }
      
        this.logger.debug({method:"restclient.execute",message:'Rest Client options to executed : ', options:options})
        return this.cRest(options)
    }

    async executeSSL(url, headers, method, params,sslpath) {
        this.logger.debug('RestClient execute method parameters : ', url, headers, method, params)
        const options = {
            url: url,
            headers: headers,
            method: method,
            json: true,
            body: params,
            timeout: this.timeout,
            ca: sslpath,
        }
       
        this.logger.debug('Rest Client options to executed : ', options)
        return this.cRest(options)
    }


    async executeFormData(url, headers, method, params) {
        this.logger.debug('RestClient execute method parameters : ', url, headers, method, params)
        const options = {
            url: url,
            headers: headers,
            method: method,
            json: true,
            form: params,
            timeout: this.timeout
        }
        this.logger.debug('Rest Client options to executed : ', options)
        return this.cRest(options)
    }
}

module.exports = RestClient
