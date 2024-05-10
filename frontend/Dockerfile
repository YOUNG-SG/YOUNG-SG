FROM node:alpine as builder
WORKDIR /frontend
COPY package.json .
RUN npm ci
COPY ./ ./
RUN npm run build

# 5173 포트 노출
EXPOSE 5173

# npm start 스크립트 실행
CMD ["npm", "run", "dev"]:
