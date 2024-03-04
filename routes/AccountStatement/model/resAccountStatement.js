    class ResAccountStatementModel {

    //Developer's Responsibility
    constructor(result) {
        // this.responseCode = result.ResultCode;
        this.data = result;
        this.message = result.Message;
    }
}


module.exports = ResAccountStatementModel;