class ResponseBody {
  constructor({ status, data, msg }) {
    this.status = status;
    this.data = data;
    this.msg = msg;
  }

  build() {
    return {
      status: this.status,
      data: this.data,
      msg: this.msg,
    };
  }
}


module.exports = ResponseBody;

