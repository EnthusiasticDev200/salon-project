const dotenv = require('dotenv')
const Redis = require('ioredis')

dotenv.config()

let redis;
if(process.env.NODE_ENV === 'development' ){
  console.log('Redis runnning on DEVELOPMENT!')
  redis = new Redis({ host: '127.0.0.1', port: 6379 })
} process.env.RENDER_REDIS_PUB_URL

// Event listeners
redis.on('ready', () => console.log('Redis connected'))
redis.on('error', (err) => console.log('Redis error:', err.stack))
redis.on('closed', () => console.log(' Redis connection closed'))


module.exports = redis