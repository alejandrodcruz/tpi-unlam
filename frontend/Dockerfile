FROM node:18-alpine AS build
WORKDIR /app
COPY frontend/package.json frontend/package-lock.json ./
RUN apk add --no-cache python3 build-base
RUN npm install -g @angular/cli@18 && npm install
COPY frontend/. .
RUN ng build --prod
FROM nginx:alpine
COPY --from=build /app/dist/tu-proyecto-angular /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
EXPOSE 80
CMD ["/entrypoint.sh"]
