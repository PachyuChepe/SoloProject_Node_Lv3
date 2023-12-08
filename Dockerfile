# Node.js 이미지를 기반으로 한다.
FROM node:18

# 작업 디렉토리 설정
WORKDIR /app

# 애플리케이션의 package.json 및 package-lock.json 파일을 컨테이너 내부로 복사
COPY package*.json ./

# 의존성 설치
RUN npm install

# Prisma CLI를 전역으로 설치
RUN npm install -g prisma

# 프로젝트의 나머지 파일들을 컨테이너 내부로 복사
COPY . .

# Prisma Client 생성
RUN npx prisma generate

# 애플리케이션 실행을 위한 포트를 노출 (4000번 포트로 변경)
EXPOSE 4000

# 애플리케이션 실행 명령어
CMD ["node", "src/app.js"]
