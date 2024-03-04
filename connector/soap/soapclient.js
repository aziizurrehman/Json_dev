
class SoapClient {

    constructor(endpoint, requestUrl, clientOptions = {}) {
        this.soap = require('soap');
        this.endpoint = endpoint;
        this.requestUrl = requestUrl;
        this.clientOptions = clientOptions;
        this.client = false;
    }

    async getClient() { 
        if (this.client) {
            return this.client;
        }
        var Soapoptions = {
            disableCache: true,
            escapeXML: false,
            envelopeKey: '',

        };
        this.client = await this.soap.createClientAsync(this.requestUrl, Soapoptions);
        return this.client;
    }

}


module.exports = SoapClient;