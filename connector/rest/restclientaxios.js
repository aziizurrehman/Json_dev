const cRest = require('axios');
const CommonDebugLoggerInstance = require("../../common/utils/logger/logger");

class RestClientAxios {
    constructor(timeout, commonHeaders) {
        this.commonHeaders = commonHeaders;
        this.logger = CommonDebugLoggerInstance.CommonDebugLogger(
          commonHeaders,
          "restclientaxios.js",
        );
        this.cRest = cRest
        this.timeout = timeout
    }

    async executeAxios(url, headers, method, params) {
        this.logger.debug('RestClient execute method parameters : ', url, headers, method, params)
        const options = {
            url: url,
            headers: headers,
            method: method,
            responseType: 'json',
            data: params,
            timeout: this.timeout
        }
        this.logger.debug('Rest Client options to executed : ', options)
        return this.cRest(options)
    }
}

module.exports = RestClientAxios
