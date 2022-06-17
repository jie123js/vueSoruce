const response = {
    _body: null,
    get body() {
        return this._body
    },
    set body(value) { //ctx.body => ctx.response.body
        this.res.statusCode = 200
        this._body = value;
    }
}

module.exports = response
