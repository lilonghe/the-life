const { configService } = require("./utils");
const axios = require("axios");
const { User, Event, Token } = require("./model");
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
      // 插入示例数据
      await Event.create({
        title: '大学毕业啦！(长按可删除)',
        happenTime: '2017-02-14',
        userId: user.id
      })
      await Event.create({
        title: '第一次使用“浮生记”',
        happenTime: new Date(),
        userId: user.id
      })
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
  const list = await Event.findAll({ where: { userId: user.id }, order: [['happenTime', 'desc']] })
  return list
}

module.exports.createEvent = async (req) => {
  const user = fastify.requestContext.get('user');
  const event = req.body
  event.userId = user.id
  const res = await Event.create(event)
  return res
}

module.exports.updateEvent = async (req) => {
  const user = fastify.requestContext.get('user');
  const event = req.body

  const oldEvent = await Event.findOne({ where: { id: event.id, userId: user.id } });
  if (!oldEvent) {
    return { message: '无效的信息' }
  }

  const res = await Event.update(event, { where: { id: oldEvent.id }})
  return res
}

module.exports.deleteEvent = async (req) => {
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
