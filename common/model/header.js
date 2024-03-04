const Joi = require('../../common/utils/validator/joiValidator').Joi


class CommonHeaders {
  constructor (xChannelId, xSubChannelId, xReqId, xCountryCode, xEndpoint) {
  
    this.xChannelId = xChannelId
    this.xSubChannelId = xSubChannelId
    this.xReqId = xReqId
    this.xCountryCode = xCountryCode
    this.xEndpoint = xEndpoint
  }

  validateSchema () {
    const schema = Joi.object().keys({    
      xChannelId: Joi.string().required(),
      xSubChannelId: Joi.string().required(),
      xReqId: Joi.string().required(),
      xCountryCode: Joi.string().required(),
      xEndpoint: Joi.string()
    })
    return schema.validate(this)
  }
}

module.exports = CommonHeaders
