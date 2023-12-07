// redisClient.js
const env = require("../config/env.config.js");

const redis = require("redis");

// Redis 클라이언트 생성
const redisClient = redis.createClient({
  url: `redis://${env.REDIS_USERNAME}:${env.REDIS_PASSWORD}@${env.REDIS_HOST}:${env.REDIS_PORT}/0`,
});

// 에러 핸들링을 위한 이벤트 리스너 추가
redisClient.on("error", (error) => console.error(`Redis Error: ${error}`));

// 클라이언트 연결
redisClient.connect().catch(console.error);

module.exports = redisClient;
