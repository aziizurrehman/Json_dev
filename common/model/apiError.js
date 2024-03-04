class APIError {
  constructor (reqId, code, message, type, developerMessage) {
    this.reqId = reqId
    this.message = message
    this.code = code
    this.type = type
    this.developerMessage = developerMessage
  }
}

module.exports = APIError
