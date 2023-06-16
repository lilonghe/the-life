const { configService } = require("./utils");
const axios = require("axios");
const { User, Event } = require("./model");
const uuid = require("uuid");
const { fastify } = require('./utils')

module.exports.login = async (request, reply) => {
  const code = request.query.code;
  if (!code) {
    return { message: '无效的 Code' }
  }

  const { redis } = fastify;

  const userToken = request.headers['token']
  if (userToken) {
    const result = await redis.get(userToken)
    if (result) {
      await redis.expire(userToken, 28800)
      return { token: userToken };
    }
  }

  const appid = configService.get('WX_APPID');
  const secret = configService.get('WX_APPSECRET');
  const res = await axios.get(
    `${configService.get('WX_BASEURL')}/sns/jscode2session?appid=${appid}&secret=${secret}&js_code=${code}&grant_type=authorization_code`,
  );
  if (res.data?.openid) {
    let user = await User.findOne({ where: { wxOpenId: res.data.openid }});
    let isSignUp = false;
    if (!user) {
      user = await User.create({
        wxOpenId: res.data.openid,
      });
      isSignUp = true;
    }
    const token = uuid.v4();
    await redis.set(token, JSON.stringify(user), 'EX', 28800);
    await Token.create({ token, userId: user.wxOpenId, platform: 'wx_mp' });
    return {
      token,
      isSignUp,
    };
  } else {
    console.error(res.data);
  }
  return {
    message: '登录失败',
  };
}

module.exports.findAllEvent = async (req) => {
  const user = fastify.requestContext.get('user');
  const list = await Thing.findAll({ where: { userId: user.id }, order: [['createdAt', 'desc']] })
  return list
}

module.exports.createEvent = async (req) => {
  const user = fastify.requestContext.get('user');
  const event = req.body
  event.userId = user.id
  const res = await Event.create(thing)
  return res
}

module.exports.updateEvent = async (req) => {
  const user = fastify.requestContext.get('user');
  const thing = req.body

  const oldEvent = await Event.findOne({ where: { id: thing.id, userId: user.id } });
  if (!oldThing) {
    return { message: '无效的信息' }
  }

  const res = await Event.update(event, { where: { id: thing.id }})
  return res
}

module.exports.deleteThing = async (req) => {
  const user = fastify.requestContext.get('user');
  const id = req.params['id']
  const res = await Event.findOne({ where: { id } })
  if (res) {
    if (res.userId !== user.id) {
      return { message: '无效的请求' }
    }

    const delRes = await Event.destroy({ where: { id } })
    return delRes
  }
  return {}
}
