class APIResponse {
  constructor (message = '', data = {}, error = { reqId: '',
code: '',
message: '',
type: '',
developer_message: {} }) {
    this.message = message
    if (JSON.stringify(data) !== '{}') {
      this.responseCode = data.ResultCode

      this.data = data
    }

    if (JSON.stringify(error) !== '{}') {

      this.error = error
    }
  }
}

module.exports = APIResponse
