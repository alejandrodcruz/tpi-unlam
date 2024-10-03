FROM node:18-alpine
WORKDIR /app
COPY frontend/package.json ./
COPY frontend/package-lock.json ./
RUN apk add --no-cache python3 build-base
RUN npm install -g @angular/cli@18 && npm install
COPY frontend/. .
EXPOSE 80
CMD ["sh", "-c", "ng serve --host 0.0.0.0 --port $PORT"]
