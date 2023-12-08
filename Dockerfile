# Node.js 버전 변경
FROM node:18

# 작업 디렉토리 설정
WORKDIR /app

# package.json 및 package-lock.json 파일 복사
COPY package*.json ./ 

# 의존성 설치 (프로덕션 모드)
RUN npm ci --only=production

# 프로덕션 환경 변수 설정
ENV NODE_ENV production

# 프로젝트 파일 복사
COPY . .

# Prisma Client 생성
RUN npx prisma generate

# 비루트 사용자로 실행
USER node

# 포트 설정
EXPOSE 4000

# 애플리케이션 실행 명령어
CMD ["npm", "start"]
