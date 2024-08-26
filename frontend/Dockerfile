FROM node:18-alpine
WORKDIR /app
COPY frontend/package*.json ./
RUN npm install -g @angular/cli@17 && npm install
COPY frontend/. .
EXPOSE 4200
CMD ["npm", "start"]
