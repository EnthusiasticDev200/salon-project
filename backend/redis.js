const dotenv = require('dotenv')
const Redis = require('ioredis')

dotenv.config()

const prodRedis = process.env.RENDER_REDIS_PUB_URL ||process.env.REDIS_URL

let redis;
if(process.env.NODE_ENV === 'development' ){
  console.log('Redis runnning on DEVELOPMENT!')
  redis = new Redis({ host: '127.0.0.1', port: 6379 })
} else{
  console.log('Redis runnning on PRODUCTION!')
  redis = new Redis(prodRedis)
}
  
// Event listeners
redis.on('ready', () => console.log('Redis connected'))
redis.on('error', (err) => console.log('Redis error:', err.stack))
redis.on('closed', () => console.log(' Redis connection closed'))


module.exports = redis