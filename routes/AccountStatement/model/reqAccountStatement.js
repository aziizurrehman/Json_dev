const Joi = require('../../../common/utils/validator/joiValidator').Joi



class ReqAccountStatementModel {

    constructor(body) {
        this.accountNumber = body.accountNumber     ;
        this.fromDate = body.fromDate;
        this.toDate = body.toDate;
    }

    //Developer's Responsibility
    // find the Replacement of regex
    validateSchema() {
        const schema = Joi.object().keys({
            accountNumber: Joi.string().required(),
            fromDate: Joi.date().iso().required(),
            // toDate : Joi.date().iso().greater(Joi.ref('fromDate')).required()
            toDate : Joi.date().iso().required()
        
        });

        return schema.validate(this);
    }

}
module.exports = ReqAccountStatementModel;