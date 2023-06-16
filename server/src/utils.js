module.exports.configService = {
  get: (key) => {
    return process.env[key]
  }
}

module.exports.fastify = require('fastify')({ logger: true });

module.exports.getLoginVerifyCodeExpiration = () => {
  return this.configService.get('LOGIN_VERIFY_CODE_EXPIRATION') || 30
}

module.exports.errorEnum = {
  NOT_LOGIN: {
    message: '未登录',
    code: 401,
  }
}