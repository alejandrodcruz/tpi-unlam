# Usamos la imagen de Maven con JDK 17 para construir y ejecutar la aplicación
FROM maven:3.9.5-amazoncorretto-17 AS build
WORKDIR /app
COPY . .
RUN mvn clean install -DskipTests

# Imagen para ejecutar la aplicación en modo desarrollo
FROM maven:3.9.5-amazoncorretto-17
WORKDIR /app
COPY --from=build /app /app
EXPOSE 8080
CMD ["mvn", "spring-boot:run"]
