class APIResponse {
  constructor (message = '', data = {}, error = { reqId: '',
code: '',
message: '',
type: '',
developer_message: {} }) {
    this.message = message
    this.responseCode = data.ResultCode
    if (JSON.stringify(data) !== '{}') {

      this.data = data
    }

    if (JSON.stringify(error) !== '{}') {

      this.error = error
    }
  }
}

module.exports = APIResponse
