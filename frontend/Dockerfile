FROM node:20-alpine
WORKDIR /app
COPY frontend/package.json ./
COPY frontend/package-lock.json ./
RUN apk add --no-cache python3 build-base
RUN npm install -g @angular/cli@18 && npm install
COPY frontend/. .
EXPOSE 4200
CMD ["npm", "start"]
