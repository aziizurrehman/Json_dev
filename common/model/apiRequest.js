class APIRequest {
  constructor (headers, body, queryParams, pathParams) {
    this.headers = headers
    this.body = body
    this.queryParams = queryParams
    this.pathParams = pathParams
  }
}

module.exports = APIRequest
