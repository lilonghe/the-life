require('dotenv').config();

const { fastify, errorEnum } = require('./utils')
const fastifyRedis = require('@fastify/redis')
const { login, findAllEvent, createEvent, deleteEvent } = require('./route')
const { fastifyRequestContextPlugin } = require('@fastify/request-context')
const cors = require('@fastify/cors')

fastify.register(fastifyRedis, {
  host: process.env.REDIS_HOST,
  password: process.env.REDIS_PASS,
  port: process.env.REDIS_PORT,
})

fastify.register(fastifyRequestContextPlugin, {
  hook: 'preValidation',
  defaultStoreValues: () => ({})
});

fastify.register(cors, { 
  origin: (origin, cb) => {
    if (origin) {
      const hostname = new URL(origin).hostname
      if(hostname === "localhost" || hostname.includes('lilonghe.net')){
        cb(null, true)
        return
      }
    } else {
      cb(null, true)
      return
    }
    
    cb(new Error("Not allowed"), false)
  }
})

fastify.addHook('preValidation', async (req, reply) => {
  const { redis } = fastify;
  const userToken = req.headers['token'];
  const publicAPI = ['/login']

  // 没有 token 时检查是否是公开 API
  if (!userToken && !publicAPI.includes(req.routerPath)) {
    reply.send(errorEnum.NOT_LOGIN)
    return
  }

  if (userToken) {
    await redis.get(userToken).then(user => {
      if (user) {
        req.requestContext.set('user', JSON.parse(user));
      } else if(!publicAPI.includes(req.routerPath)){
        // token 失效时再次检查访问的是否是公开 API
        reply.send(errorEnum.NOT_LOGIN)
        return
      }
    })
  } 
});

fastify.get('/login', {}, login);
fastify.get('/events', {}, findAllEvent);
fastify.post('/events', {}, createEvent);
fastify.delete('/events/:id', {}, deleteEvent);

const start = async () => {
  try {
    await fastify.listen({ port: 4001 });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
