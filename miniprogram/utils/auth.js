var sha1 = require('./sha1')

var authCodeGenerator = {
  clientCode: '965cda1983f569b03abfb80dc9af8dd8',
  timestamp:  Date.parse(new Date()),
  updateTimestamp: function () {
    this.timestamp =  Date.parse(new Date());
    return this.timestamp;
  },

  randomCode: function (openid) {
    this.timestamp =  Date.parse(new Date());
    console.log(sha1("RandomCode ["+openid+"]["+this.timestamp+"]["+this.clientCode+"]"))
    return sha1("RandomCode ["+openid+"]["+this.timestamp+"]["+this.clientCode+"]");
  },

  signed: function (openid, token) {
    return sha1("SIGN ["+openid+"]["+this.randomCode(openid)+"]["+token+"]")
  }
}

module.exports = {authCodeGenerator}