const Joi = require('../../../common/utils/validator/joiValidator').Joi



class ReqaccountBalanceModel {

    constructor(body) {
        this.accountNumber = body.accountNumber     ;
    
    }

    //Developer's Responsibility
    // find the Replacement of regex
    validateSchema() {
        const schema = Joi.object().keys({
            accountNumber: Joi.string().required(),
        });

        return schema.validate(this);
    }

}
module.exports = ReqaccountBalanceModel;