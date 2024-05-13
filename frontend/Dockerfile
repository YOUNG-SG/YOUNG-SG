# 첫 번째 스테이지: 빌드 환경
FROM node:alpine as builder
WORKDIR /frontend
COPY package*.json ./
RUN npm install
COPY ./ ./
RUN npm run build

# 두 번째 스테이지: 실행 환경
FROM node:alpine
WORKDIR /app
COPY --from=builder /frontend/dist /app
COPY --from=builder /frontend/package*.json /app/
RUN npm install
EXPOSE 5173
CMD ["npm", "run", "dev"]