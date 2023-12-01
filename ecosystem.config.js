module.exports = {
  apps: [
    {
      name: "myapp",
      script: "app.js",
      env: {
        NODE_ENV: "development",
      },
      env_production: {
        NODE_ENV: "production",
      },
    },
  ],
};

// 배포환경 명령어 pm2 start ecosystem.config.js --env production
